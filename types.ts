// types.ts

export enum PageView {
  HOME = 'home',
  MARKETPLACE_BUY = 'marketplace-buy', // Renamed from EQUIPMENT
  MARKETPLACE_RENT = 'marketplace-rent', // New Dedicated Leasing Tab
  SPARE_PARTS = 'spare-parts',
  SERVICES = 'services',
  ERP = 'erp',
  PROFESSIONALS = 'professionals',
  CONSULT = 'consult',
  CONTACT = 'contact',
  SELLER_DASHBOARD = 'seller-dashboard' // New
}

export enum UserRole {
  GUEST = 'guest',
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

// NEW: Seller Profile for the Marketplace
export interface SellerProfile {
  id: string;
  name: string;
  type: 'Individual' | 'Company' | 'Dealer';
  verified: boolean;
  rating: number;
  joinedDate: string;
  location: string;
  badges: string[]; // e.g., "Fast Responder", "Premium Seller"
}

// NEW: Unified Market Item (Replaces EquipmentItem for the new Marketplace)
export interface MarketItem {
  id: string;
  title: string;
  category: string; // The 4 main categories
  subCategory: string; // The exhaustive list
  type: 'Equipment' | 'Part';
  listingType: 'Sale' | 'Rent'; 
  
  // Pricing
  price: number;
  currency: 'KES' | 'USD';
  priceUnit?: 'per day' | 'per hour' | 'fixed'; // For rentals
  negotiable: boolean;

  // Asset Details
  brand: string;
  model: string;
  yom?: number; // Year of Manufacture
  hours?: number;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Refurbished' | 'For Parts';
  
  // Media
  images: string[];
  
  // Seller
  sellerId: string;
  seller: SellerProfile;
  
  // Location
  location: string;
  
  // System
  promoted: boolean; // "Boosted" ads
  verifiedByDagiv: boolean; // Inspected by your engineers
}

// --- EXISTING INTERFACES (Retained for functionality) ---

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

// Legacy Interface 
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

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verifiedClient: boolean;
}

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