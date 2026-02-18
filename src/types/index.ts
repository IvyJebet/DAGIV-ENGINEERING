// types.ts

export enum PageView {
  HOME = 'home',
  MARKETPLACE_BUY = 'marketplace-buy',
  MARKETPLACE_RENT = 'marketplace-rent',
  SPARE_PARTS = 'spare-parts',
  SERVICES = 'services',
  ERP = 'erp',
  PROFESSIONALS = 'professionals',
  CONSULT = 'consult',
  CONTACT = 'contact',
  SELLER_DASHBOARD = 'seller-dashboard'
}

export enum UserRole {
  GUEST = 'guest',
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

// --- ORDER LIFECYCLE ENUMS ---
export enum OrderStatusEquipment {
  PENDING_INSPECTION = 'PENDING_INSPECTION', // Step 1: Buyer books inspection
  INSPECTION_VERIFIED = 'INSPECTION_VERIFIED', // Step 2: Engineer approves condition
  ESCROW_SECURED = 'ESCROW_SECURED',         // Step 3: Funds held in trust
  RELEASED_FOR_DELIVERY = 'RELEASED',        // Step 4: Seller releases item
  COMPLETED = 'COMPLETED'                    // Step 5: Buyer accepts, funds released
}

export enum OrderStatusRent {
  AVAILABILITY_CHECK = 'AVAILABILITY_CHECK',
  MOBILIZATION_FUNDED = 'MOBILIZATION_FUNDED',
  ACTIVE_LEASE = 'ACTIVE_LEASE',
  DEMOBILIZATION = 'DEMOBILIZATION',
  SETTLED = 'SETTLED'
}

export enum OrderStatusPart {
  ORDER_PLACED = 'ORDER_PLACED',
  PAYMENT_VERIFIED = 'PAYMENT_VERIFIED',
  PACKED = 'PACKED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED'
}

// --- MARKETPLACE DATA MODELS ---

export interface SpecificationGroup {
  groupName: string; // e.g., "Engine", "Dimensions", "Performance"
  items: { label: string; value: string | number; unit?: string }[];
}

export interface SellerProfile {
  id: string;
  name: string;
  type: 'Individual' | 'Company' | 'Dealer';
  verified: boolean;
  rating: number;
  joinedDate: string;
  location: string;
  badges: string[];
}

export interface MarketItem {
  sellerName: string;
  id: string;
  title: string;
  category: string;
  subCategory: string;
  type: 'Equipment' | 'Part';
  listingType: 'Sale' | 'Rent'; 
  
  // Commercial
  price: number;
  currency: 'KES' | 'USD';
  priceUnit?: 'per day' | 'per hour' | 'fixed';
  negotiable: boolean;
  financeAvailable?: boolean; // New: Badge for financing
  estMonthlyPayment?: number; // New: Calculated estimate

  // Asset Details
  brand: string;
  model: string;
  yom?: number;
  hours?: number; // Odometer/Hours
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Refurbished' | 'For Parts';
  
  // Rich Data
  description: string;
  specifications: SpecificationGroup[]; // Structured specs for display
  
  // Media
  images: string[];
  videoUrl?: string; // New: YouTube/Vimeo link
  
  // Logistics
  location: string;
  deliveryOptions: 'Collection Only' | 'Nationwide Delivery' | 'International Shipping';
  estimatedMobTime?: string; // e.g. "Available immediately" or "3 days"

  // System
  sellerId: string;
  seller: SellerProfile;
  promoted: boolean;
  verifiedByDagiv: boolean;
  stockReference?: string;
}

// --- EXISTING INTERFACES (Retained) ---

export interface OperatorLog {
  id: string;
  machineId: string;
  operatorName: string;
  date: string;
  startTime: string;
  endTime: string;
  startOdometer: number;
  endOdometer: number;
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

// Retained for legacy components if any
export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  subCategory: string;
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
  role: string;
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
  requestFields: ServiceFormField[];
}

export interface ServiceFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean;
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