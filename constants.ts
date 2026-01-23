// constants.ts
import { EquipmentItem, SparePart, ProfessionalProfile, ServiceDetail, MarketItem, SellerProfile } from './types';
import { SearchCheck, Truck, Wrench, Flame } from 'lucide-react';

// constants.ts

export const CATEGORY_STRUCTURE = {
  "Heavy Plant and Equipment": {
    equipment: [
      // Excavation & Earthmoving
      "Excavators - Crawler (Track)",
      "Excavators - Wheeled",
      "Excavators - Long Reach",
      "Excavators - Ultra Long Reach",
      "Excavators - Mini (< 6 Ton)",
      "Excavators - Midi (6–10 Ton)",
      "Excavators - High Reach Demolition",
      "Excavators - Amphibious",
      "Backhoe Loaders",
      "Backhoe Loaders - 2WD",
      "Backhoe Loaders - 4WD",

      // Dozing & Grading
      "Bulldozers - Crawler",
      "Bulldozers - Swamp / Low Ground Pressure",
      "Motor Graders",
      "Scrapers - Open Bowl",
      "Scrapers - Elevating",
      "Scrapers - Pull Type",

      // Loading
      "Wheel Loaders",
      "Wheel Loaders - Compact",
      "Track Loaders",
      "Skid Steer Loaders",
      "Multi-Terrain Loaders",

      // Hauling
      "Dump Trucks - Articulated (ADT)",
      "Dump Trucks - Rigid",
      "Off-Highway Mining Trucks",

      // Compaction
      "Compactors - Single Drum",
      "Compactors - Double Drum / Tandem",
      "Compactors - Padfoot / Sheepfoot",
      "Compactors - Pneumatic Tyre",

      // Trenching & Pipelaying
      "Trenchers - Chain",
      "Trenchers - Wheel",
      "Pipe Layers",

      // Specialized
      "Soil Stabilizers",
      "Landfill Compactors",
      "Wheel Tractors - Industrial",
      "Snow Ploughs / Spreaders (Heavy Duty)"
    ],

    parts: [
      // Undercarriage
      "Track Chains & Links",
      "Track Rollers (Bottom & Carrier)",
      "Idlers & Recoil Assemblies",
      "Sprockets & Segments",
      "Track Pads (Single / Double / Triple Grouser)",

      // Ground Engaging Tools
      "Bucket Teeth & Adapters",
      "Cutting Edges & End Bits",
      "Ripper Shanks & Tips",
      "Side Cutters",

      // Powertrain
      "Engines - Complete",
      "Engine Short Blocks",
      "Cylinder Heads",
      "Crankshafts & Camshafts",
      "Pistons, Liners & Rings",
      "Turbochargers",

      // Transmission & Final Drive
      "Gearboxes",
      "Torque Converters",
      "Final Drives / Travel Motors",
      "Differentials",
      "Axles & Planetary Assemblies",

      // Hydraulics
      "Hydraulic Pumps (Main / Pilot / Gear)",
      "Hydraulic Motors",
      "Control Valve Blocks",
      "Hydraulic Cylinders",
      "Seal Kits & O-Rings",
      "Hydraulic Hoses & Fittings",

      // Electrical & Controls
      "ECUs & Controllers",
      "Sensors & Switches",
      "Wiring Harnesses",
      "Starters & Alternators",
      "Batteries",

      // Cab & Structure
      "Cab Shells",
      "Cab Glass (Front / Side / Rear)",
      "Seats & Seat Belts",
      "Joysticks & Control Levers",
      "Mirrors & Cameras",

      // Consumables
      "Filters - Air",
      "Filters - Oil",
      "Filters - Fuel",
      "Filters - Hydraulic",
      "Belts",
      "Bearings"
    ]
  },

  "Heavy Construction Plant Machinery": {
    equipment: [
      // Cranes
      "Cranes - Mobile / Truck Mounted",
      "Cranes - Rough Terrain",
      "Cranes - All Terrain",
      "Cranes - Crawler",
      "Cranes - Tower (Top Slewing)",
      "Cranes - Tower (Self Erecting)",

      // Concrete
      "Concrete Batching Plants - Stationary",
      "Concrete Batching Plants - Mobile",
      "Concrete Pumps - Truck Mounted",
      "Concrete Pumps - Trailer Mounted",
      "Concrete Pumps - Stationary / Line",
      "Self-Loading Concrete Mixers",
      "Transit Concrete Mixers",

      // Asphalt & Roads
      "Asphalt Pavers - Tracked",
      "Asphalt Pavers - Wheeled",
      "Road Milling Machines (Cold Planers)",
      "Chip Spreaders",
      "Bitumen Sprayers",

      // Crushing & Screening
      "Jaw Crushers",
      "Cone Crushers",
      "Impact Crushers",
      "Mobile Crushing Plants",
      "Screening Plants",
      "Sand Washing Plants",

      // Foundations & Drilling
      "Piling Rigs - CFA",
      "Piling Rigs - Rotary",
      "Piling Rigs - Impact Hammer",
      "Drilling Rigs - DTH",
      "Drilling Rigs - Rotary",
      "Anchor Drilling Rigs",

      // Specialized
      "Slipform Pavers",
      "Concrete Block Making Machines",
      "Soil Recyclers"
    ],

    parts: [
      // Crane Parts
      "Wire Ropes & Hoist Ropes",
      "Boom Sections",
      "Jib Sections",
      "Sheaves & Pulleys",
      "Load Moment Indicators (LMI)",

      // Concrete Plant Parts
      "Mixer Shafts",
      "Mixing Blades & Liners",
      "Weighing Sensors & Load Cells",
      "Silos & Screw Conveyors",

      // Concrete Pump Parts
      "Pump Pistons & Cups",
      "Wear Plates & Cutting Rings",
      "Delivery Pipes",
      "Clamps & Elbows",

      // Asphalt & Road
      "Paver Screed Plates",
      "Augers",
      "Conveyor Chains",

      // Crushers & Screens
      "Crusher Jaws",
      "Crusher Mantles & Concaves",
      "Blow Bars",
      "Screen Meshes",
      "Vibrating Motors",

      // Drilling
      "Kelly Bars",
      "Augers",
      "Drill Rods",
      "Drill Bits & Teeth"
    ]
  },

  "Light Plant and Equipment": {
    equipment: [
      // Power
      "Generators - Diesel (<500 kVA)",
      "Generators - Petrol",
      "Generators - Silent / Canopy",
      "Inverter Generators",

      // Air
      "Air Compressors - Portable",
      "Air Compressors - Towable",

      // Compaction
      "Plate Compactors - Forward",
      "Plate Compactors - Reversible",
      "Walk-Behind Rollers",
      "Tamping Rammers",

      // Concrete & Masonry
      "Concrete Mixers (Portable)",
      "Concrete Vibrators (Poker / Needle)",
      "Power Trowels - Single",
      "Power Trowels - Ride-On",

      // Cutting & Drilling
      "Floor Saws",
      "Asphalt Cutters",
      "Core Drilling Machines",
      "Jack Hammers / Breakers",

      // Utilities
      "Lighting Towers",
      "Water Pumps - Trash",
      "Water Pumps - Centrifugal",
      "Welding Machines - Diesel",
      "Welding Machines - Electric",

      // Steel & Fabrication
      "Bar Bending Machines",
      "Bar Cutting Machines"
    ],

    parts: [
      "AVRs & Control Panels",
      "Fuel Injectors (Small Engines)",
      "Carburetors & Repair Kits",
      "Pull Starters / Recoil Assemblies",
      "Spark Plugs & Ignition Coils",
      "Vibrator Shafts & Hoses",
      "Cutting Discs & Diamond Blades",
      "Compressor Separator Filters",
      "Electrical Sockets & Breakers",
      "Rubber Mounts & Anti-Vibration Pads"
    ]
  },

  "Automotive": {
    equipment: [
      "Prime Movers - 6x4",
      "Prime Movers - 4x2",
      "Tipper Trucks",
      "Flatbed Trucks",
      "Drop Side Trucks",
      "Fuel Tankers",
      "Water Bowsers",
      "Low Bed / Low Loader Trailers",
      "Heavy Haulage Trailers",
      "Skeletal Trailers",
      "Service Trucks / Mobile Workshops",
      "Pickup Trucks - Double Cab",
      "Pickup Trucks - Single Cab",
      "Panel Vans"
    ],

    parts: [
      "Brake Pads, Discs & Drums",
      "Clutch Kits & Pressure Plates",
      "Gearboxes & Transmissions",
      "Prop Shafts",
      "Differentials",
      "Axles",
      "Leaf Springs & Shock Absorbers",
      "Fuel Injectors & Pumps",
      "Radiators & Cooling Fans",
      "Body Panels & Lighting",
      "Tyres & Rims"
    ]
  }
};


