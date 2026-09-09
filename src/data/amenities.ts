import { Amenity } from '@/types';

export const AMENITIES_DATA: Amenity[] = [
  {
    id: 'roads',
    title: '9.0-Meter Wide Asphalt Avenues',
    category: 'Infrastructure',
    description: 'Heavy-duty bituminous asphalt 9.0-meter (approx 30 ft) internal layout roads with concrete curbs, paver pedestrian walkways, and tree-lined avenues designed for smooth two-way vehicular movement.',
    iconName: 'Road',
    highlight: '9.0m Blacktop Roads'
  },
  {
    id: 'ca-site',
    title: 'Dedicated Civic Amenity (CA) Site',
    category: 'Community',
    description: 'Sanctioned 27.0m × 18.17m (approx 5,280 sq.ft) central Civic Amenity zone designated for community infrastructure, association hall, and resident facilities.',
    iconName: 'Building2',
    highlight: '27.0m × 18.17m CA Site'
  },
  {
    id: 'park',
    title: '48.17-Meter Botanical Park Zone',
    category: 'Nature',
    description: '48.17-meter long landscaped green buffer situated on the eastern side with shade plantations, jogging pathway, flowering shrubs, and children relaxation benches.',
    iconName: 'Trees',
    highlight: '48.17m Green Buffer'
  },
  {
    id: 'underground',
    title: 'Concealed Electricity & Drainage',
    category: 'Infrastructure',
    description: 'Modern underground conduit networks for electricity, street lighting, high-speed telecom cabling, and RCC storm water drains to eliminate messy overhead wires.',
    iconName: 'Zap',
    highlight: 'Concealed Conduits'
  },
  {
    id: 'water',
    title: 'Overhead Tank & Individual Water Lines',
    category: 'Eco-Friendly',
    description: 'Dedicated high-capacity water reservoir with pressurized underground supply pipes connected directly to every single plot boundary.',
    iconName: 'Droplets',
    highlight: 'Pressurized Water Grid'
  },
  {
    id: 'security',
    title: '24/7 Gated Security & Entry Arch',
    category: 'Infrastructure',
    description: 'Architectural grand entrance arch with security guard post, solar-backed boundary wall, and 24-hour round-the-clock CCTV surveillance.',
    iconName: 'ShieldCheck',
    highlight: 'Gated & Monitored'
  },
  {
    id: 'highway',
    title: 'Immediate SH-57 Highway Access',
    category: 'Transit',
    description: 'Conveniently situated just 500 meters off the Chikkamagaluru - Kadur State Highway (SH-57) connecting to Sakrayapatna town, Kadur Junction, and Chikkamagaluru city.',
    iconName: 'Compass',
    highlight: 'Close to SH-57'
  },
  {
    id: 'eco',
    title: 'Rainwater Harvesting Recharge Pits',
    category: 'Eco-Friendly',
    description: 'Scientific rainwater harvesting pits installed at engineered intervals across avenues to replenish the local water table sustainably.',
    iconName: 'Leaf',
    highlight: 'Groundwater Recharge'
  }
];
