import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, 
  LogOut, PlusCircle, TrendingUp, DollarSign, Users,
  Wallet, AlertCircle, ArrowRight, RefreshCw, X, BadgeCheck, 
  Truck, Clock, MapPin, Camera, FileText, UploadCloud, 
  List, Check, Video, CheckCircle
} from 'lucide-react';
import { PageView } from '@/types';
import { CATEGORY_STRUCTURE } from '@/config/constants'; 
import { CostChart } from '@/features/fleet/Widgets';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- MODIFIED SELL ITEM MODAL (Accepts initialStage) ---
const SellItemModal = ({ onClose, initialStage = 'WELCOME' }: { onClose: () => void, initialStage?: 'WELCOME' | 'GATE' | 'KYC_REGISTER' | 'WIZARD' }) => {
    // Stages: 'WELCOME' -> 'GATE' -> 'KYC_REGISTER' -> 'WIZARD'
    // We initialize state with the passed prop (defaulting to WELCOME if not provided)
    const [stage, setStage] = useState<'WELCOME' | 'GATE' | 'KYC_REGISTER' | 'WIZARD'>(initialStage);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
   
    // File Input References
    const docPrimaryRef = useRef<HTMLInputElement>(null);
    const docSecondaryRef = useRef<HTMLInputElement>(null);
    const docProofRef = useRef<HTMLInputElement>(null);
    const mediaVideoRef = useRef<HTMLInputElement>(null);
    const mediaDocRef = useRef<HTMLInputElement>(null);
   
    // 1. CONSTANTS
    const CURRENCIES = [
        "KES", "USD", "EUR", "GBP", "AED", "CNY", "INR", "ZAR", "JPY", "AUD", "CAD", "CHF", "HKD", "SGD", "SEK", "DKK", "PLN", "NOK", "THB", "IDR", "TRY", "MXN", "BRL", "RUB", "SAR", "QAR", "EGP", "NGN", "GHS", "ETB", "TZS", "UGX", "RWF", "ZMW", "MZN", "AOA", "MAD", "DZD", "TND"
    ].sort();

    const YEARS = Array.from({length: 37}, (_, i) => (2026 - i).toString()); // 1990 - 2026
    const USAGE_UNITS = ["Hours", "Km", "Miles"];
    const RENT_PERIODS = ["Hour", "Day", "Week", "Month"];
    const CONDITIONS = ["New", "Used - Like New", "Used - Good", "Refurbished", "For Parts"];
   
    // Seller State
    const [sellerIdentity, setSellerIdentity] = useState({
        phone: '', name: '', status: '', id: '', location: '', email: '',
        businessType: 'Company', regNumber: '',
        doc_primary: '', doc_secondary: '', doc_proof: '',
        doc_primary_name: '', doc_secondary_name: '', doc_proof_name: ''
    });
   
    // Expanded Listing Data
    const [listingType, setListingType] = useState<'SALE' | 'RENT' | 'PART'>('SALE');
    const [formData, setFormData] = useState({
        // 1. Primary Details
        listingTitle: '',
        category: 'Heavy Plant and Equipment', subCategory: '',
        brand: '', model: '', stockId: '',
        yom: '', condition: 'Used',
        // 2. Pricing
        price: '', currency: 'KES', priceOnRequest: false,
        rentDry: '', rentWet: '', rentCurrency: 'KES', rentPeriod: 'Day',
        additionalCostTerms: '',
        // 3. Technical Specs
        engineBrand: '', enginePower: '', fuelType: 'Diesel', emissionStandard: '',
        transmissionType: '', maxSpeed: '',
        dimLength: '', dimWidth: '', dimHeight: '', netWeight: '',
        trackWidth: '', tireSize: '', axles: '', residualTread: '', // %
        auxHydraulics: 'No', hammerProtection: 'No',
        performanceSpecs: '', // Dig depth, lift capacity etc.
        usage: '', usageUnit: 'Hours', runningHours: '', // For specialized tracking
        // Parts Specific
        partType: 'Original', partNumber: '', oemNumber: '',
        partWeight: '', applicableModels: '',
        // 4. Location
        country: '', region: '', city: '', address: '',
        pickupLocation: '', availabilityDate: '',
        // 5. Media & Docs
        images: [] as string[],
        videos: [] as string[],
        complianceDocs: [] as string[], // Base64 or links
        // 6. Additional Info
        warranty: 'No', warrantyDetails: '',
        originalPaint: 'Yes',
        sellerTerms: '',
        shippingInfo: '',
        description: ''
    });

    // @ts-ignore
    const categories = Object.keys(CATEGORY_STRUCTURE);
    // @ts-ignore
    const subCategories = formData.category
        ? (listingType === 'PART' ? CATEGORY_STRUCTURE[formData.category].parts : CATEGORY_STRUCTURE[formData.category].equipment)
        : [];

    // --- HELPER: FILE TO BASE64 ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: any, isArray = false, arrayField = 'images') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    if (isArray) {
                        // @ts-ignore
                        setFormData(prev => ({...prev, [arrayField]: [...prev[arrayField], reader.result as string]}));
                    } else {
                        // @ts-ignore
                        setSellerIdentity(prev => ({ ...prev, [`${field}_name`]: file.name, [field]: reader.result as string }));
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- VALIDATION ---
    const isStepValid = () => {
        if (step === 2) return formData.listingTitle && formData.category && formData.subCategory && formData.brand;
        if (step === 3) return true; 
        if (step === 4) return formData.images.length > 0; // Require at least one photo
        return true;
    };

    // --- ACTIONS ---
    const handleSubmitListing = async () => {
        setLoading(true);
        const finalPrice = listingType === 'SALE' || listingType === 'PART' ? parseFloat(formData.price) : parseFloat(formData.rentDry) || 0;
        const payload = {
            listingType,
            title: formData.listingTitle,
            sellerName: sellerIdentity.name || "Logged In Seller", // Fallback for dashboard mode
            phone: sellerIdentity.phone, 
            location: formData.city || sellerIdentity.location,
            category: formData.category, subCategory: formData.subCategory, brand: formData.brand, model: formData.model,
            price: finalPrice, currency: listingType === 'RENT' ? formData.rentCurrency : formData.currency,
            specs: { ...formData }
        };
        try {
            const res = await fetch(`${API_URL}/api/marketplace/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) setStep(5);
        } catch { alert("Error"); } finally { setLoading(false); }
    };

    // 4. THE WIZARD (GLOBAL PROFESSIONAL STANDARD)
    if (stage === 'WIZARD') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <style>{`
                    input[type=number]::-webkit-inner-spin-button,
                    input[type=number]::-webkit-outer-spin-button {
                        -webkit-appearance: none; margin: 0;
                    }
                    input[type=number] { -moz-appearance: textfield; }
                    .custom-select { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 0.7rem top 50%; background-size: 0.65rem auto; }
                `}</style>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                        <div className="flex items-center gap-2"><BadgeCheck size={18} className="text-green-500"/><span className="text-white font-bold">New Listing</span></div>
                        <button onClick={onClose}><X className="text-slate-500 hover:text-white"/></button>
                    </div>

                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                        {/* STEP 1: SERVICE TYPE */}
                        {step === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4">
                                <button onClick={() => { setListingType('SALE'); setStep(2); }} className="p-8 border border-slate-700 rounded-2xl hover:border-yellow-500 hover:bg-slate-800 transition-all text-center group flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full mb-6 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform shadow-lg"><Truck size={32}/></div>
                                    <h3 className="font-bold text-xl text-white mb-2">Sell Machine</h3>
                                    <p className="text-slate-400 text-sm">Excavators, Loaders, Trucks</p>
                                </button>
                                <button onClick={() => { setListingType('RENT'); setStep(2); }} className="p-8 border border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-slate-800 transition-all text-center group flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full mb-6 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-lg"><Clock size={32}/></div>
                                    <h3 className="font-bold text-xl text-white mb-2">Rent Out</h3>
                                    <p className="text-slate-400 text-sm">Lease your fleet</p>
                                </button>
                                <button onClick={() => { setListingType('PART'); setStep(2); }} className="p-8 border border-slate-700 rounded-2xl hover:border-green-500 hover:bg-slate-800 transition-all text-center group flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full mb-6 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform shadow-lg"><Settings size={32}/></div>
                                    <h3 className="font-bold text-xl text-white mb-2">Sell Part</h3>
                                    <p className="text-slate-400 text-sm">Spares & Attachments</p>
                                </button>
                            </div>
                        )}

                        {/* STEP 2: PRIMARY DETAILS & LOCATION */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4">
                                <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2 mb-4">
                                    {listingType === 'PART' ? 'Part Details & Location' : 'Primary Details & Location'}
                                </h3>
                                {/* Section 1: Core Identifiers */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 font-bold block mb-1">Listing Title *</label>
                                        <input
                                            className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white font-bold text-lg focus:border-yellow-500"
                                            placeholder={listingType === 'PART' ? "e.g. Caterpillar 320D Hydraulic Pump" : "e.g. Komatsu PC200-8 Excavator"}
                                            value={formData.listingTitle}
                                            onChange={e => setFormData({...formData, listingTitle: e.target.value})}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold block mb-1">Category</label>
                                            <select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                {categories.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold block mb-1">{listingType === 'PART' ? 'Component Type' : 'Machine Type'}</label>
                                            <select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                                                <option value="">Select...</option>
                                                {subCategories.map((sc: string) => <option key={sc} value={sc}>{sc}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold block mb-1">{listingType === 'PART' ? 'Manufacturer' : 'Brand'}</label>
                                            <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. Caterpillar" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                                        </div>
                                        {listingType === 'PART' ? (
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Part Number (OEM)</label>
                                                <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white font-mono" placeholder="e.g. 1U3352" value={formData.partNumber} onChange={e => setFormData({...formData, partNumber: e.target.value})} />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Model</label>
                                                <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. 320D GC" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Year & Condition */}
                                    {listingType !== 'PART' && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Year of Manufacture</label>
                                                <select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.yom} onChange={e => setFormData({...formData, yom: e.target.value})}>
                                                    <option value="">Select Year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Condition</label>
                                                <select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                                                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    {listingType === 'PART' && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Compatible Machine Models</label>
                                                <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. CAT 320D, 325D" value={formData.applicableModels} onChange={e => setFormData({...formData, applicableModels: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Part Condition</label>
                                                <select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                                                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Section 2: Location */}
                                <div className="pt-4 border-t border-slate-800">
                                    <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center"><MapPin size={16} className="mr-2"/> Location</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs text-slate-500 block mb-1">Country</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Kenya" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">Region / State</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Nairobi County" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">City / Town</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Nairobi" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">{listingType === 'RENT' ? 'Pickup Location' : 'Specific Address'}</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Industrial Area, Road A" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                                    </div>
                                    {listingType === 'RENT' && (
                                        <div className="mt-4"><label className="text-xs text-slate-500 block mb-1">Availability Start Date</label><input type="date" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.availabilityDate} onChange={e => setFormData({...formData, availabilityDate: e.target.value})} /></div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: TECHNICAL SPECS & PRICING */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4">
                                {/* --- PRICING SECTION --- */}
                                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                    <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center"><DollarSign size={16} className="mr-2"/> Pricing & Terms</h4>
                                    
                                    {listingType === 'SALE' || listingType === 'PART' ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-4 items-end">
                                                <div className="w-1/3">
                                                    <label className="text-xs text-slate-500 block mb-1">Currency</label>
                                                    <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-bold custom-select" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Selling Price</label>
                                                    <input type="number" disabled={formData.priceOnRequest} className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-bold text-lg disabled:opacity-50" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <input type="checkbox" id="por" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-yellow-500 focus:ring-yellow-500" checked={formData.priceOnRequest} onChange={e => setFormData({...formData, priceOnRequest: e.target.checked})} />
                                                <label htmlFor="por" className="ml-2 text-sm text-slate-300">Price on Request (Hide Price)</label>
                                            </div>
                                        </div>
                                    ) : (
                                        /* RENT PRICING */
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-xs text-slate-400 block mb-1">Dry Rate (Machine Only)</label>
                                                    <div className="flex gap-2">
                                                        <select className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" value={formData.rentCurrency} onChange={e => setFormData({...formData, rentCurrency: e.target.value})}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</select>
                                                        <input type="number" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white" placeholder="Rate" value={formData.rentDry} onChange={e => setFormData({...formData, rentDry: e.target.value})} />
                                                        <select className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" value={formData.rentPeriod} onChange={e => setFormData({...formData, rentPeriod: e.target.value})}>{RENT_PERIODS.map(p => <option key={p}>/{p}</option>)}</select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400 block mb-1">Wet Rate (With Operator/Fuel)</label>
                                                    <div className="flex gap-2">
                                                        <select className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" value={formData.rentCurrency} onChange={e => setFormData({...formData, rentCurrency: e.target.value})}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</select>
                                                        <input type="number" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white" placeholder="Rate" value={formData.rentWet} onChange={e => setFormData({...formData, rentWet: e.target.value})} />
                                                        <select className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" value={formData.rentPeriod} onChange={e => setFormData({...formData, rentPeriod: e.target.value})}>{RENT_PERIODS.map(p => <option key={p}>/{p}</option>)}</select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Additional Cost Terms</label>
                                                <input className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm" placeholder="e.g. Mobilization fee, min hours per day..." value={formData.additionalCostTerms} onChange={e => setFormData({...formData, additionalCostTerms: e.target.value})} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* --- TECHNICAL SPECS --- */}
                                <div className="space-y-4">
                                    <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-wider border-b border-yellow-500/30 pb-2">Technical Specifications</h4>
                                    
                                    {listingType === 'PART' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-xs text-slate-500 block mb-1">Weight (kg)</label><input type="number" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.partWeight} onChange={e => setFormData({...formData, partWeight: e.target.value})} /></div>
                                            <div><label className="text-xs text-slate-500 block mb-1">Dimensions (L x W x H)</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. 50x30x20 cm" value={formData.dimLength} onChange={e => setFormData({...formData, dimLength: e.target.value})} /></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Engine & Power */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div><label className="text-xs text-slate-500 block mb-1">Engine Brand</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Cummins" value={formData.engineBrand} onChange={e => setFormData({...formData,engineBrand: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Power</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="kW / HP" value={formData.enginePower} onChange={e => setFormData({...formData, enginePower: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Fuel Type</label><select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}><option>Diesel</option><option>Petrol</option><option>Electric</option></select></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Emission</label><select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.emissionStandard} onChange={e => setFormData({...formData, emissionStandard: e.target.value})}><option value="">Standard</option><option>Euro 3</option><option>Euro 4</option><option>Euro 5</option><option>Tier 4F</option></select></div>
                                            </div>

                                            {/* Usage & Dimensions */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                                <div className="col-span-2 flex gap-2">
                                                    <div className="flex-1"><label className="text-xs text-slate-500 block mb-1">Usage / Mileage</label><input type="number" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.usage} onChange={e => setFormData({...formData, usage: e.target.value})} /></div>
                                                    <div className="w-24"><label className="text-xs text-slate-500 block mb-1">Unit</label><select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.usageUnit} onChange={e => setFormData({...formData, usageUnit: e.target.value})}>{USAGE_UNITS.map(u => <option key={u}>{u}</option>)}</select></div>
                                                </div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Net Weight (kg)</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.netWeight} onChange={e => setFormData({...formData, netWeight: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Axles / Tracks</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Config" value={formData.axles} onChange={e => setFormData({...formData, axles: e.target.value})} /></div>
                                            </div>

                                            {/* Performance */}
                                            <div className="mt-4"><label className="text-xs text-slate-500 block mb-1">Performance Specs</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. Dig Depth: 6m, Lift: 4T, Bucket Cap: 1.2m3" value={formData.performanceSpecs} onChange={e => setFormData({...formData, performanceSpecs: e.target.value})} /></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 4: MEDIA, DOCS & EXTRAS */}
                        {step === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4">
                                {/* Media Section */}
                                <div>
                                    <h4 className="text-white font-bold mb-4 flex items-center"><Camera className="mr-2 text-yellow-500"/> Media Gallery</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Photos */}
                                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:bg-slate-900 transition-colors">
                                            <input type="file" multiple id="listingImages" hidden onChange={(e) => handleFileSelect(e, null, true, 'images')} accept="image/*" />
                                            <label htmlFor="listingImages" className="cursor-pointer block">
                                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2"><Camera size={24} className="text-slate-400"/></div>
                                                <span className="text-white font-bold text-sm block">Upload Photos *</span>
                                                <span className="text-xs text-slate-500">Min 1 required. Max 10.</span>
                                            </label>
                                            {formData.images.length > 0 && <div className="mt-4 grid grid-cols-4 gap-2">{formData.images.slice(0,4).map((src, i) => <div key={i} className="h-12 bg-cover rounded border border-slate-700" style={{backgroundImage: `url(${src})`}}></div>)}</div>}
                                        </div>
                                        {/* Videos */}
                                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:bg-slate-900 transition-colors">
                                            <input type="file" ref={mediaVideoRef} hidden onChange={(e) => handleFileSelect(e, null, true, 'videos')} accept="video/*" />
                                            <button onClick={() => mediaVideoRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2"><Video size={24} className="text-slate-400"/></div>
                                                <span className="text-white font-bold text-sm block">Add Video (Optional)</span>
                                                <span className="text-xs text-slate-500">Walkthroughs increase trust.</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div>
                                    <h4 className="text-white font-bold mb-4 flex items-center"><FileText className="mr-2 text-blue-500"/> Documentation</h4>
                                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-white">Compliance & Manuals</div>
                                            <div className="text-xs text-slate-500">Upload service history, logbooks, or specs (PDF).</div>
                                        </div>
                                        <input type="file" ref={mediaDocRef} hidden accept=".pdf" onChange={(e) => handleFileSelect(e, null, true, 'complianceDocs')} />
                                        <button onClick={() => mediaDocRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center"><UploadCloud size={14} className="mr-2"/> Upload PDF</button>
                                    </div>
                                    {formData.complianceDocs.length > 0 && <div className="mt-2 text-xs text-green-500 flex items-center"><Check size={12} className="mr-1"/> {formData.complianceDocs.length} Document(s) Attached</div>}
                                </div>

                                {/* Additional Info */}
                                <div>
                                    <h4 className="text-white font-bold mb-4 flex items-center"><List className="mr-2 text-green-500"/> Additional Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        {listingType === 'PART' ? (
                                            <div><label className="text-xs text-slate-500 block mb-1">Shipping / Packaging Info</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.shippingInfo} onChange={e => setFormData({...formData, shippingInfo: e.target.value})} /></div>
                                        ) : (
                                            <>
                                                <div><label className="text-xs text-slate-500 block mb-1">Warranty Details</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. 6 Months Dealer" value={formData.warrantyDetails} onChange={e => setFormData({...formData, warrantyDetails: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Original Paint?</label><select className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.originalPaint} onChange={e => setFormData({...formData, originalPaint: e.target.value})}><option>Yes</option><option>No</option></select></div>
                                            </>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                         <label className="text-xs text-slate-500 block mb-1">Seller Terms / Remarks</label>
                                         <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. Sold as is, Buyer arranges transport" value={formData.sellerTerms} onChange={e => setFormData({...formData, sellerTerms: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Detailed Description</label>
                                        <textarea className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white h-32" placeholder="Mention specific condition, recent repairs, or included attachments..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: SUCCESS */}
                        {step === 5 && (
                            <div className="text-center py-12 animate-in zoom-in-95">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"><Check className="text-white" size={48}/></div>
                                <h2 className="text-3xl font-bold text-white mb-2">Listing Published!</h2>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">{sellerIdentity.status === 'VERIFIED' ? "Your verified listing is now LIVE on the marketplace." : "Your listing has been submitted for engineering review."}</p>
                                <button onClick={onClose} className="bg-slate-800 text-white font-bold py-4 px-12 rounded-xl hover:bg-slate-700 border border-slate-700">Return to Dashboard</button>
                            </div>
                        )}
                    </div>

                    {/* FOOTER NAV */}
                    {step < 5 && (
                        <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-950 rounded-b-2xl">
                            {step > 1 ? <button onClick={() => setStep(step-1)} className="text-slate-400 font-bold px-6 hover:text-white transition-colors">Back</button> : <div></div>}
                            {step < 4 ? (
                                <button onClick={() => setStep(step+1)} disabled={!isStepValid()} className="bg-white text-slate-900 font-bold py-3 px-8 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next Step</button>
                            ) : (
                                <button onClick={handleSubmitListing} disabled={loading || !isStepValid()} className="bg-yellow-500 text-slate-900 font-bold py-3 px-8 rounded hover:bg-yellow-400 shadow-lg disabled:opacity-50 transition-colors flex items-center">{loading ? <RefreshCw className="animate-spin mr-2"/> : <CheckCircle className="mr-2"/>} Publish Listing</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    // Fallback for stages not explicitly handled (like WELCOME/GATE/KYC if passed but code not included)
    // In this context, we mainly expect 'WIZARD', but let's be safe.
    return null; 
};


interface DashboardData {
  wallet: { balance_available: number; balance_pending: number; currency: string };
  inventory: { total_listings: number; active_listings: number };
  listings: any[];
  performance: { rating: number };
}

export const SellerDashboard = ({ 
  token, 
  onLogout, 
  setPage 
}: { 
  token: string; 
  onLogout: () => void; 
  setPage: (p: PageView) => void;
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // STATE TO CONTROL THE MODAL VISIBILITY
  const [showListingModal, setShowListingModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/seller/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <div className="p-20 text-center text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white">Seller Command Center</h1>
            <p className="text-slate-400 text-sm">Manage your fleet, wallet, and orders.</p>
          </div>
          <div className="flex gap-4">
            {/* UPDATED: Button now opens the local SellItemModal */}
            <button 
              onClick={() => setShowListingModal(true)} 
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded font-bold flex items-center shadow-lg"
            >
              <PlusCircle size={18} className="mr-2"/> New Listing
            </button>
            <button onClick={onLogout} className="border border-slate-700 text-slate-400 px-4 py-2 rounded hover:text-white hover:bg-slate-800">
              Log Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
     
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 bg-green-500/10 rounded-bl-2xl">
              <Wallet className="text-green-500" size={24} />
            </div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Available for Payout</div>
            <div className="text-3xl font-black text-white mb-1">
              {data?.wallet?.currency} {data?.wallet?.balance_available?.toLocaleString()}
            </div>
            <button className="text-xs font-bold text-green-500 flex items-center mt-2 hover:underline">
              Request Withdrawal <ArrowRight size={12} className="ml-1"/>
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-yellow-500/10 rounded-bl-2xl">
              <DollarSign className="text-yellow-500" size={24} />
            </div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pending (Escrow)</div>
            <div className="text-3xl font-black text-white mb-1">
              {data?.wallet?.currency} {data?.wallet?.balance_pending?.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-2">Locked until buyer confirms delivery.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-blue-500/10 rounded-bl-2xl">
              <Package className="text-blue-500" size={24} />
            </div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Inventory</div>
            <div className="text-3xl font-black text-white mb-1">
              {data?.inventory?.active_listings} <span className="text-lg text-slate-500 font-normal">/ {data?.inventory?.total_listings} Total</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center">
              <TrendingUp size={12} className="mr-1 text-green-500"/> Performance Rating: {data?.performance?.rating}/5.0
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center"><RefreshCw size={18} className="mr-2 text-slate-500"/> Recent Uploads</h3>
            <button className="text-sm text-yellow-500 font-bold hover:underline">View All Inventory</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-400">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950">
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Date Added</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.listings?.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center">No listings yet. Start selling!</td></tr>
                ) : (
                  data?.listings?.map((item: any) => (
                    <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-bold text-white">{item.brand} {item.model}</td>
                      <td className="px-6 py-4">{item.currency} {item.price.toLocaleString()}</td>
                      <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-400 hover:text-white font-bold">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL TRIGGERED FROM DASHBOARD */}
        {showListingModal && (
            <SellItemModal 
                onClose={() => setShowListingModal(false)} 
                initialStage="WIZARD" // This forces it to skip login/KYC and go straight to listing
            />
        )}

      </div>
    </div>
  );
};