// --- MOCK SELLERS ---
const SELLERS: Record<string, SellerProfile> = {
  's1': { id: 's1', name: 'Mombasa Cement Fleet', type: 'Company', verified: true, rating: 4.8, joinedDate: '2021', location: 'Mombasa', badges: ['Premium', 'High Volume'] },
  's2': { id: 's2', name: 'John Doe Equipments', type: 'Individual', verified: false, rating: 4.2, joinedDate: '2023', location: 'Nakuru', badges: [] },
  's3': { id: 's3', name: 'DAGIV Certified Store', type: 'Dealer', verified: true, rating: 5.0, joinedDate: '2020', location: 'Nairobi', badges: ['Official Store', 'Warranty'] },
  's4': { id: 's4', name: 'China Road & Bridge Corp', type: 'Company', verified: true, rating: 4.7, joinedDate: '2019', location: 'Nairobi HQ', badges: ['Verified Fleet'] },
  's5': { id: 's5', name: 'Rift Valley Machineries', type: 'Dealer', verified: true, rating: 4.5, joinedDate: '2022', location: 'Eldoret', badges: [] },
};

// --- EXHAUSTIVE MARKETPLACE DATA ---
export const MARKETPLACE_ITEMS: MarketItem[] = [
  // --- 1. HEAVY PLANT AND EQUIPMENT ---
  {
    id: 'm1', title: 'Komatsu PC200-8 Excavator', category: 'Heavy Plant and Equipment', subCategory: 'Excavators',
    type: 'Equipment', listingType: 'Sale', price: 8500000, currency: 'KES', negotiable: true,
    brand: 'Komatsu', model: 'PC200-8', yom: 2018, hours: 6500, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1582035293672-025406d2d537?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's1', seller: SELLERS['s1'], location: 'Mombasa Yard', promoted: true, verifiedByDagiv: true
  },
  {
    id: 'm2', title: 'CAT D8R Bulldozer', category: 'Heavy Plant and Equipment', subCategory: 'Bulldozers',
    type: 'Equipment', listingType: 'Sale', price: 14200000, currency: 'KES', negotiable: false,
    brand: 'Caterpillar', model: 'D8R', yom: 2015, hours: 12000, condition: 'Refurbished',
    images: ['https://images.unsplash.com/photo-1519003300449-424ad0405076?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's3', seller: SELLERS['s3'], location: 'Nairobi HQ', promoted: true, verifiedByDagiv: true
  },
  {
    id: 'm3', title: 'Caterpillar 140K Motor Grader', category: 'Heavy Plant and Equipment', subCategory: 'Motor graders',
    type: 'Equipment', listingType: 'Rent', price: 45000, currency: 'KES', priceUnit: 'per day', negotiable: true,
    brand: 'Caterpillar', model: '140K', yom: 2019, hours: 8000, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's4', seller: SELLERS['s4'], location: 'Kisumu', promoted: false, verifiedByDagiv: true
  },
  {
    id: 'm4', title: 'JCB 3CX Backhoe Loader', category: 'Heavy Plant and Equipment', subCategory: 'Backhoe loaders',
    type: 'Equipment', listingType: 'Sale', price: 7200000, currency: 'KES', negotiable: true,
    brand: 'JCB', model: '3CX', yom: 2021, hours: 1500, condition: 'Used - Like New',
    images: ['https://images.unsplash.com/photo-1533501705609-b6cb8d579601?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's5', seller: SELLERS['s5'], location: 'Eldoret', promoted: false, verifiedByDagiv: false
  },
  {
    id: 'm5', title: 'Hamm 3411 Vibratory Roller', category: 'Heavy Plant and Equipment', subCategory: 'Compactors / Rollers',
    type: 'Equipment', listingType: 'Rent', price: 22000, currency: 'KES', priceUnit: 'per day', negotiable: false,
    brand: 'Hamm', model: '3411', yom: 2017, hours: 5000, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1590240226309-8736025340e5?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's2', seller: SELLERS['s2'], location: 'Nakuru', promoted: false, verifiedByDagiv: false
  },
  {
    id: 'p1', title: 'Hydraulic Main Pump K3V112', category: 'Heavy Plant and Equipment', subCategory: 'Hydraulic pumps',
    type: 'Part', listingType: 'Sale', price: 250000, currency: 'KES', negotiable: false,
    brand: 'Kawasaki', model: 'K3V112DT', condition: 'New',
    images: ['https://images.unsplash.com/photo-1518306065525-451631745428?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's3', seller: SELLERS['s3'], location: 'Industrial Area', promoted: false, verifiedByDagiv: true
  },

  // --- 2. HEAVY CONSTRUCTION PLANT MACHINERY ---
  {
    id: 'm6', title: 'SANY Mobile Crane 50T', category: 'Heavy Construction Plant Machinery', subCategory: 'Mobile cranes',
    type: 'Equipment', listingType: 'Rent', price: 55000, currency: 'KES', priceUnit: 'per day', negotiable: true,
    brand: 'SANY', model: 'STC500', yom: 2021, hours: 2000, condition: 'Used - Like New',
    images: ['https://images.unsplash.com/photo-1588301728227-2c96c4df122d?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's1', seller: SELLERS['s1'], location: 'Nairobi Westlands', promoted: true, verifiedByDagiv: true
  },
  {
    id: 'm7', title: 'Liebherr Concrete Batching Plant', category: 'Heavy Construction Plant Machinery', subCategory: 'Concrete batching plants',
    type: 'Equipment', listingType: 'Sale', price: 12500000, currency: 'KES', negotiable: true,
    brand: 'Liebherr', model: 'Mobilmix 2.5', yom: 2016, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1584467362398-3306b3a04294?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's4', seller: SELLERS['s4'], location: 'Athi River', promoted: false, verifiedByDagiv: true
  },
  {
    id: 'm8', title: 'Putzmeister Concrete Pump', category: 'Heavy Construction Plant Machinery', subCategory: 'Concrete pumps',
    type: 'Equipment', listingType: 'Rent', price: 35000, currency: 'KES', priceUnit: 'per day', negotiable: false,
    brand: 'Putzmeister', model: 'BSA 14000', yom: 2018, hours: 4000, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1535154668108-f404d55b34ce?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's1', seller: SELLERS['s1'], location: 'Thika', promoted: false, verifiedByDagiv: true
  },
  {
    id: 'm9', title: 'Wirtgen Cold Milling Machine', category: 'Heavy Construction Plant Machinery', subCategory: 'Road milling machines',
    type: 'Equipment', listingType: 'Sale', price: 18000000, currency: 'KES', negotiable: true,
    brand: 'Wirtgen', model: 'W 200', yom: 2019, hours: 3200, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1628109968779-7a0e24b423f4?auto=format&fit=crop&w=800&q=80'], // Reused bitumen image for roadwork context
    sellerId: 's4', seller: SELLERS['s4'], location: 'Nairobi', promoted: true, verifiedByDagiv: true
  },

  // --- 3. LIGHT PLANT AND EQUIPMENT ---
  {
    id: 'm10', title: 'Perkins 100kVA Generator', category: 'Light Plant and Equipment', subCategory: 'Generators',
    type: 'Equipment', listingType: 'Sale', price: 1800000, currency: 'KES', negotiable: true,
    brand: 'Perkins', model: '1104C-44TAG2', yom: 2022, hours: 100, condition: 'New',
    images: ['https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's3', seller: SELLERS['s3'], location: 'Industrial Area', promoted: true, verifiedByDagiv: true
  },
  {
    id: 'm11', title: 'Wacker Neuson Plate Compactor', category: 'Light Plant and Equipment', subCategory: 'Plate compactors',
    type: 'Equipment', listingType: 'Sale', price: 150000, currency: 'KES', negotiable: false,
    brand: 'Wacker Neuson', model: 'DPU 6555', yom: 2023, condition: 'New',
    images: ['https://images.unsplash.com/photo-1628109968832-7206d2df2370?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's3', seller: SELLERS['s3'], location: 'Westlands', promoted: false, verifiedByDagiv: true
  },
  {
    id: 'm12', title: 'Atlas Copco Air Compressor', category: 'Light Plant and Equipment', subCategory: 'Air compressors',
    type: 'Equipment', listingType: 'Rent', price: 8000, currency: 'KES', priceUnit: 'per day', negotiable: true,
    brand: 'Atlas Copco', model: 'XAS 186', yom: 2017, hours: 4500, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1579261272765-4b07fb582300?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's2', seller: SELLERS['s2'], location: 'Nakuru', promoted: false, verifiedByDagiv: false
  },
  {
    id: 'm13', title: 'Honda Water Pump', category: 'Light Plant and Equipment', subCategory: 'Water pumps',
    type: 'Equipment', listingType: 'Sale', price: 45000, currency: 'KES', negotiable: false,
    brand: 'Honda', model: 'WB30XT', yom: 2023, condition: 'New',
    images: ['https://images.unsplash.com/photo-1594926976920-43642345e821?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's5', seller: SELLERS['s5'], location: 'Eldoret', promoted: false, verifiedByDagiv: true
  },

  // --- 4. AUTOMOTIVE ---
  {
    id: 'a1', title: 'Sinotruk HOWO 6x4 Tipper', category: 'Automotive', subCategory: 'Tippers',
    type: 'Equipment', listingType: 'Sale', price: 6800000, currency: 'KES', negotiable: true,
    brand: 'Sinotruk', model: '371HP', yom: 2020, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1605218427306-635ba243971c?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's2', seller: SELLERS['s2'], location: 'Eldoret', promoted: false, verifiedByDagiv: false
  },
  {
    id: 'a2', title: 'Mercedes Actros Prime Mover', category: 'Automotive', subCategory: 'Prime movers',
    type: 'Equipment', listingType: 'Sale', price: 7500000, currency: 'KES', negotiable: true,
    brand: 'Mercedes-Benz', model: '3340', yom: 2016, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1632598836423-f38392cb9117?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's1', seller: SELLERS['s1'], location: 'Mombasa', promoted: true, verifiedByDagiv: true
  },
  {
    id: 'a3', title: 'Toyota Hilux Double Cab', category: 'Automotive', subCategory: 'Pickups',
    type: 'Equipment', listingType: 'Rent', price: 10000, currency: 'KES', priceUnit: 'per day', negotiable: false,
    brand: 'Toyota', model: 'Hilux GD6', yom: 2022, condition: 'Used - Like New',
    images: ['https://images.unsplash.com/photo-1594917088927-4a00486c9d06?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's3', seller: SELLERS['s3'], location: 'Nairobi', promoted: false, verifiedByDagiv: true
  },
  {
    id: 'a4', title: 'Fuel Tanker Trailer 40,000L', category: 'Automotive', subCategory: 'Tankers',
    type: 'Equipment', listingType: 'Sale', price: 3500000, currency: 'KES', negotiable: true,
    brand: 'CIMC', model: 'Tri-Axle', yom: 2018, condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1594953935272-a169052b0f44?auto=format&fit=crop&w=800&q=80'], // Placeholder
    sellerId: 's4', seller: SELLERS['s4'], location: 'Mombasa', promoted: false, verifiedByDagiv: true
  },
  {
    id: 'ap1', title: 'Isuzu NQR Brake Pads', category: 'Automotive', subCategory: 'Brake systems',
    type: 'Part', listingType: 'Sale', price: 4500, currency: 'KES', negotiable: false,
    brand: 'Isuzu', model: 'NQR 75', condition: 'New',
    images: ['https://images.unsplash.com/photo-1486262715619-01b8c2297615?auto=format&fit=crop&w=800&q=80'],
    sellerId: 's3', seller: SELLERS['s3'], location: 'Nairobi', promoted: false, verifiedByDagiv: true
  }
];

// --- LEGACY DATA (Retained for App compatibility) ---
// Note: These will be phased out once the UI fully transitions to MARKETPLACE_ITEMS

export const EQUIPMENT_DATA: EquipmentItem[] = [
  // --- A. HEAVY PLANT EQUIPMENT ---
  {
    id: 'h1', name: 'Perkins 500kVA Diesel Generator', category: 'Heavy Plant Equipment', subCategory: 'Generators',
    brand: 'Perkins', model: '2506A-E15TAG2', year: 2021, condition: 'New', listingType: 'Sale',
    priceSale: 4500000, location: 'Nairobi Industrial Area',
    image: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&w=800&q=80',
    specs: { 'Prime Power': '500 kVA', 'Engine': 'Perkins 6 Cylinder', 'Alternator': 'Stamford', 'Control': 'Deep Sea' },
    description: 'Heavy duty industrial diesel engine generator (D.E.G). Soundproof canopy included. Ideal for factories.'
  },
  {
    id: 'h3', name: 'JS 500 Concrete Mixer', category: 'Heavy Plant Equipment', subCategory: 'Concrete Systems',
    brand: 'SANY', model: 'JS 500', year: 2022, condition: 'New', listingType: 'Sale',
    priceSale: 1800000, location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1590059390239-4449830c2794?auto=format&fit=crop&w=800&q=80',
    specs: { 'Capacity': '0.5 m3', 'Productivity': '25 m3/h', 'Power': '18.5 kW', 'Type': 'Twin Shaft' },
    description: 'High efficiency twin-shaft compulsory mixer. Specifically designed for precast factories.'
  },
  {
    id: 'h4', name: 'Elba Concrete Batching Plant', category: 'Heavy Plant Equipment', subCategory: 'Concrete Systems',
    brand: 'Ammann Elba', model: 'CBS 60', year: 2019, condition: 'Used', listingType: 'Sale',
    priceSale: 8500000, hoursUsed: 4000, location: 'Athi River',
    image: 'https://images.unsplash.com/photo-1584467362398-3306b3a04294?auto=format&fit=crop&w=800&q=80',
    specs: { 'Output': '60 m3/h', 'Mixer': 'Single Shaft', 'Bins': '4 Inline', 'Control': 'Fully Auto' },
    description: 'Stationary concrete batching plant. Fully dismantled and ready for transport and installation.'
  },
  {
    id: 'cs1', name: 'Carmix 3.5 TT Self-Loading Mixer', category: 'Heavy Plant Equipment', subCategory: 'Concrete Systems',
    brand: 'Carmix', model: '3.5 TT', year: 2020, condition: 'Used', listingType: 'Sale',
    priceSale: 6800000, hoursUsed: 2100, location: 'Mombasa',
    image: 'https://plus.unsplash.com/premium_photo-1661964087664-998e16d00df7?auto=format&fit=crop&w=800&q=80',
    specs: { 'Drum Capacity': '4850 L', 'Output': '3.5 m3', 'Engine': 'Perkins Turbo', 'Drive': '4x4x4' },
    description: 'The ultimate off-road mobile batching plant. Mix, transport, and pour concrete anywhere on site.'
  },
  {
    id: 'cs2', name: 'Putzmeister BSA 1407 D Pump', category: 'Heavy Plant Equipment', subCategory: 'Concrete Systems',
    brand: 'Putzmeister', model: 'BSA 1407 D', year: 2019, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 25,000 / day', location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1535154668108-f404d55b34ce?auto=format&fit=crop&w=800&q=80',
    specs: { 'Output': '71 m3/h', 'Pressure': '106 bar', 'Engine': 'Deutz Diesel', 'Weight': '4.5 Ton' },
    description: 'Reliable stationary trailer-mounted concrete pump. Perfect for high-rise construction projects.'
  },
  {
    id: 'cs3', name: 'Qunfeng Block Making Machine', category: 'Heavy Plant Equipment', subCategory: 'Concrete Systems',
    brand: 'Qunfeng', model: 'QS1300', year: 2023, condition: 'New', listingType: 'Sale',
    priceSale: 4200000, location: 'Industrial Area',
    image: 'https://images.unsplash.com/photo-1626123018251-5407089c17df?auto=format&fit=crop&w=800&q=80',
    specs: { 'Cycle Time': '15-20s', 'Pallet Size': '1100x870mm', 'Power': '35kW', 'Vibration': 'Servo' },
    description: 'Fully automatic concrete block and paver making machine. High capacity production line.'
  },
  {
    id: 'cs4', name: 'Mercedes Actros Truck Mixer', category: 'Heavy Plant Equipment', subCategory: 'Concrete Systems',
    brand: 'Mercedes-Benz', model: 'Actros 3340', year: 2018, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 35,000 / day', location: 'Westlands Site',
    image: 'https://images.unsplash.com/photo-1632598836423-f38392cb9117?auto=format&fit=crop&w=800&q=80',
    specs: { 'Drum': 'Liebherr 9m3', 'Chassis': '6x4', 'Engine': 'V6 Turbo', 'Water Tank': '500L' },
    description: 'Heavy duty transit mixer truck. Excellent condition, ready for ready-mix delivery.'
  },
  {
    id: 'h2', name: 'Atlas Copco XAS 186 Compressor', category: 'Heavy Plant Equipment', subCategory: 'Pneumatic Systems',
    brand: 'Atlas Copco', model: 'XAS 186', year: 2018, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 12,000 / day', hoursUsed: 3500, location: 'Mombasa',
    image: 'https://images.unsplash.com/photo-1579261272765-4b07fb582300?auto=format&fit=crop&w=800&q=80',
    specs: { 'Pressure': '7 Bar', 'Flow': '392 CFM', 'Engine': 'Deutz Diesel', 'Type': 'Rotary Screw' },
    description: 'Portable rotary screw compressor. Reliable pneumatic power for construction and mining.'
  },
  {
    id: 'h2b', name: 'Ingersoll Rand Piston Compressor', category: 'Heavy Plant Equipment', subCategory: 'Pneumatic Systems',
    brand: 'Ingersoll Rand', model: 'Type 30', year: 2022, condition: 'New', listingType: 'Sale',
    priceSale: 450000, location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1622329868779-f53702131972?auto=format&fit=crop&w=800&q=80',
    specs: { 'Pressure': '12 Bar', 'Tank': '500L', 'Motor': '10HP', 'Type': 'Reciprocating Piston' },
    description: 'Two-stage reciprocating piston compressor for industrial workshop air supply.'
  },
  {
    id: 'h6', name: 'Rexroth Hydraulic Pump Unit', category: 'Heavy Plant Equipment', subCategory: 'Hydraulics',
    brand: 'Bosch Rexroth', model: 'A4VSO', year: 2023, condition: 'New', listingType: 'Sale',
    priceSale: 850000, location: 'Industrial Area',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f138?auto=format&fit=crop&w=800&q=80',
    specs: { 'Pressure': '350 Bar', 'Displacement': '125cc', 'Control': 'DR', 'Application': 'Industrial' },
    description: 'Variable displacement axial piston pump for heavy industrial hydraulic systems.'
  },
  {
    id: 'h5', name: 'Carrier Industrial HVAC Chiller', category: 'Heavy Plant Equipment', subCategory: 'HVAC',
    brand: 'Carrier', model: '30XA', year: 2020, condition: 'Used', listingType: 'Sale',
    priceSale: 3200000, location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1504381171398-67b260228499?auto=format&fit=crop&w=800&q=80',
    specs: { 'Capacity': '100 Tons', 'Refrigerant': 'R134a', 'Type': 'Air Cooled', 'Compressor': 'Screw' },
    description: 'High efficiency air-cooled liquid chiller for large commercial HVAC applications.'
  },

  // --- B. LIGHT PLANT EQUIPMENT ---
  {
    id: 'l4', name: 'Honda EM5500 Petrol Generator', category: 'Light Plant Equipment', subCategory: 'Petrol Generators',
    brand: 'Honda', model: 'EM5500CXS', year: 2022, condition: 'New', listingType: 'Sale',
    priceSale: 220000, location: 'Westlands',
    image: 'https://images.unsplash.com/photo-1590642916589-592bfa3d2766?auto=format&fit=crop&w=800&q=80',
    specs: { 'Output': '5.5 kVA', 'Fuel': 'Petrol', 'Start': 'Electric/Recoil', 'Tank': '25L' },
    description: 'Reliable portable power for small construction sites and welding applications.'
  },
  {
    id: 'l3', name: 'Bomag BW 55 E Pedestrian Roller', category: 'Light Plant Equipment', subCategory: 'Pedestrian Rollers',
    brand: 'Bomag', model: 'BW 55 E', year: 2018, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 5,000 / day', location: 'Eldoret',
    image: 'https://images.unsplash.com/photo-1594498704257-233c70644265?auto=format&fit=crop&w=800&q=80',
    specs: { 'Drum Width': '560mm', 'Weight': '161 kg', 'Engine': 'Honda Petrol', 'Drive': 'Single Drum' },
    description: 'Single drum walk-behind roller for asphalt patching and landscape work.'
  },
  {
    id: 'l1', name: 'Wacker Neuson DPU 6555 Plate Compactor', category: 'Light Plant Equipment', subCategory: 'Plate Compactors',
    brand: 'Wacker Neuson', model: 'DPU 6555', year: 2020, condition: 'Used', listingType: 'Both',
    priceSale: 450000, priceLease: 'KES 3,500 / day', location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1628109968832-7206d2df2370?auto=format&fit=crop&w=800&q=80',
    specs: { 'Weight': '500 kg', 'Force': '65 kN', 'Start': 'Electric', 'Fuel': 'Diesel' },
    description: 'Reversible vibratory plate compactor. Heavy enough for sub-base compaction.'
  },
  {
    id: 'l2', name: 'Honda GX160 Poker Vibrator', category: 'Light Plant Equipment', subCategory: 'Vibrators & Pokers',
    brand: 'Honda', model: 'GX160 Drive Unit', year: 2023, condition: 'New', listingType: 'Sale',
    priceSale: 65000, location: 'Kisumu',
    image: 'https://images.unsplash.com/photo-1594926976920-43642345e821?auto=format&fit=crop&w=800&q=80',
    specs: { 'Engine': '5.5 HP Petrol', 'Coupling': 'Dynapac Type', 'Poker Size': '45mm/60mm', 'Hose': '6m' },
    description: 'Standard concrete vibrator drive unit. Reliable Honda engine with heavy duty poker shaft.'
  },

  // --- C. AUTOMOTIVE & HEAVY MACHINERY ---
  // Earthmovers
  {
    id: 'c1', name: 'Caterpillar 336D2 Excavator', category: 'Automotive & Heavy Machinery', subCategory: 'Earthmovers',
    brand: 'Caterpillar', model: '336D2', year: 2017, condition: 'Used', listingType: 'Both',
    priceSale: 16500000, priceLease: 'KES 45,000 / hour', hoursUsed: 6200, location: 'Mombasa Road Yard',
    image: 'https://images.unsplash.com/photo-1582035293672-025406d2d537?auto=format&fit=crop&w=800&q=80',
    specs: { 'Weight': '36 Ton', 'Bucket': '2.1 m3', 'Engine': 'CAT C9', 'Reach': '11m' },
    description: 'Work-ready excavator with rock bucket. Undercarriage at 60%.'
  },
  {
    id: 'c2', name: 'JCB 3CX Backhoe Loader', category: 'Automotive & Heavy Machinery', subCategory: 'Earthmovers',
    brand: 'JCB', model: '3CX Turbo', year: 2021, condition: 'Used', listingType: 'Sale',
    priceSale: 7800000, hoursUsed: 1200, location: 'Thika',
    image: 'https://images.unsplash.com/photo-1533501705609-b6cb8d579601?auto=format&fit=crop&w=800&q=80',
    specs: { 'Power': '92 HP', 'Drive': '4WD', 'Trans': 'Powershift', 'Extradig': 'Yes' },
    description: 'Versatile backhoe loader, barely used. Original paint. Ideal for site stripping.'
  },
  {
    id: 'c3', name: 'Komatsu GD663A Motor Grader', category: 'Automotive & Heavy Machinery', subCategory: 'Earthmovers',
    brand: 'Komatsu', model: 'GD663A', year: 2015, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 50,000 / day', hoursUsed: 8000, location: 'Nanyuki',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    specs: { 'Blade': '12ft', 'Ripper': 'Rear Mounted', 'Cab': 'Enclosed/AC', 'Engine': 'Komatsu S6D125' },
    description: 'Reliable grader for county road maintenance and grading.'
  },
  {
    id: 'c6', name: 'Hamm 3411 Soil Compactor', category: 'Automotive & Heavy Machinery', subCategory: 'Earthmovers',
    brand: 'Hamm', model: '3411', year: 2016, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 25,000 / day', location: 'Kisii',
    image: 'https://images.unsplash.com/photo-1590240226309-8736025340e5?auto=format&fit=crop&w=800&q=80',
    specs: { 'Weight': '11 Ton', 'Drum': 'Smooth', 'Engine': 'Deutz', 'Vibration': 'Dual Amplitude' },
    description: 'Single drum vibratory soil compactor. Perfect for road base compaction.'
  },
  // Roadwork
  {
    id: 'c5', name: 'Bitumen Distributor Truck', category: 'Automotive & Heavy Machinery', subCategory: 'Roadwork',
    brand: 'Faw', model: 'J5P', year: 2019, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 30,000 / day', location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1628109968779-7a0e24b423f4?auto=format&fit=crop&w=800&q=80',
    specs: { 'Tank': '6000L', 'Spray Bar': '4m Expandable', 'Heating': 'Diesel Burner', 'Chassis': 'Faw J5P' },
    description: 'Asphalt distributor for prime coat and tack coat application. Computerized spray rate control.'
  },
  {
    id: 'c7', name: 'Chip Spreader', category: 'Automotive & Heavy Machinery', subCategory: 'Roadwork',
    brand: 'Howo/Metong', model: 'LMT5311', year: 2021, condition: 'Used', listingType: 'Sale',
    priceSale: 6500000, location: 'Machakos',
    image: 'https://images.unsplash.com/photo-1598282361669-e053f3f0194c?auto=format&fit=crop&w=800&q=80',
    specs: { 'Spread Width': '3000mm', 'Hopper': 'Automatic', 'Engine': 'Weichai', 'Drive': '6x4' },
    description: 'Synchronous chip sealer for road surfacing. High precision aggregate spreading.'
  },
  // Transport
  {
    id: 'c4', name: 'Sinotruk HOWO 6x4 Tipper', category: 'Automotive & Heavy Machinery', subCategory: 'Transport',
    brand: 'Sinotruk', model: 'HOWO 371', year: 2023, condition: 'New', listingType: 'Sale',
    priceSale: 8800000, location: 'Mombasa',
    image: 'https://images.unsplash.com/photo-1605218427306-635ba243971c?auto=format&fit=crop&w=800&q=80',
    specs: { 'Payload': '25 Ton', 'Engine': 'WD615', 'HP': '371', 'Box': 'U-Shape' },
    description: 'Brand new heavy duty tipper truck. Ideal for ballast, sand, and muck transport.'
  },
  {
    id: 'c8', name: '3-Axle Flatbed Trailer', category: 'Automotive & Heavy Machinery', subCategory: 'Transport',
    brand: 'CIMC', model: '40ft Flatbed', year: 2022, condition: 'New', listingType: 'Sale',
    priceSale: 2500000, location: 'Mombasa',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    specs: { 'Length': '40ft', 'Axles': '3 (Fuwa)', 'Suspension': 'Mechanical', 'Twist Locks': '12' },
    description: 'Heavy duty flatbed trailer for container and general cargo transport.'
  },

  // --- D. LIGHT AUTOMOBILES ---
  {
    id: 'd1', name: 'Toyota Hilux Double Cab', category: 'Light Automobiles', subCategory: 'Pickup',
    brand: 'Toyota', model: 'Hilux Revo', year: 2022, condition: 'Used', listingType: 'Lease',
    priceLease: 'KES 8,000 / day', location: 'Westlands',
    image: 'https://images.unsplash.com/photo-1594917088927-4a00486c9d06?auto=format&fit=crop&w=800&q=80',
    specs: { 'Engine': '2.4L GD', 'Trans': 'Automatic', 'Drive': '4x4', 'Fuel': 'Diesel' },
    description: 'Site inspection vehicle. Clean, comprehensive insurance included.'
  },
  {
    id: 'd2', name: 'Nissan NP300 Hardbody', category: 'Light Automobiles', subCategory: 'Pickup',
    brand: 'Nissan', model: 'NP300', year: 2018, condition: 'Used', listingType: 'Sale',
    priceSale: 2400000, hoursUsed: 120000, location: 'Kisumu',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    specs: { 'Engine': 'YD25', 'Body': 'Double Cab', 'Canopy': 'Yes', 'Drive': '4x4' },
    description: 'Rugged workhorse, serviced at DT Dobie. Good tires.'
  },
  {
    id: 'd3', name: 'Isuzu D-Max TFR', category: 'Light Automobiles', subCategory: 'Pickup',
    brand: 'Isuzu', model: 'D-Max', year: 2023, condition: 'New', listingType: 'Sale',
    priceSale: 5200000, location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1626859560372-b3527b876a47?auto=format&fit=crop&w=800&q=80',
    specs: { 'Engine': '4JJ1', 'Trans': 'Manual', 'Drive': '4x4', 'Color': 'Silver' },
    description: 'The king of Kenyan roads. Brand new zero mileage.'
  },
  {
    id: 'd4', name: 'Mitsubishi L200 Sportero', category: 'Light Automobiles', subCategory: 'Pickup',
    brand: 'Mitsubishi', model: 'L200', year: 2021, condition: 'Used', listingType: 'Sale',
    priceSale: 4200000, location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1609520897258-7521d011d619?auto=format&fit=crop&w=800&q=80',
    specs: { 'Engine': '2.4L MIVEC', 'Trans': 'Auto', 'Drive': '4x4', 'Interior': 'Leather' },
    description: 'Stylish and powerful double cab pickup. Excellent off-road capability.'
  },
  {
    id: 'd5', name: 'Ford Ranger XLT', category: 'Light Automobiles', subCategory: 'Pickup',
    brand: 'Ford', model: 'Ranger T6', year: 2020, condition: 'Used', listingType: 'Sale',
    priceSale: 3800000, location: 'Karen',
    image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&w=800&q=80',
    specs: { 'Engine': '2.2L TDCi', 'Trans': 'Auto', 'Drive': '4x4', 'Tech': 'Sync 3' },
    description: 'American toughness. Ford Ranger XLT with roller shutter and bed liner.'
  }
];

// --- SPARE PARTS (Supplier Ratings & Verified Reviews) ---
export const SPARE_PARTS: SparePart[] = [
  { 
    id: 'p1', name: 'Hydraulic Main Pump (K3V112)', partNumber: 'K3V112DT', category: 'Hydraulics', equipmentType: ['Excavator'],
    price: 350000, stock: 2, image: 'https://images.unsplash.com/photo-1518306065525-451631745428?auto=format&fit=crop&w=300&q=80', 
    supplier: { name: 'Rexroth Certified', verified: true, rating: 4.9 },
    description: 'Genuine Kawasaki K3V112DT hydraulic pump for CAT and Komatsu 20-ton excavators.',
    specs: { 'Flow': '220 L/min', 'Pressure': '34.3 MPa' },
    reviews: [{ user: 'John K.', rating: 5, comment: 'Perfect fit for my 320D', date: '2023-11-12' }]
  },
  { 
    id: 'p2', name: 'Turbocharger CAT C9', partNumber: '10R-7164', category: 'Engine Parts', equipmentType: ['Excavator', 'Grader'],
    price: 85000, stock: 12, image: 'https://images.unsplash.com/photo-1565507759560-9d543d3b7305?auto=format&fit=crop&w=300&q=80', 
    supplier: { name: 'Dagiv Genuine', verified: true, rating: 4.8 },
    description: 'Remanufactured turbocharger for Caterpillar C9 ACERT engines.',
    specs: { 'Model': 'S300', 'Cooling': 'Oil' },
    reviews: []
  },
  { 
    id: 'p3', name: 'Bucket Tooth (Rock Chisel)', partNumber: '1U3352RC', category: 'Ground Engaging Tools', equipmentType: ['Excavator'],
    price: 4500, stock: 500, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=300&q=80', 
    supplier: { name: 'HardSteel Kenya', verified: true, rating: 4.5 },
    description: 'J350 series rock chisel tooth. High hardness for abrasive soil.',
    specs: { 'Series': 'J350', 'Material': 'Alloy Steel' },
    reviews: []
  },
  {
    id: 'p4', name: 'Fleetguard Air Filter', partNumber: 'AF25278K', category: 'Filters', equipmentType: ['Truck', 'Generator'],
    price: 3200, stock: 150, image: 'https://images.unsplash.com/photo-1487803876022-d779b5c5e88d?auto=format&fit=crop&w=300&q=80', 
    supplier: { name: 'Nairobi Filter Center', verified: true, rating: 4.7 },
    description: 'Primary and secondary air filter set for Cummins engines.',
    specs: { 'Efficiency': '99.9%', 'Type': 'Radial Seal' },
    reviews: []
  },
  {
    id: 'p5', name: 'Track Chain Assembly', partNumber: '20Y-32-00012', category: 'Undercarriage', equipmentType: ['Bulldozer', 'Excavator'],
    price: 280000, stock: 4, image: 'https://images.unsplash.com/photo-1594953935272-a169052b0f44?auto=format&fit=crop&w=300&q=80', 
    supplier: { name: 'HeavyPart Global', verified: false, rating: 4.0 },
    description: 'Sealed and lubricated track chain for PC200/D65 machines.',
    specs: { 'Links': '45', 'Pitch': '190mm' },
    reviews: []
  },
  {
    id: 'p6', name: 'Alternator 24V 60A', partNumber: '600-821-6120', category: 'Electrical', equipmentType: ['Grader', 'Truck'],
    price: 28000, stock: 8, image: 'https://images.unsplash.com/photo-1628109968832-7206d2df2370?auto=format&fit=crop&w=300&q=80', 
    supplier: { name: 'Dagiv Genuine', verified: true, rating: 4.8 },
    description: 'Heavy duty alternator compatible with Komatsu and Isuzu engines.',
    specs: { 'Voltage': '24V', 'Amperage': '60A' },
    reviews: []
  },
  {
    id: 'p7', name: 'Injector Nozzle (Denso)', partNumber: '095000-6366', category: 'Engine Parts', equipmentType: ['Pickup', 'Truck'],
    price: 32000, stock: 20, image: 'https://images.unsplash.com/photo-1486262715619-01b8c2297615?auto=format&fit=crop&w=300&q=80', 
    supplier: { name: 'Diesel Systems Ltd', verified: true, rating: 4.6 },
    description: 'Common rail injector for Isuzu 4HK1 engines.',
    specs: { 'Type': 'Common Rail', 'Brand': 'Denso' },
    reviews: []
  }
];

// --- PROFESSIONALS PROFILES (Portfolio & Badge System) ---
export const PROFESSIONALS: ProfessionalProfile[] = [
  { 
    id: 'pr1', name: 'Eng. Juma Ochieng', role: 'Civil Engineer', specialization: 'Structural & Concrete',
    rating: 4.9, location: 'Nairobi', verified: true,
    image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=200&q=80',
    bio: 'EBK Registered Professional Engineer with 12 years of experience in high-rise structural design and concrete forensics. Expert in calculating load-bearing capacities for industrial warehouses.',
    yearsExperience: 12,
    certifications: ['EBK A2341', 'NCA Lead'],
    portfolio: [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1590642916589-592bfa3d2766?auto=format&fit=crop&w=400&q=80'
    ],
    reviews: [
        { id: 'r1', user: 'Mombasa Cement', rating: 5, comment: 'Eng. Juma saved us millions by optimizing our steel structure design.', date: '2023-09-10', verifiedClient: true }
    ]
  },
  { 
    id: 'pr7', name: 'Eng. Alice Muthoni', role: 'Structural Engineer', specialization: 'Steel Frameworks',
    rating: 4.8, location: 'Nakuru', verified: true,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    bio: 'Specialist in steel structure fabrication drawings and load testing. 8 years experience with mining infrastructure.',
    yearsExperience: 8,
    certifications: ['EBK B5521', 'AutoCAD Pro'],
    portfolio: [
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80'
    ],
    reviews: [
         { id: 'r8', user: 'Steel Structures Ltd', rating: 5, comment: 'Very precise drawings.', date: '2023-11-05', verifiedClient: true }
    ]
  },
  { 
    id: 'pr8', name: 'Eng. Kevin Maalim', role: 'Mechanical Engineer', specialization: 'Hydraulics & Heavy Plant',
    rating: 4.9, location: 'Mombasa', verified: true,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    bio: 'Expert in caterpillar engine overhauls and hydraulic pump diagnostics. 15 years servicing mining fleets.',
    yearsExperience: 15,
    certifications: ['CAT Certified', 'Hydraulic Systems L3'],
    portfolio: [
        'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=400&q=80'
    ],
    reviews: [
         { id: 'r9', user: 'Logistics Manager', rating: 5, comment: 'Fixed the transmission issue no one else could solve.', date: '2023-10-20', verifiedClient: true }
    ]
  },
  { 
    id: 'pr2', name: 'Sarah Wanjiku', role: 'Software Engineer', specialization: 'Industrial IoT & Automation',
    rating: 5.0, location: 'Remote / Nairobi', verified: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    bio: 'Full stack developer specializing in SCADA systems and Fleet Management integrations. I build custom dashboards for factory machine monitoring.',
    yearsExperience: 6,
    certifications: ['AWS Certified', 'Python Expert'],
    portfolio: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
    ],
    reviews: [
        { id: 'r2', user: 'Dagiv Fleet Mgr', rating: 5, comment: 'Excellent work on the fuel monitoring module.', date: '2023-10-05', verifiedClient: true }
    ]
  },
  { 
    id: 'pr3', name: 'David Kamau', role: 'Welder', specialization: 'TIG/MIG High Pressure',
    rating: 4.7, location: 'Thika', verified: true,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=200&q=80',
    bio: 'Specialist in pipeline welding and excavator bucket hard-facing. I restore broken boom arms to factory strength.',
    yearsExperience: 15,
    certifications: ['Grade 1 Welder', 'Safety Pass'],
    portfolio: [
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80'
    ],
    reviews: [
        { id: 'r3', user: 'John (Operator)', rating: 4, comment: 'Strong welds, but took a bit longer than expected.', date: '2023-08-22', verifiedClient: true },
        { id: 'r4', user: 'Site Manager', rating: 5, comment: 'Fixed our crusher jaw overnight.', date: '2023-11-01', verifiedClient: false }
    ]
  },
  {
    id: 'pr4', name: 'Peter Njoroge', role: 'Driver', specialization: 'Heavy Haulage / Low Bed', 
    rating: 4.8, location: 'Mombasa', verified: true,
    image: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=200&q=80',
    bio: 'Long-distance heavy commercial driver with 20 years experience. Specializes in low-bed transport of excavators and abnormal loads across the world.',
    yearsExperience: 20,
    certifications: ['Class CE License', 'Defensive Driving'],
    portfolio: [],
    reviews: [
         { id: 'r5', user: 'Logistics Coord', rating: 5, comment: 'Delivered the D8 Dozer to Turkana safely.', date: '2023-12-15', verifiedClient: true }
    ]
  },
  // Placeholder to ensure the Mechanic tab is not empty
  { 
    id: 'pr5', name: 'Samuel Kiplagat', role: 'Mechanic', specialization: 'Diesel Engine Overhaul', 
    rating: 4.8, location: 'Eldoret', verified: true, image: '', 
    bio: 'Diesel Engine expert.', yearsExperience: 8, certifications: [], portfolio: [], reviews: [] 
  },
  // Placeholder for Operator
  { 
    id: 'pr6', name: 'Michael Otieno', role: 'Operator', specialization: 'Heavy Crane', 
    rating: 4.6, location: 'Mombasa', verified: true, image: '', 
    bio: 'Certified Crane Operator.', yearsExperience: 10, certifications: [], portfolio: [], reviews: [] 
  }
];
// --- SERVICES CONTENT (With Smart IDs for Ordering) ---
export const SERVICES_CONTENT: ServiceDetail[] = [
  {
    id: 'srv1',
    title: 'Inspection, Purchase & Commissioning',
    shortDesc: 'We safeguard your capital. Our engineers verify machine health, engine compression, and hydraulic efficiency.',
    fullDesc: 'Heavy machinery isn’t a casual purchase, it’s a high-stakes investment. DAGIV becomes your technical shield. Our certified engineers carry out rigorous, multi-point inspections covering engines, hydraulic systems, electricals, and structural integrity, eliminating the risk of acquiring defective or underperforming equipment. Beyond inspection, we manage the entire procurement lifecycle; from sourcing the right equipment and verifying specifications to delivery, on-site installation, testing, and final commissioning. You get machinery that’s verified, compliant, and ready to work from day one.',
    icon: SearchCheck,
    process: ['Requirement Analysis', 'Global Sourcing', 'Technical Audit (Oil Analysis, Pressure Tests)', 'Purchase Negotiation', 'Logistics & Import', 'On-site Commissioning'],
    industries: ['Construction', 'Mining', 'Agriculture'],
    benefits: ['Risk Mitigation', 'Price Negotiation Leverage', 'Compliance with KEBS/DOSHS'],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv2',
    title: 'Logistics & Leasing',
    shortDesc: 'Move earth without moving your bank balance. Flexible leasing and heavy haulage logistics.',
    fullDesc: 'DAGIV offers a comprehensive fleet for both short-term and long-term leasing, tailored to project-specific demands. Whether you require a 50-ton crane for a week or a fleet of tippers for a year, we deliver dependable, well-maintained equipment when and where it’s needed. Our logistics arm specializes in low-bed and heavy-haul transportation, ensuring the safe, compliant movement of heavy plant machinery locally and across international borders. ',
    icon: Truck,
    process: ['Lease Application', 'Site Assessment', 'Machine Deployment', 'Operator Provision', 'Monthly Maintenance', 'Demobilization'],
    industries: ['Road Works', 'Civil Engineering', 'Transport'],
    benefits: ['Zero CAPEX Required', 'Maintenance Included', 'Immediate Availability'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv3',
    title: 'Maintenance & Repairs',
    shortDesc: 'Zero downtime strategy. Predictive analytics and emergency response teams.',
    fullDesc: 'Downtime doesn’t just slow you down, it costs millions. That’s why our maintenance services are built for rapid response and pinpoint accuracy. We offer preventive maintenance contracts (AMC- Annual Maintenance Contract) to stop failures before they happen, alongside 24/7 emergency breakdown support when they do. Our mobile workshops are fully equipped to carry out engine overhauls, hydraulic repairs, and advanced electrical diagnostics on site, reducing delays and maximizing uptime.',
    icon: Wrench,
    process: ['Breakdown Call/Schedule', 'Mobile Team Dispatch', 'Diagnostic & Troubleshooting', 'Part Replacement', 'Testing & Calibration', 'Service Report Generation'],
    industries: ['Manufacturing', 'Construction', 'Logistics'],
    benefits: ['Extended Machine Life', 'Reduced Fuel Consumption', 'Higher Resale Value'],
    image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv4',
    title: 'Welding & Fabrication',
    shortDesc: 'Industrial strength solutions. Bucket repairs, structural steel, and custom modifications.',
    fullDesc: 'From hard-facing excavator buckets to fabricating heavy-duty truck bodies, DAGIV’s metalwork division delivers precision, durability, and structural integrity. We specialize in structural steel fabrication and erection for warehouses, plants, and industrial facilities, as well as custom modifications tailored to specialized operational requirements.',
    icon: Flame,
    process: ['Design & CAD Modeling', 'Material Selection', 'Cutting & Forming', 'Welding (MIG/TIG/Arc)', 'Quality Testing (NDT)', 'Finishing & Painting'],
    industries: ['Industrial', 'Mining', 'Automotive'],
    benefits: ['Custom Solutions', 'High Durability', 'Quick Turnaround'],
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80'
  }
];