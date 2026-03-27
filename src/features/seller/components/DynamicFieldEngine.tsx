// src/features/seller/components/DynamicFieldEngine.tsx

import React, { useMemo } from "react";
import { 
  CATEGORY_FIELDS, 
  UNIVERSAL_MACHINE_FIELDS, 
  RENT_FIELDS, 
  PART_FIELDS, 
  ListingType, 
  FieldConfig 
} from "@/config/listingSchemas";

interface DynamicFieldEngineProps {
  listingType: ListingType;
  subCategory: string;
  formData: Record<string, any>;
  setFormData: (data: any) => void;
}

interface FieldRendererProps {
  field: FieldConfig;
  value: any;
  onChange: (name: string, value: any) => void;
  formData: Record<string, any>;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, formData }) => {
  // Conditional rendering logic
  if (field.dependsOn && formData[field.dependsOn.field] !== field.dependsOn.value) {
    return null;
  }

  const commonClasses = "w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors";

  switch (field.type) {
    case "text":
    case "number":
      return (
        <input
          id={field.name}
          type={field.type}
          placeholder={field.placeholder}
          aria-label={field.label}
          className={commonClasses}
          value={value || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(field.name, e.target.value)}
        />
      );

    case "select":
      return (
        <select
          id={field.name}
          aria-label={field.label}
          className={`${commonClasses} custom-select`}
          value={value || ""}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(field.name, e.target.value)}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case "multiselect":
      return (
        <div className="grid grid-cols-2 gap-2 p-3 border border-slate-700 rounded-lg bg-slate-950/50">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors">
              <input 
                type="checkbox" 
                className="rounded border-slate-600 bg-slate-900 text-yellow-500 focus:ring-yellow-500 w-4 h-4"
                checked={(value || []).includes(opt)}
                onChange={(e) => {
                  const current = value || [];
                  const next = e.target.checked 
                    ? [...current, opt] 
                    : current.filter((v: string) => v !== opt);
                  onChange(field.name, next);
                }} 
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );

    default:
      return null;
  }
};

export const DynamicFieldEngine: React.FC<DynamicFieldEngineProps> = ({
  listingType,
  subCategory,
  formData,
  setFormData,
}) => {
  
  // Dynamically assemble the required fields based on user selection
  const fields = useMemo(() => {
    let base: FieldConfig[] = [];

    if (listingType === "SALE") {
      base = [...UNIVERSAL_MACHINE_FIELDS];
    } else if (listingType === "RENT") {
      // Rent gets both Machine Specs AND Rental parameters
      base = [...UNIVERSAL_MACHINE_FIELDS, ...RENT_FIELDS];
    } else if (listingType === "PART") {
      base = [...PART_FIELDS];
    }

    // Append specific sub-category fields if they exist
    const categoryFields = CATEGORY_FIELDS[subCategory] || [];

    return [...base, ...categoryFields];
  }, [listingType, subCategory]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
      {fields.map((field) => {
        // Double check dependency before wrapping in div to avoid empty gaps in grid
        if (field.dependsOn && formData[field.dependsOn.field] !== field.dependsOn.value) return null;
        
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="text-xs text-slate-400 font-bold block mb-1.5 uppercase tracking-wider">
              {field.label}
            </label>
            <FieldRenderer
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
              formData={formData}
            />
          </div>
        );
      })}
    </div>
  );
};