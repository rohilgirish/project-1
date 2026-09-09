export type PlotStatus = 'available' | 'reserved' | 'sold';
export type FacingDirection = 'North' | 'East' | 'South' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
export type PlotSize = '30x40' | '40x60' | '50x80';

export type AmenityCategory = 'Infrastructure' | 'Lifestyle' | 'Nature' | 'Eco-Friendly' | 'Community' | 'Transit';

export interface Plot {
  id: number;
  number: string;
  size: PlotSize;
  width: number;
  depth: number;
  area: number;
  facing: FacingDirection;
  status: PlotStatus;
  price: number;
  pricePerSqft: number;
  isCorner: boolean;
  isParkFacing: boolean;
  isMainBoulevard: boolean;
  row: number;
  col: number;
  pos3D: [number, number, number];
  dim3D: [number, number, number];
  badges: string[];
  images: string[];
  pdfUrl?: string;
  description?: string;
}

export interface Amenity {
  id: string;
  title: string;
  category: AmenityCategory;
  description: string;
  iconName: string;
  highlight: string;
}

export interface Landmark {
  id: string;
  name: string;
  category: 'Transit' | 'Education' | 'Healthcare' | 'Tech Parks' | 'Shopping';
  distance: string;
  driveTime: string;
  icon: string;
  lat?: number;
  lng?: number;
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDate?: string;
  plotNumber?: string;
  budget?: string;
  type: 'site_visit' | 'brochure' | 'enquiry' | 'exit_intent';
  createdAt: string;
}

export interface FilterState {
  search: string;
  size: string;
  facing: string;
  status: string;
  minPrice: number;
  maxPrice: number;
  cornerOnly: boolean;
  parkFacingOnly: boolean;
  mainBoulevardOnly: boolean;
}
