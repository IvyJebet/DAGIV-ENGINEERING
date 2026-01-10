export enum PageView {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  EQUIPMENT = 'EQUIPMENT',
  ERP = 'ERP',
  PROFESSIONALS = 'PROFESSIONALS',
  SPARE_PARTS = 'SPARE_PARTS',
  CONTACT = 'CONTACT',
  CONSULT = 'CONSULT'
}

export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  PROFESSIONAL = 'PROFESSIONAL', // Engineer, Mechanic, Welder
  OPERATOR = 'OPERATOR', // Driver, Machine Operator
  FLEET_MANAGER = 'FLEET_MANAGER' // ERP Admin
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string; // A. Heavy Plant, B. Light Plant, etc.
  subCategory: string; // Generators, Excavators, etc.
  brand: string;
  model: string;
  year: number;
  condition: 'New' | 'Used' | 'Refurbished';
  listingType: 'Sale' | 'Lease' | 'Both';
  priceSale?: number;
  priceLease?: string; // e.g., "15,000/day"
  hoursUsed?: number;
  location: string;
  image: string;
  specs: Record<string, string>;
  description: string;
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  equipmentType: string[]; // e.g., ['Excavator', 'Backhoe']
  price: number;
  stock: number;
  image: string;
  supplier: {
    name: string;
    verified: boolean;
    rating: number;
  };
  description: string;
  specs: Record<string, string>;
  reviews: { user: string; rating: number; comment: string; date: string }[];
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  role: 'Engineer' | 'Welder' | 'Mechanic' | 'Fabricator' | 'Operator' | 'Drivers';
  rating: number;
  location: string;
  verified: boolean;
}

export interface OperatorLog {
  id: string;
  machineId: string;
  operatorName: string;
  date: string;
  startTime: string;
  endTime: string;
  startOdometer?: number;
  endOdometer?: number;
  fuelAddedLiters: number;
  location: string;
  checklist: {
    tires: boolean;
    oil: boolean;
    hydraulics: boolean;
    brakes: boolean;
  };
  notes: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: any;
  process: string[];
  industries: string[];
  benefits: string[];
  image: string;
}

export interface MaintenanceTask {
  id: string;
  machineName: string;
  type: 'Preventive' | 'Corrective' | 'Inspection';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Alert {
  id: string;
  type: 'Insurance' | 'License' | 'Maintenance' | 'Theft';
  message: string;
  severity: 'Warning' | 'Critical';
  date: string;
}