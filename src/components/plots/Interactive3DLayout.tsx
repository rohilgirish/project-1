'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Plot, FilterState } from '@/types';
import { formatINR, getStatusColor } from '@/lib/utils';
import { Compass, Sun, Moon, RotateCcw, Layers, ZoomIn, ZoomOut, Info, Image as ImageIcon, Navigation } from 'lucide-react';
import TruckLoader from '@/components/ui/TruckLoader';

interface Props {
  plots: Plot[];
  selectedPlot: Plot | null;
  onSelectPlot: (plot: Plot) => void;
  filters: FilterState;
}

type SunMode = 'morning' | 'noon' | 'sunset';

export default function Interactive3DLayout({ plots, selectedPlot, onSelectPlot, filters }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredPlot, setHoveredPlot] = useState<Plot | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [sunMode, setSunMode] = useState<SunMode>('noon');
  const [compassAngle, setCompassAngle] = useState(0);
  const [isTopDown, setIsTopDown] = useState(false);
  const [showRoadArrows, setShowRoadArrows] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showCadModal, setShowCadModal] = useState(false);
  const [cadModalTab, setCadModalTab] = useState<'cad' | 'survey'>('cad');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const plotMeshesRef = useRef<Map<number, { mesh: THREE.Mesh; outline: THREE.LineSegments; initialY: number }>>(new Map());
  const roadArrowsGroupRef = useRef<THREE.Group | null>(null);
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  const matchesFilter = useCallback((p: Plot): boolean => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.number.toLowerCase().includes(q) && !p.size.toLowerCase().includes(q)) return false;
    }
    if (filters.size !== 'all' && p.size !== filters.size) return false;
    if (filters.facing !== 'all' && !p.facing.toLowerCase().includes(filters.facing.toLowerCase())) return false;
    if (filters.status !== 'all' && p.status !== filters.status) return false;
    if (filters.cornerOnly && !p.isCorner) return false;
    if (filters.parkFacingOnly && !p.isParkFacing) return false;
    if (filters.mainBoulevardOnly && !p.isMainBoulevard) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    return true;
  }, [filters]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 650;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a1120);
    scene.fog = new THREE.FogExp2(0x0a1120, 0.0042);

    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 130, 140);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 20;
    controls.maxDistance = 240;
    controls.target.set(0, 0, -10);

    // Ambient and Hemisphere Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x064e3b, 0.75);
    hemiLightRef.current = hemiLight;
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.9);
    dirLight.position.set(45, 95, 55);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 320;
    const d = 120;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    dirLightRef.current = dirLight;
    scene.add(dirLight);

    // ----------------------------------------------------
    // 1. Surrounding Landscape & 2-Acre Layout Ground
    // ----------------------------------------------------
    const outerGroundGeo = new THREE.PlaneGeometry(300, 260, 16, 16);
    const outerGroundMat = new THREE.MeshStandardMaterial({
      color: 0x08130e,
      roughness: 0.95,
      metalness: 0.05
    });
    const outerGround = new THREE.Mesh(outerGroundGeo, outerGroundMat);
    outerGround.rotation.x = -Math.PI / 2;
    outerGround.position.y = -0.05;
    outerGround.receiveShadow = true;
    scene.add(outerGround);

    const layoutGroundGeo = new THREE.PlaneGeometry(180, 150, 24, 24);
    const layoutGroundMat = new THREE.MeshStandardMaterial({
      color: 0x0f291e,
      roughness: 0.88,
      metalness: 0.1
    });
    const layoutGround = new THREE.Mesh(layoutGroundGeo, layoutGroundMat);
    layoutGround.rotation.x = -Math.PI / 2;
    layoutGround.receiveShadow = true;
    scene.add(layoutGround);

    const gridHelper = new THREE.GridHelper(180, 36, 0x1d4d38, 0x133827);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Perimeter boundary wall
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const wallPillars = [
      [-75, 40], [80, 40], [80, -65], [-75, -65]
    ];
    // Perimeter fence lines
    const perimeterPoints = [
      new THREE.Vector3(-75, 0.5, 40),
      new THREE.Vector3(80, 0.5, 40),
      new THREE.Vector3(80, 0.5, -65),
      new THREE.Vector3(-55, 0.5, -65),
      new THREE.Vector3(-75, 0.5, -45),
      new THREE.Vector3(-75, 0.5, 40)
    ];
    const perimeterGeo = new THREE.BufferGeometry().setFromPoints(perimeterPoints);
    const perimeterLine = new THREE.Line(perimeterGeo, new THREE.LineBasicMaterial({ color: 0xd97706, linewidth: 2 }));
    scene.add(perimeterLine);

    // ----------------------------------------------------
    // 2. Realistic Asphalt Roads & Concrete Curbs
    // ----------------------------------------------------
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.82,
      metalness: 0.25
    });
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.5
    });

    const addRoadWithCurbs = (x: number, z: number, w: number, d: number) => {
      const road = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(x, 0.04, z);
      road.receiveShadow = true;
      scene.add(road);

      // Curbs along edges
      if (w > d) {
        // Horizontal road (curbs top and bottom)
        const curbNorth = new THREE.Mesh(new THREE.BoxGeometry(w, 0.18, 0.4), curbMat);
        curbNorth.position.set(x, 0.09, z + d / 2);
        curbNorth.receiveShadow = true;
        scene.add(curbNorth);

        const curbSouth = new THREE.Mesh(new THREE.BoxGeometry(w, 0.18, 0.4), curbMat);
        curbSouth.position.set(x, 0.09, z - d / 2);
        curbSouth.receiveShadow = true;
        scene.add(curbSouth);
      } else {
        // Vertical road (curbs left and right)
        const curbWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, d), curbMat);
        curbWest.position.set(x - w / 2, 0.09, z);
        curbWest.receiveShadow = true;
        scene.add(curbWest);

        const curbEast = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, d), curbMat);
        curbEast.position.set(x + w / 2, 0.09, z);
        curbEast.receiveShadow = true;
        scene.add(curbEast);
      }
    };

    // 1. South 9.0m Main Boulevard (Runs 125m East-West across all blocks)
    addRoadWithCurbs(0, -40, 136, 9.0);

    // 2. West Access Road (Connects Highway entry to layout)
    addRoadWithCurbs(-62, -10, 9.0, 120);

    // 3. Avenue 1 (Between Plots 06-10 and Civic Amenity - 9.0m road)
    addRoadWithCurbs(-23.5, 0, 9.0, 72);

    // 4. Avenue 2 (Between Plots 11-15 and Plots 16-20 - 9.0m road)
    addRoadWithCurbs(20, 0, 9.0, 72);

    // 5. Park Avenue (Between Plots 21-25 and the 48m Botanical Park - 9.0m road)
    addRoadWithCurbs(53.5, 0, 9.0, 72);

    // Yellow Dashed Centerlines
    const addDashedLine = (x1: number, z1: number, x2: number, z2: number, segments = 12) => {
      const dashMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const dx = (x2 - x1) / segments;
      const dz = (z2 - z1) / segments;
      for (let i = 0; i < segments; i += 2) {
        const sx = x1 + dx * i + dx * 0.5;
        const sz = z1 + dz * i + dz * 0.5;
        const len = Math.hypot(dx, dz);
        const ang = Math.atan2(dz, dx);
        const dash = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.8, 0.25), dashMat);
        dash.rotation.x = -Math.PI / 2;
        dash.rotation.z = -ang;
        dash.position.set(sx, 0.055, sz);
        scene.add(dash);
      }
    };

    addDashedLine(-64, -40, 64, -40, 24);
    addDashedLine(-62, -60, -62, 40, 20);
    addDashedLine(-23.5, -34, -23.5, 34, 14);
    addDashedLine(20, -34, 20, 34, 14);
    addDashedLine(53.5, -34, 53.5, 34, 14);

    // Zebra Crossings
    const addZebraCrossing = (x: number, z: number, isHorizontal: boolean) => {
      const zebraGroup = new THREE.Group();
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const numStripes = 6;
      for (let i = 0; i < numStripes; i++) {
        const stripe = new THREE.Mesh(
          new THREE.PlaneGeometry(isHorizontal ? 0.7 : 4.5, isHorizontal ? 4.5 : 0.7),
          stripeMat
        );
        stripe.rotation.x = -Math.PI / 2;
        if (isHorizontal) {
          stripe.position.set((i - numStripes / 2 + 0.5) * 1.3, 0.052, 0);
        } else {
          stripe.position.set(0, 0.052, (i - numStripes / 2 + 0.5) * 1.3);
        }
        zebraGroup.add(stripe);
      }
      zebraGroup.position.set(x, 0, z);
      scene.add(zebraGroup);
    };

    addZebraCrossing(-62, -35, true);  // Near Grand Entrance
    addZebraCrossing(-23.5, -35, true); // Near Civic Amenity
    addZebraCrossing(53.5, -35, true);  // Near Park Entrance

    // ----------------------------------------------------
    // 3. Directional Road Flow Arrows ("put arrow how road goes")
    // ----------------------------------------------------
    const roadArrowsGroup = new THREE.Group();
    roadArrowsGroupRef.current = roadArrowsGroup;
    scene.add(roadArrowsGroup);

    // Vector Chevron Arrow Shape
    const createArrowShape = (len = 2.8, shaftW = 0.9, headW = 1.9, headLen = 1.2) => {
      const shape = new THREE.Shape();
      const hs = shaftW / 2;
      const hh = headW / 2;
      const sl = len - headLen;
      shape.moveTo(-hs, -len / 2);
      shape.lineTo(hs, -len / 2);
      shape.lineTo(hs, sl - len / 2);
      shape.lineTo(hh, sl - len / 2);
      shape.lineTo(0, len / 2);
      shape.lineTo(-hh, sl - len / 2);
      shape.lineTo(-hs, sl - len / 2);
      shape.closePath();
      return shape;
    };

    const arrowShape = createArrowShape();
    const arrowGeo = new THREE.ShapeGeometry(arrowShape);
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });
    const arrowGlowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    const addRoadArrow = (x: number, z: number, rotY: number, isEntry = false) => {
      const arrow = new THREE.Mesh(arrowGeo, isEntry ? arrowGlowMat : arrowMat);
      arrow.rotation.x = -Math.PI / 2;
      arrow.rotation.z = rotY;
      arrow.position.set(x, 0.065, z);
      roadArrowsGroup.add(arrow);
    };

    // Flow Arrows Network:
    // A. Entrance from Highway into Layout (South-West Inflow)
    addRoadArrow(-62, -55, 0, true);          // Entry straight north
    addRoadArrow(-62, -45, 0, true);          // Through Grand Arch
    addRoadArrow(-60, -38, -Math.PI / 2);      // Curve turning East into Boulevard

    // B. Main South Boulevard (Eastbound Lane: toward Park)
    addRoadArrow(-45, -42.2, -Math.PI / 2);
    addRoadArrow(-15, -42.2, -Math.PI / 2);
    addRoadArrow(10, -42.2, -Math.PI / 2);
    addRoadArrow(36, -42.2, -Math.PI / 2);
    addRoadArrow(50, -42.2, -Math.PI / 2);

    // C. Main South Boulevard (Westbound Lane: toward Exit)
    addRoadArrow(45, -37.8, Math.PI / 2);
    addRoadArrow(25, -37.8, Math.PI / 2);
    addRoadArrow(-5, -37.8, Math.PI / 2);
    addRoadArrow(-35, -37.8, Math.PI / 2);
    addRoadArrow(-58, -37.8, Math.PI); // Turning South to exit

    // D. Avenue 1 (Northbound into Col 2 & Civic Amenity)
    addRoadArrow(-23.5, -28, 0);
    addRoadArrow(-23.5, -6, 0);
    addRoadArrow(-23.5, 18, 0);
    addRoadArrow(-23.5, 30, Math.PI); // U-Turn loop south

    // E. Avenue 2 (Northbound between Plots 11-15 & 16-20)
    addRoadArrow(20, -28, 0);
    addRoadArrow(20, -6, 0);
    addRoadArrow(20, 18, 0);
    addRoadArrow(20, 30, Math.PI); // U-Turn loop south

    // F. Park Avenue (Northbound along 48m Botanical Park)
    addRoadArrow(53.5, -28, 0);
    addRoadArrow(53.5, -6, 0);
    addRoadArrow(53.5, 18, 0);
    addRoadArrow(53.5, 30, Math.PI); // U-Turn loop south

    // ----------------------------------------------------
    // 4. Grand Entrance Gateway (Realistic Luxury Arch)
    // ----------------------------------------------------
    const entranceGroup = new THREE.Group();
    entranceGroup.position.set(-62, 0, -43);

    // Stone Clad Pylons (2 Grand Pillars)
    const pylonGeo = new THREE.BoxGeometry(2.4, 8.5, 2.4);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const pylonGoldMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.8 });

    const pylonL = new THREE.Mesh(pylonGeo, pylonMat);
    pylonL.position.set(-6.5, 4.25, 0);
    pylonL.castShadow = true;
    entranceGroup.add(pylonL);

    const pylonR = new THREE.Mesh(pylonGeo, pylonMat);
    pylonR.position.set(6.5, 4.25, 0);
    pylonR.castShadow = true;
    entranceGroup.add(pylonR);

    // Gold Bands on Pylons
    const goldBandGeo = new THREE.BoxGeometry(2.6, 0.4, 2.6);
    const b1 = new THREE.Mesh(goldBandGeo, pylonGoldMat);
    b1.position.set(-6.5, 7.5, 0);
    const b2 = new THREE.Mesh(goldBandGeo, pylonGoldMat);
    b2.position.set(6.5, 7.5, 0);
    entranceGroup.add(b1);
    entranceGroup.add(b2);

    // Overhead Cantilever Beam with Roof
    const archBeamGeo = new THREE.BoxGeometry(15.5, 1.4, 3.2);
    const archBeamMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.5 });
    const archBeam = new THREE.Mesh(archBeamGeo, archBeamMat);
    archBeam.position.set(0, 8.2, 0);
    archBeam.castShadow = true;
    entranceGroup.add(archBeam);

    // Gold Fascia on Arch Beam
    const fasciaGeo = new THREE.BoxGeometry(15.7, 0.4, 3.3);
    const fascia = new THREE.Mesh(fasciaGeo, pylonGoldMat);
    fascia.position.set(0, 8.8, 0);
    entranceGroup.add(fascia);

    // 3D Canvas Signboard on Arch: "ANURAG ENCLAVE"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 256;
    const sctx = signCanvas.getContext('2d');
    if (sctx) {
      sctx.fillStyle = '#090d16';
      sctx.fillRect(0, 0, 1024, 256);
      sctx.strokeStyle = '#d97706';
      sctx.lineWidth = 8;
      sctx.strokeRect(10, 10, 1004, 236);

      sctx.fillStyle = '#f59e0b';
      sctx.font = 'bold 54px Georgia, serif';
      sctx.textAlign = 'center';
      sctx.letterSpacing = '4px';
      sctx.fillText('ANURAG ENCLAVE', 512, 105);

      sctx.fillStyle = '#ffffff';
      sctx.font = 'bold 30px Arial, sans-serif';
      sctx.fillText('ANURAGH FOUNDATION • SAKRAYAPATNA', 512, 175);
    }
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true });
    const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 2.6), signMat);
    signBoard.position.set(0, 8.2, 1.65);
    entranceGroup.add(signBoard);

    // Security Guardhouse (Modern Glass & Steel Cabin)
    const cabinGeo = new THREE.BoxGeometry(4.5, 3.2, 3.8);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-11.5, 1.6, 0);
    cabin.castShadow = true;
    entranceGroup.add(cabin);

    const cabinGlass = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 1.4, 3.9),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.6 })
    );
    cabinGlass.position.set(-11.5, 1.8, 0);
    entranceGroup.add(cabinGlass);

    // Boom Barriers (Red & White Safety Gates)
    const barrierGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.2, 8);
    barrierGeo.rotateZ(Math.PI / 2);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const barrierEntry = new THREE.Mesh(barrierGeo, barrierMat);
    barrierEntry.position.set(-3.2, 1.1, 1.2);
    const barrierExit = new THREE.Mesh(barrierGeo, barrierMat);
    barrierExit.position.set(3.2, 1.1, 1.2);
    entranceGroup.add(barrierEntry);
    entranceGroup.add(barrierExit);

    // Welcome Monolith Stone
    const monolith = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 2.2, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    monolith.position.set(12, 1.1, 0);
    monolith.castShadow = true;
    entranceGroup.add(monolith);

    scene.add(entranceGroup);

    // ----------------------------------------------------
    // 5. The 48m Botanical Park ("ಉದ್ಯಾನವನ")
    // ----------------------------------------------------
    const parkGroup = new THREE.Group();
    parkGroup.position.set(66, 0, 2);

    // Lush Contoured Park Lawn (48.17m long, width 12m)
    const parkLawnGeo = new THREE.BoxGeometry(13.5, 0.45, 68);
    const parkLawnMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.75,
      metalness: 0.08
    });
    const parkLawn = new THREE.Mesh(parkLawnGeo, parkLawnMat);
    parkLawn.position.y = 0.22;
    parkLawn.receiveShadow = true;
    parkGroup.add(parkLawn);

    // Terracotta Curving Walking & Jogging Track
    const trackMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.85 });
    const trackPoints = [
      new THREE.Vector3(-1, 0.46, -30),
      new THREE.Vector3(2, 0.46, -18),
      new THREE.Vector3(-1.5, 0.46, -5),
      new THREE.Vector3(2.5, 0.46, 8),
      new THREE.Vector3(-1, 0.46, 20),
      new THREE.Vector3(1, 0.46, 30)
    ];
    for (let i = 0; i < trackPoints.length - 1; i++) {
      const pA = trackPoints[i];
      const pB = trackPoints[i + 1];
      const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      const len = pA.distanceTo(pB);
      const ang = Math.atan2(pB.x - pA.x, pB.z - pA.z);
      const seg = new THREE.Mesh(new THREE.PlaneGeometry(2.0, len), trackMat);
      seg.rotation.x = -Math.PI / 2;
      seg.rotation.z = -ang;
      seg.position.set(mid.x, 0.46, mid.z);
      parkGroup.add(seg);
    }

    // Central Classical Gazebo Pavilion
    const gazeboGroup = new THREE.Group();
    gazeboGroup.position.set(0, 0.45, 0);

    const basePlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.5, 0.6, 12),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
    );
    basePlinth.position.y = 0.3;
    gazeboGroup.add(basePlinth);

    // 6 Gazebo Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    for (let i = 0; i < 6; i++) {
      const rad = (i * Math.PI * 2) / 6;
      const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.4, 8), pillarMat);
      pil.position.set(Math.cos(rad) * 3.4, 2.0, Math.sin(rad) * 3.4);
      pil.castShadow = true;
      gazeboGroup.add(pil);
    }

    // Gazebo Conical Terracotta Roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(4.5, 2.2, 12),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 })
    );
    roof.position.y = 4.8;
    roof.castShadow = true;
    gazeboGroup.add(roof);

    parkGroup.add(gazeboGroup);

    // Tiered Water Fountain (South Park)
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(0, 0.45, -18);
    const fBasin = new THREE.Mesh(
      new THREE.CylinderGeometry(3.0, 3.2, 0.7, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 })
    );
    fBasin.position.y = 0.35;
    fBasin.castShadow = true;
    fountainGroup.add(fBasin);

    const fWater = new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 2.8, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.8 })
    );
    fWater.position.y = 0.65;
    fountainGroup.add(fWater);

    const fPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 })
    );
    fPedestal.position.y = 1.2;
    fountainGroup.add(fPedestal);
    parkGroup.add(fountainGroup);

    // Children's Playground Swings & Slide (North Park)
    const playGroup = new THREE.Group();
    playGroup.position.set(0, 0.45, 22);

    // Swing Set A-Frame
    const swingMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const swingBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.5, 8), swingMat);
    swingBeam.rotateZ(Math.PI / 2);
    swingBeam.position.set(0, 3.2, 0);
    playGroup.add(swingBeam);

    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.4, 8), swingMat);
    postL.position.set(-2.2, 1.6, 0);
    postL.rotateZ(0.2);
    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.4, 8), swingMat);
    postR.position.set(2.2, 1.6, 0);
    postR.rotateZ(-0.2);
    playGroup.add(postL);
    playGroup.add(postR);

    parkGroup.add(playGroup);

    // Park Benches
    const benchGeo = new THREE.BoxGeometry(1.6, 0.5, 0.6);
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const benchPositions = [
      [-3.5, -10, 0.3],
      [3.5, 5, -0.3],
      [-3.5, 14, 0.2]
    ];
    benchPositions.forEach(([bx, bz, rot]) => {
      const bench = new THREE.Mesh(benchGeo, benchMat);
      bench.position.set(bx, 0.68, bz);
      bench.rotation.y = rot;
      bench.castShadow = true;
      parkGroup.add(bench);
    });

    scene.add(parkGroup);

    // ----------------------------------------------------
    // 6. Realistic Botanical Flora (Palms, Jacarandas, Gulmohars)
    // ----------------------------------------------------
    const createPalmTree = (x: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.35 * scale, 6.5 * scale, 8), trunkMat);
      trunk.position.y = 3.25 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI * 2) / 8;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.6 * scale, 3.2 * scale, 5), frondMat);
        frond.position.set(Math.cos(ang) * 1.5 * scale, 6.2 * scale, Math.sin(ang) * 1.5 * scale);
        frond.rotation.z = Math.cos(ang) * 0.9;
        frond.rotation.x = -Math.sin(ang) * 0.9;
        frond.castShadow = true;
        tree.add(frond);
      }
      tree.position.set(x, 0, z);
      scene.add(tree);
    };

    const createFloweringTree = (x: number, z: number, flowerColorHex: number, scale = 1) => {
      const tree = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.4 * scale, 4.5 * scale, 8), trunkMat);
      trunk.position.y = 2.25 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      const crownMat = new THREE.MeshStandardMaterial({ color: flowerColorHex, roughness: 0.7 });
      const crown1 = new THREE.Mesh(new THREE.SphereGeometry(2.4 * scale, 8, 8), crownMat);
      crown1.position.y = 4.8 * scale;
      crown1.castShadow = true;
      tree.add(crown1);

      const crown2 = new THREE.Mesh(new THREE.SphereGeometry(1.6 * scale, 6, 6), crownMat);
      crown2.position.set(1.1 * scale, 5.4 * scale, 0.8 * scale);
      tree.add(crown2);

      tree.position.set(x, 0, z);
      scene.add(tree);
    };

    // Plant trees in Park, Entrance, and Avenues:
    // Park trees (East 48m green belt)
    createPalmTree(64, -26, 1.0);
    createPalmTree(64, -12, 1.1);
    createPalmTree(64, 12, 1.1);
    createPalmTree(64, 26, 1.0);
    createFloweringTree(69, -7, 0xa855f7, 1.1); // Jacaranda (Purple)
    createFloweringTree(69, 10, 0xef4444, 1.0); // Gulmohar (Red)
    createFloweringTree(69, 28, 0xf59e0b, 0.9); // Golden Cassia

    // Entrance Avenue Palm Trees (Flanking Entrance)
    createPalmTree(-70, -32, 1.1);
    createPalmTree(-70, -48, 1.1);
    createPalmTree(-54, -48, 1.1);
    createPalmTree(-54, -32, 1.1);

    // Avenue street trees
    createPalmTree(-23.5, 34, 0.9);
    createPalmTree(20, 34, 0.9);
    createPalmTree(53.5, 34, 0.9);

    // ----------------------------------------------------
    // 7. Civic Amenity Site ("ನಾಗರೀಕ ಸೌಲಭ್ಯ" - 27m x 18m)
    // ----------------------------------------------------
    const caGroup = new THREE.Group();
    caGroup.position.set(-6, 0, -12);

    const caLawn = new THREE.Mesh(
      new THREE.BoxGeometry(26, 0.4, 22),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })
    );
    caLawn.position.y = 0.2;
    caLawn.receiveShadow = true;
    caGroup.add(caLawn);

    // Community Center Building Model
    const caBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(16, 4.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    caBuilding.position.set(0, 2.45, 0);
    caBuilding.castShadow = true;
    caGroup.add(caBuilding);

    const caRoof = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.6, 14),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.6 })
    );
    caRoof.position.set(0, 4.95, 0);
    caRoof.castShadow = true;
    caGroup.add(caRoof);

    scene.add(caGroup);

    // ----------------------------------------------------
    // 8. Plot Meshes with Demarcation Corner Boundary Stones
    // ----------------------------------------------------
    plotMeshesRef.current.clear();

    const cornerStoneGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.8, 8);
    const cornerStoneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const cornerCapMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }); // Red survey top cap

    plots.forEach(plot => {
      const [w, h, d] = plot.dim3D;
      const [px, py, pz] = plot.pos3D;

      const geometry = new THREE.BoxGeometry(w, h, d);

      let colorHex = 0x22c55e; // Available (Green)
      if (plot.status === 'reserved') colorHex = 0x3b82f6; // Booked (Blue)
      if (plot.status === 'sold') colorHex = 0xf43f5e; // Sold (Red)

      const material = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity: 0.92
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(px, py, pz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { plotId: plot.id, plotData: plot, originalColor: colorHex };

      // High-precision Edge Outlines
      const edges = new THREE.EdgesGeometry(geometry);
      const edgeColor = plot.isCorner ? 0xfef08a : (plot.isParkFacing ? 0x86efac : 0xffffff);
      const outline = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color: edgeColor,
          linewidth: plot.isCorner ? 2.5 : 1.5,
          transparent: true,
          opacity: 0.9
        })
      );
      outline.position.set(px, py, pz);

      scene.add(mesh);
      scene.add(outline);

      // 4 Demarcation Corner Pegs for each plot (DTCP Survey Pegs)
      const hw = (w - 0.4) / 2;
      const hd = (d - 0.4) / 2;
      const cornerOffsets = [
        [-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]
      ];
      cornerOffsets.forEach(([cx, cz]) => {
        const peg = new THREE.Mesh(cornerStoneGeo, cornerStoneMat);
        peg.position.set(px + cx, py + 0.4, pz + cz);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.2, 8), cornerCapMat);
        cap.position.set(px + cx, py + 0.8, pz + cz);
        scene.add(peg);
        scene.add(cap);
      });

      plotMeshesRef.current.set(plot.id, { mesh, outline, initialY: py });
    });

    // ----------------------------------------------------
    // 9. Modern Solar Streetlight Poles
    // ----------------------------------------------------
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.14, 6.2, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const addStreetlight = (x: number, z: number, rotY = 0) => {
      const poleGroup = new THREE.Group();
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 3.1;
      pole.castShadow = true;
      poleGroup.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.12), poleMat);
      arm.position.set(0.8, 6.0, 0);
      poleGroup.add(arm);

      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.16, 0.35), lampMat);
      lamp.position.set(1.4, 5.9, 0);
      poleGroup.add(lamp);

      poleGroup.rotation.y = rotY;
      poleGroup.position.set(x, 0, z);
      scene.add(poleGroup);
    };

    // Lights along South 9.0m Boulevard
    addStreetlight(-48, -45.2, 0);
    addStreetlight(-18, -45.2, 0);
    addStreetlight(12, -45.2, 0);
    addStreetlight(42, -45.2, 0);

    // Lights along internal avenues
    addStreetlight(-27.8, -10, Math.PI / 2);
    addStreetlight(-27.8, 15, Math.PI / 2);
    addStreetlight(15.8, -10, -Math.PI / 2);
    addStreetlight(15.8, 15, -Math.PI / 2);
    addStreetlight(49.2, -10, Math.PI / 2);
    addStreetlight(49.2, 15, Math.PI / 2);

    // ----------------------------------------------------
    // Animation & Flyover Camera Loop
    // ----------------------------------------------------
    let flyoverStart = performance.now();
    const flyoverDuration = 2000;
    const startCamPos = new THREE.Vector3(0, 130, 140);
    const targetCamPos = new THREE.Vector3(0, 56, 72);

    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const elapsed = performance.now() - flyoverStart;
      if (elapsed < flyoverDuration) {
        const progress = Math.min(1, elapsed / flyoverDuration);
        const ease = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(startCamPos, targetCamPos, ease);
        controls.target.set(0, 0, -10);
      } else if (loading) {
        setLoading(false);
      }

      // Subtle pulse animation on Road Arrows
      if (roadArrowsGroupRef.current) {
        const time = performance.now() * 0.003;
        const pulse = 0.8 + 0.2 * Math.sin(time);
        arrowGlowMat.opacity = pulse;
      }

      controls.update();

      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const angle = Math.atan2(dir.x, dir.z) * (180 / Math.PI);
      setCompassAngle(Math.round(angle));

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [plots]);

  // Update plot appearance based on filter or selection
  useEffect(() => {
    plotMeshesRef.current.forEach(({ mesh, outline }, plotId) => {
      const plot = mesh.userData.plotData as Plot;
      const isMatch = matchesFilter(plot);
      const isSelected = selectedPlot?.id === plotId;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const outMat = outline.material as THREE.LineBasicMaterial;

      if (!isMatch) {
        mat.color.setHex(0x334155);
        mat.opacity = 0.2;
        outMat.opacity = 0.15;
      } else {
        if (isSelected) {
          mat.color.setHex(0x38bdf8);
          mat.opacity = 1.0;
          mat.emissive.setHex(0x0369a1);
          outMat.color.setHex(0xffffff);
          outMat.opacity = 1.0;
        } else {
          mat.color.setHex(mesh.userData.originalColor);
          mat.opacity = 0.92;
          mat.emissive.setHex(0x000000);
          outMat.color.setHex(plot.isCorner ? 0xfef08a : (plot.isParkFacing ? 0x86efac : 0xffffff));
          outMat.opacity = 0.9;
        }
      }
    });
  }, [filters, selectedPlot, matchesFilter]);

  // Toggle Road Flow Arrows Visibility
  useEffect(() => {
    if (roadArrowsGroupRef.current) {
      roadArrowsGroupRef.current.visible = showRoadArrows;
    }
  }, [showRoadArrows]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const meshes: THREE.Mesh[] = [];
    plotMeshesRef.current.forEach(item => meshes.push(item.mesh));

    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const plot = hitMesh.userData.plotData as Plot;

      if (hoveredMeshRef.current !== hitMesh) {
        if (hoveredMeshRef.current) {
          const prevId = hoveredMeshRef.current.userData.plotId;
          const prevItem = plotMeshesRef.current.get(prevId);
          if (prevItem) {
            prevItem.mesh.position.y = prevItem.initialY;
            prevItem.outline.position.y = prevItem.initialY;
          }
        }

        const hitItem = plotMeshesRef.current.get(plot.id);
        if (hitItem) {
          hitItem.mesh.position.y = hitItem.initialY + 0.4;
          hitItem.outline.position.y = hitItem.initialY + 0.4;
        }

        hoveredMeshRef.current = hitMesh;
      }

      setHoveredPlot(plot);
      setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 15 });
    } else {
      if (hoveredMeshRef.current) {
        const prevId = hoveredMeshRef.current.userData.plotId;
        const prevItem = plotMeshesRef.current.get(prevId);
        if (prevItem) {
          prevItem.mesh.position.y = prevItem.initialY;
          prevItem.outline.position.y = prevItem.initialY;
        }
        hoveredMeshRef.current = null;
      }
      setHoveredPlot(null);
    }
  };

  const handlePointerLeave = () => {
    if (hoveredMeshRef.current) {
      const prevId = hoveredMeshRef.current.userData.plotId;
      const prevItem = plotMeshesRef.current.get(prevId);
      if (prevItem) {
        prevItem.mesh.position.y = prevItem.initialY;
        prevItem.outline.position.y = prevItem.initialY;
      }
      hoveredMeshRef.current = null;
    }
    setHoveredPlot(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !cameraRef.current || !controlsRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const meshes: THREE.Mesh[] = [];
    plotMeshesRef.current.forEach(item => meshes.push(item.mesh));

    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const plot = hitMesh.userData.plotData as Plot;
      onSelectPlot(plot);

      const targetPos = new THREE.Vector3(plot.pos3D[0], 0, plot.pos3D[2]);
      const offset = new THREE.Vector3(0, 26, 28);

      let step = 0;
      const startCam = cameraRef.current.position.clone();
      const endCam = targetPos.clone().add(offset);
      const startTarget = controlsRef.current.target.clone();

      const panAnim = () => {
        step += 0.05;
        if (step <= 1 && cameraRef.current && controlsRef.current) {
          cameraRef.current.position.lerpVectors(startCam, endCam, step);
          controlsRef.current.target.lerpVectors(startTarget, targetPos, step);
          controlsRef.current.update();
          requestAnimationFrame(panAnim);
        }
      };
      panAnim();
    }
  };

  const changeSunMode = (mode: SunMode) => {
    setSunMode(mode);
    if (!dirLightRef.current || !hemiLightRef.current || !sceneRef.current) return;

    if (mode === 'morning') {
      dirLightRef.current.position.set(-60, 45, 40);
      dirLightRef.current.color.setHex(0xfde68a);
      dirLightRef.current.intensity = 1.7;
      hemiLightRef.current.color.setHex(0xfef3c7);
      sceneRef.current.background = new THREE.Color(0x0c1e2b);
    } else if (mode === 'noon') {
      dirLightRef.current.position.set(20, 95, 30);
      dirLightRef.current.color.setHex(0xffffff);
      dirLightRef.current.intensity = 2.0;
      hemiLightRef.current.color.setHex(0xe0f2fe);
      sceneRef.current.background = new THREE.Color(0x0a1120);
    } else if (mode === 'sunset') {
      dirLightRef.current.position.set(75, 25, -50);
      dirLightRef.current.color.setHex(0xf97316);
      dirLightRef.current.intensity = 2.2;
      hemiLightRef.current.color.setHex(0x7c2d12);
      sceneRef.current.background = new THREE.Color(0x1a0d18);
    }
  };

  const handleResetView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    setIsTopDown(false);
    cameraRef.current.position.set(0, 56, 72);
    controlsRef.current.target.set(0, 0, -10);
    controlsRef.current.update();
  };

  const handleToggleTopDown = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (!isTopDown) {
      cameraRef.current.position.set(0, 115, 0.1);
      controlsRef.current.target.set(0, 0, -10);
      setIsTopDown(true);
    } else {
      handleResetView();
    }
    controlsRef.current.update();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] md:h-[720px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {loading && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30 pointer-events-none transition-opacity duration-700">
          <TruckLoader
            message="Constructing 3D Anurag Enclave Layout..."
            subMessage="39 Plots • 9.0m Asphalt Avenues • Grand Entrance Arch • 48m Botanical Park"
          />
        </div>
      )}

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
        {/* Real Status Counters */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-sm shadow-emerald-500/50" />
            <span>Available (22)</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-sm shadow-blue-500/50" />
            <span>Booked (7)</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shadow-sm shadow-rose-500/50" />
            <span>Sold (10)</span>
          </div>
        </div>

        {/* View Mode & CAD Blueprint Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Road Flow Direction Arrows Toggle */}
          <button
            onClick={() => setShowRoadArrows(!showRoadArrows)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-lg transition-colors ${
              showRoadArrows
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
            }`}
            title="Toggle Road Direction Flow Arrows"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Road Flow</span>
          </button>

          {/* View Official Blueprint CAD Button */}
          <button
            onClick={() => setShowCadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-lg transition-colors"
            title="View Original Sanctioned CAD Layout Map"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CAD Blueprint</span>
          </button>

          {/* Sun Lighting Toggle */}
          <div className="flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg">
            <button
              onClick={() => changeSunMode('morning')}
              title="Morning Dawn"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                sunMode === 'morning' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => changeSunMode('noon')}
              title="Bright Noon"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                sunMode === 'noon' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-sky-400" />
            </button>
            <button
              onClick={() => changeSunMode('sunset')}
              title="Golden Hour Sunset"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                sunMode === 'sunset' ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-orange-400" />
            </button>
          </div>

          <button
            onClick={handleToggleTopDown}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md border shadow-lg transition-colors ${
              isTopDown
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isTopDown ? '3D View' : '2D Map'}</span>
          </button>

          <button
            onClick={handleResetView}
            title="Reset Camera Angle"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-slate-800 shadow-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Zoom Controls & Vastu Compass (Taste & Emil Kowalski refinement) */}
      <div className="absolute bottom-5 right-5 flex flex-col items-center gap-2 pointer-events-auto z-20">
        <div
          className="relative w-14 h-14 bg-slate-950/90 backdrop-blur-md rounded-full border border-amber-500/30 shadow-2xl flex items-center justify-center transition-transform"
          title="Vastu Compass (Rotates dynamically with 3D camera)"
        >
          {/* Outer ring cardinal ticks */}
          <span className="absolute top-1 text-[8px] font-black text-rose-400">N</span>
          <span className="absolute right-1 text-[8px] font-bold text-amber-300">E</span>
          <span className="absolute bottom-1 text-[8px] font-medium text-slate-400">S</span>
          <span className="absolute left-1 text-[8px] font-medium text-slate-400">W</span>

          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
            style={{ transform: `rotate(${-compassAngle}deg)` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[12px] border-b-rose-500 shadow-sm" />
              <div className="w-0.5 h-3 bg-amber-400/80 my-0.5" />
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[8px] border-t-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Touch Navigation Hint */}
      <div className="sm:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[10px] text-slate-200 px-3.5 py-1 rounded-full pointer-events-none z-20 shadow-xl flex items-center gap-1.5 whitespace-nowrap">
        <Compass className="w-3 h-3 text-amber-400" />
        <span>Drag to rotate 3D • Tap plot to view details</span>
      </div>

      {/* Hovered Plot Quick Tooltip */}
      {hoveredPlot && (
        <div
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          className="absolute pointer-events-none z-40 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-xl p-3 shadow-2xl min-w-[190px] transition-all duration-75"
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-extrabold text-sm text-white">{hoveredPlot.number}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getStatusColor(hoveredPlot.status)}`}>
              {hoveredPlot.status}
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between text-slate-400">
              <span>Dimension:</span>
              <strong className="text-white">30 × 40 ft (1,200 sq.ft)</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>CAD Size:</span>
              <strong className="text-white">9.14m × 12.19m</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Facing:</span>
              <strong className="text-white">{hoveredPlot.facing}</strong>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800 mt-1">
              <span>Price:</span>
              <span>{formatINR(hoveredPlot.price)}</span>
            </div>
          </div>
          <div className="text-[10px] text-amber-400/90 text-center font-medium mt-2">
            ✦ Click plot to view complete blueprint ✦
          </div>
        </div>
      )}

      {/* CAD Blueprint & Survey Sketch Modal */}
      {showCadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <span className="font-black text-white text-base">
                  Sanctioned Masterplan • Sakrayapatna
                </span>
                <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                  <button
                    onClick={() => setCadModalTab('cad')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      cadModalTab === 'cad' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
                    }`}
                  >
                    CAD Layout
                  </button>
                  <button
                    onClick={() => setCadModalTab('survey')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      cadModalTab === 'survey' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'
                    }`}
                  >
                    Survey Map
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowCadModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950/30">
              <img
                src={cadModalTab === 'cad' ? '/images/layout-plan.png' : '/images/survey-sketch.jpg'}
                alt="Sanctioned Layout Map"
                className="max-w-full max-h-[72vh] object-contain rounded-xl border border-slate-800 shadow-lg"
              />
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
              Approved 39 residential villa plots (30×40 ft / 9.14m × 12.19m) across 2 Acres at Sakrayapatna, Kadur Taluk.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
