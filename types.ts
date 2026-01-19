// types.ts

export enum PageView {
  HOME = 'home',
  EQUIPMENT = 'equipment',
  SPARE_PARTS = 'spare-parts',
  SERVICES = 'services',
  ERP = 'erp',
  PROFESSIONALS = 'professionals',
  CONSULT = 'consult',
  CONTACT = 'contact'
}

export enum UserRole {
  GUEST = 'guest',
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

export interface OperatorLog {
  id: string;
  machineId: string;
  operatorName: string;
  date: string;
  startTime: string;
  endTime: string;
  startOdometer: number;
  endOdometer: number; // 0 if not applicable (using accumulated reading)
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

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  subCategory: string; // Added for deeper filtering
  brand: string;
  model: string;
  year: number;
  condition: 'New' | 'Used' | 'Refurbished';
  listingType: 'Sale' | 'Lease' | 'Both';
  priceSale?: number;
  priceLease?: string;
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
  equipmentType: string[];
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
  reviews: {
      user: string;
      rating: number;
      comment: string;
      date: string;
  }[];
}

// NEW: Review Interface
export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verifiedClient: boolean;
}

// UPDATED: Professional Profile with Portfolio
export interface ProfessionalProfile {
  id: string;
  name: string;
  role: 'Civil Engineer' | 'Structural Engineer' | 'Mechanical Engineer' | 'Software Engineer' | 'Welder' | 'Mechanic' | 'Fabricator' | 'Operator' | 'Driver' | 'Architect' | 'Surveyor'; 
  specialization: string; 
  rating: number;
  location: string;
  verified: boolean;
  image: string;
  bio: string;
  yearsExperience: number;
  certifications: string[];
  portfolio: string[];
  reviews: Review[];
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
  machineId: string;
  taskName: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

export interface Alert {
  id: string;
  type: 'Maintenance' | 'Fuel' | 'Usage';
  message: string;
  date: string;
}