// src/config/listingSchemas.ts

export type ListingType = "SALE" | "RENT" | "PART";
export type FieldType = "text" | "number" | "select" | "multiselect";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  dependsOn?: {
    field: string;
    value: string;
  };
}

export const CATEGORY_FIELDS: Record<string, FieldConfig[]> = {
  "Excavators": [
    { name: "bucketCapacity", label: "Bucket Capacity (m³)", type: "number", placeholder: "e.g. 1.2" },
    { name: "diggingDepth", label: "Max Digging Depth (mm)", type: "number", placeholder: "e.g. 6500" },
    { name: "undercarriageType", label: "Undercarriage Type", type: "select", options: ["Tracked", "Wheeled"] },
  ],
  "Air Compressors": [
    { name: "outputCapacity", label: "Output Capacity (CFM)", type: "number", placeholder: "e.g. 400" },
    { name: "workingPressure", label: "Working Pressure (Bar)", type: "number", placeholder: "e.g. 10" },
    { name: "powerPhase", label: "Phase", type: "select", options: ["Single Phase", "Three Phase"] },
  ],
  "Trucks": [
    { name: "mileage", label: "Mileage (km)", type: "number", placeholder: "e.g. 150000" },
    { name: "axles", label: "Number of Axles", type: "number", placeholder: "e.g. 3" },
    { name: "loadCapacity", label: "Load Capacity (tons)", type: "number", placeholder: "e.g. 20" },
  ],
  "Generators": [
    { name: "kvaRating", label: "Power Output (kVA)", type: "number", placeholder: "e.g. 500" },
    { name: "engineMake", label: "Engine Make", type: "text", placeholder: "e.g. Cummins" },
    { name: "canopyType", label: "Canopy", type: "select", options: ["Open", "Silent / Enclosed"] },
  ]
};

export const UNIVERSAL_MACHINE_FIELDS: FieldConfig[] = [
  { name: "operatingWeight", label: "Operating Weight (kg)", type: "number", placeholder: "e.g. 21000" },
  { name: "enginePower", label: "Engine Power (HP/kW)", type: "text", placeholder: "e.g. 150 HP" },
  { name: "fuelType", label: "Fuel Type", type: "select", options: ["Diesel", "Petrol", "Electric", "Hybrid"] },
  { name: "usage", label: "Mileage / Usage", type: "number", placeholder: "e.g. 4500" },
  { name: "usageUnit", label: "Usage Unit", type: "select", options: ["Hours", "KM", "Miles"] },
  { name: "serialNumber", label: "Serial Number / VIN", type: "text", placeholder: "Enter VIN/Serial" },
  { name: "inspectionStatus", label: "Inspection Status", type: "select", options: ["Inspected", "Not Inspected"] },
  { name: "attachments", label: "Attachments Included", type: "multiselect", options: ["Bucket", "Breaker", "Grapple", "Auger", "Ripper", "Forks"] },
];

export const RENT_FIELDS: FieldConfig[] = [
  { name: "hourlyRate", label: "Hourly Rate", type: "number", placeholder: "0.00" },
  { name: "dailyRate", label: "Daily Rate", type: "number", placeholder: "0.00" },
  { name: "weeklyRate", label: "Weekly Rate", type: "number", placeholder: "0.00" },
  { name: "monthlyRate", label: "Monthly Rate", type: "number", placeholder: "0.00" },
  { name: "minRentalPeriod", label: "Minimum Rental Period", type: "text", placeholder: "e.g. 3 Days" },
  { name: "securityDeposit", label: "Security Deposit Required", type: "number", placeholder: "0.00" },
  { name: "transportIncluded", label: "Transport / Mob Included?", type: "select", options: ["No", "Yes"] },
  { name: "operatorIncluded", label: "Operator Included?", type: "select", options: ["No", "Yes"] },
  { name: "operatorCost", label: "Operator Daily Cost", type: "number", placeholder: "0.00", dependsOn: { field: "operatorIncluded", value: "Yes" } },
];

export const PART_FIELDS: FieldConfig[] = [
  { name: "partNumber", label: "OEM Part Number", type: "text", placeholder: "e.g. 1U3352" },
  { name: "partType", label: "Part Type", type: "select", options: ["OEM Original", "Aftermarket", "Remanufactured"] },
  { name: "condition", label: "Condition", type: "select", options: ["New", "Used - Excellent", "Used - Good", "Needs Repair"] },
  { name: "compatibleMachines", label: "Compatible Machines", type: "multiselect", options: ["Excavators", "Loaders", "Bulldozers", "Graders", "Trucks", "Generators"] },
  { name: "stockQuantity", label: "Stock Quantity", type: "number", placeholder: "e.g. 5" },
];