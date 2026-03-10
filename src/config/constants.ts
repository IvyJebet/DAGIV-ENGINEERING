// constants.ts
import { EquipmentItem, SparePart, ProfessionalProfile, ServiceDetail, MarketItem, SellerProfile } from '@/types/index';
import { SearchCheck, Truck, Wrench, Flame, Laptop, ScanLineIcon} from 'lucide-react';

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
    title: 'Computer Diagnosis',
    shortDesc: 'Advanced electronic diagnostics for heavy machinery and fleet vehicles using professional OBD2 scanners.',
    fullDesc: 'Modern machinery relies heavily on Electronic Control Units (ECUs) to manage engine performance, transmission, safety, and emissions. Our computer diagnostic service uses professional-grade scanners such as Launch, Autel, and CAT ET to accurately read fault codes, analyze live sensor data, and perform system calibrations and resets. We diagnose issues including check engine warnings, transmission faults, ABS errors, and emission system alerts, both on-site and in our workshop garages. Each diagnosis includes a clear fault explanation, system health assessment, and a practical repair roadmap, helping you make informed decisions before costly breakdowns occur.',
    icon: Laptop,
    process: ['On-site Deployment', 'OBD2/J1939 Connection', 'Error Code Reading', 'Live Data Analysis', 'System Reset/Calibration', 'Report Generation'],
    industries: ['Automotive', 'Logistics', 'Construction'],
    benefits: ['Accurate Troubleshooting', 'Preventive Health Check', 'Reset Service Lights'],
    // Updated to reference your local image in the public folder
    image: 'src/Assets/Computer Diagnosis.png', 
    requestFields: [
      { id: 'make_model', label: 'Machine Make & Model', type: 'text', placeholder: 'e.g. Komatsu PC200-8 or Toyota Hilux', required: true },
      { id: 'yom', label: 'Year of Manufacture', type: 'number', placeholder: 'e.g. 2018', required: true },
      { id: 'symptoms', label: 'Observed Symptoms', type: 'textarea', placeholder: 'e.g. Loss of power, Black smoke, Check Engine Light on...', required: true },
      { id: 'location', label: 'Machine Location', type: 'text', placeholder: 'e.g. Industrial Area, Road C', required: true }
    ]
  },

  {
    id: 'srv2',
    title: 'Maintenance & Repairs',
    shortDesc: 'Zero downtime strategy. Predictive analytics and emergency response teams.',
    fullDesc: 'Downtime doesn’t just slow you down, it costs millions. That’s why our maintenance services are built for rapid response and pinpoint accuracy. We offer preventive maintenance contracts (AMC- Annual Maintenance Contract) to stop failures before they happen, alongside 24/7 emergency breakdown support when they do. Our mobile workshops are fully equipped to carry out engine overhauls, hydraulic repairs, and advanced electrical diagnostics on site, reducing delays and maximizing uptime.',
    icon: Wrench,
    process: ['Breakdown Call/Schedule', 'Mobile Team Dispatch', 'Diagnostic & Troubleshooting', 'Part Replacement', 'Testing & Calibration', 'Service Report Generation'],
    industries: ['Manufacturing', 'Construction', 'Logistics'],
    benefits: ['Extended Machine Life', 'Reduced Fuel Consumption', 'Higher Resale Value'],
    image: 'src/Assets/Maintenance and Repairs.png',
    requestFields: [
      { id: 'machine_id', label: 'Machine Model/Plate', type: 'text', placeholder: 'e.g. CAT 320D / KBA 123A', required: true },
      { id: 'issue_desc', label: 'Description of Failure', type: 'textarea', placeholder: 'Describe the breakdown or noise...', required: true },
      { id: 'urgency', label: 'Urgency Level', type: 'select', options: ['Routine Service', 'Urgent Repair', 'Critical Breakdown'], required: true },
      { id: 'engine_hours', label: 'Current Hours/Mileage', type: 'number', placeholder: 'e.g. 12,500 hrs', required: false }
    ]
  },

  {
    id: 'srv3',
    title: 'Pre-purchase Inspections & Commissioning',
    shortDesc: 'We safeguard your capital. Our engineers verify machine health, engine compression, and hydraulic efficiency.',
    fullDesc: 'Heavy machinery isn’t a casual purchase, it’s a high-stakes investment. DAGIV becomes your technical shield. Our certified engineers carry out rigorous, multi-point inspections covering engines, hydraulic systems, electricals, and structural integrity, eliminating the risk of acquiring defective or underperforming equipment. Beyond inspection, we manage the entire procurement lifecycle; from sourcing the right equipment and verifying specifications to delivery, on-site installation, testing, and final commissioning. You get machinery that’s verified, compliant, and ready to work from day one.',
    icon: SearchCheck,
    process: ['Requirement Analysis', 'Global Sourcing', 'Technical Audit (Oil Analysis, Pressure Tests)', 'Purchase Negotiation', 'Logistics & Import', 'On-site Commissioning'],
    industries: ['Construction', 'Mining', 'Agriculture'],
    benefits: ['Risk Mitigation', 'Price Negotiation Leverage', 'Compliance with KEBS/DOSHS'],
    image: 'src/Assets/Pre-purchase Inspections.png',
    requestFields: [
      { id: 'machine_type', label: 'Target Machine Type', type: 'text', placeholder: 'e.g. Excavator, Wheel Loader', required: true },
      { id: 'budget', label: 'Target Purchase Budget', type: 'text', placeholder: 'e.g. KES 5M - 8M (Machine Cost)', required: false },
      { id: 'inspection_loc', label: 'Current Location (if identified)', type: 'text', placeholder: 'Where is the machine?', required: true },
      { id: 'date', label: 'Preferred Inspection Date', type: 'date', required: true }
    ]
  },
  
  {
    id: 'srv4',
    title: 'Logistics & Leasing',
    shortDesc: 'Move earth without moving your bank balance. Flexible leasing and heavy haulage logistics.',
    fullDesc: 'DAGIV offers a comprehensive fleet for both short-term and long-term leasing, tailored to project-specific demands. Whether you require a 50-ton crane for a week or a fleet of tippers for a year, we deliver dependable, well-maintained equipment when and where it’s needed. Our logistics arm specializes in low-bed and heavy-haul transportation, ensuring the safe, compliant movement of heavy plant machinery locally and across international borders. ',
    icon: Truck,
    process: ['Lease Application', 'Site Assessment', 'Machine Deployment', 'Operator Provision', 'Monthly Maintenance', 'Demobilization'],
    industries: ['Road Works', 'Civil Engineering', 'Transport'],
    benefits: ['Zero CAPEX Required', 'Maintenance Included', 'Immediate Availability'],
    // Updated to reference your local image in the public folder
    image: 'src/Assets/Logistics and Leasing.png', 
    requestFields: [
      { 
        id: 'equipment', 
        label: 'Equipment Needed', 
        type: 'select', 
        options: [
          'Excavator (20T - 40T)', 
          'Backhoe Loader', 
          'Bulldozer (D6 - D9)', 
          'Motor Grader', 
          'Wheel Loader', 
          'Tipper Truck / Dump Truck', 
          'Compactor / Roller', 
          'Mobile Crane', 
          'Lowbed Trailer', 
          'Water Bowser', 
          'Fuel Tanker', 
          'Concrete Mixer', 
          'Generator', 
          'Air Compressor',
          'Forklift',
        ], 
        required: true 
      },
      { 
        id: 'other_equipment', 
        label: 'Specify Equipment', 
        type: 'text', 
        placeholder: 'Please describe the specific machinery needed...', 
        required: false 
      },
      { id: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 2 Months', required: true },
      { id: 'site', label: 'Site Location', type: 'text', required: true },
      { id: 'operator', label: 'Operator Required?', type: 'select', options: ['Yes (Wet Rate)', 'No (Dry Rate)'], required: true }
    ]
  },
  
  {
    id: 'srv5',
    title: 'Welding & Fabrication',
    shortDesc: 'Industrial strength solutions. Bucket repairs, structural steel, and custom modifications.',
    fullDesc: 'From hard-facing excavator buckets to fabricating heavy-duty truck bodies, DAGIV’s metalwork division delivers precision, durability, and structural integrity. We specialize in structural steel fabrication and erection for warehouses, plants, and industrial facilities, as well as custom modifications tailored to specialized operational requirements.',
    icon: Flame,
    process: ['Design & CAD Modeling', 'Material Selection', 'Cutting & Forming', 'Welding (MIG/TIG/Arc)', 'Quality Testing (NDT)', 'Finishing & Painting'],
    industries: ['Industrial', 'Mining', 'Automotive'],
    benefits: ['Custom Solutions', 'High Durability', 'Quick Turnaround'],
    image: 'src/Assets/Welding and Fabrication.png',
    requestFields: [
      { id: 'fab_type', label: 'Fabrication Type', type: 'select', options: ['Structural Steel', 'Bucket Repair', 'Tank Fabrication', 'Custom Modification'], required: true },
      { id: 'material', label: 'Material Preference', type: 'text', placeholder: 'e.g. Mild Steel, Hardox, Aluminum', required: false },
      { id: 'dimensions', label: 'Rough Dimensions/Scope', type: 'textarea', placeholder: 'Describe size or upload drawing link...', required: true }
    ]
  }
];