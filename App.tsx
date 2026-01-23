import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Footer } from './components/Layout';
import { PageView, UserRole, OperatorLog, EquipmentItem, SparePart, MaintenanceTask, Alert, ProfessionalProfile, ServiceDetail, MarketItem, SellerProfile } from './types';
import { EQUIPMENT_DATA, SERVICES_CONTENT, SPARE_PARTS, PROFESSIONALS, MARKETPLACE_ITEMS, CATEGORY_STRUCTURE } from './constants';
import { CostChart, FleetStatusChart, UptimeChart } from './components/Widgets';
import { 
  CheckCircle, ChevronRight, Truck, Wrench, ShieldCheck, MapPin, 
  Search, Filter, Lock, AlertTriangle, User, FileText, Droplet, 
  Phone, MessageSquare, Briefcase, Star, ShoppingCart, Info, X, Activity,
  Calendar, Clock, DollarSign, Tag, Check, CreditCard, LogOut, BarChart3, Settings, Users,
  ClipboardCheck, Navigation, Flame, Key, Bell, FileBarChart, Siren, PenTool, RefreshCw, BadgeCheck, HardHat, FileBadge, ArrowRight, Trash2,
  FileSpreadsheet, Download, ChevronDown, List, Grid, UserCheck, Shield, Thermometer, PlusCircle, Heart, ChevronLeft, UploadCloud, Camera,
  Globe, Building2, FileCheck,
  Video
} from 'lucide-react';


// --- MOCK DATA ---
const INITIAL_LOGS: OperatorLog[] = [
    {
        id: 'LOG-1002', machineId: 'e1', operatorName: 'John Kamau', date: '2023-10-25',
        startTime: '08:00', endTime: '16:30', startOdometer: 4500, endOdometer: 4508,
        fuelAddedLiters: 0, location: 'Nairobi Expressway Site',
        checklist: { tires: true, oil: true, hydraulics: true, brakes: true },
        notes: 'Routine operation. Hydraulic fluid top-up required soon.'
    },
    {
        id: 'LOG-1001', machineId: 'log1', operatorName: 'Samuel Ochieng', date: '2023-10-24',
        startTime: '07:30', endTime: '18:00', startOdometer: 12400, endOdometer: 12650,
        fuelAddedLiters: 150, location: 'Mombasa Road Transport',
        checklist: { tires: true, oil: true, hydraulics: true, brakes: false },
        notes: 'Brake pads worn out. Reported to maintenance.'
    }
];

// --- COMPLETE SELLER PORTAL (Full KYC + MachineryLine Specs) ---
const SellItemModal = ({ onClose }: { onClose: () => void }) => {
    // Stages: 'WELCOME' -> 'GATE' -> 'KYC_REGISTER' -> 'WIZARD'
    const [stage, setStage] = useState<'WELCOME' | 'GATE' | 'KYC_REGISTER' | 'WIZARD'>('WELCOME');
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
        if (step === 3) return true; // Add specific validation if needed
        if (step === 4) return formData.images.length > 0; // Require at least one photo
        return true;
    };

    // --- ACTIONS ---
    const checkSeller = async () => {
        if(!sellerIdentity.phone) return alert("Enter phone number");
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/sellers/check', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ phone: sellerIdentity.phone })
            });
            const data = await res.json();
            if (data.exists) {
                setSellerIdentity(prev => ({ ...prev, name: data.name, status: data.status, id: data.sellerId, location: data.location }));
                if (data.status === 'VERIFIED') setStage('WIZARD');
                else { alert("Verification pending. You can draft listings."); setStage('WIZARD'); }
            } else { setStage('KYC_REGISTER'); }
        } catch { alert("Connection Error"); } finally { setLoading(false); }
    };

    const registerSeller = async () => {
        if(!sellerIdentity.regNumber || !sellerIdentity.doc_primary) return alert("Missing documents");
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/sellers/register', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ ...sellerIdentity })
            });
            if(res.ok) { alert("Submitted! Verification pending."); onClose(); }
        } catch { alert("Error"); } finally { setLoading(false); }
    };

    const handleSubmitListing = async () => {
        setLoading(true);
        const finalPrice = listingType === 'SALE' || listingType === 'PART' ? parseFloat(formData.price) : parseFloat(formData.rentDry) || 0;
        const payload = {
            listingType,
            title: formData.listingTitle,
            sellerName: sellerIdentity.name, phone: sellerIdentity.phone, location: formData.city || sellerIdentity.location,
            category: formData.category, subCategory: formData.subCategory, brand: formData.brand, model: formData.model,
            price: finalPrice, currency: listingType === 'RENT' ? formData.rentCurrency : formData.currency, 
            specs: { ...formData }
        };
        try {
            const res = await fetch('http://localhost:8000/api/marketplace/submit', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            if (res.ok) setStep(5);
        } catch { alert("Error"); } finally { setLoading(false); }
    };

    // ================= VIEWS =================

    // 1. WELCOME SCREEN
    if (stage === 'WELCOME') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <style>{`.glow-card:hover { box-shadow: 0 0 40px rgba(234, 179, 8, 0.15); border-color: rgba(234, 179, 8, 0.5); }`}</style>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
                    <div className="w-full md:w-5/12 bg-slate-950 p-8 border-r border-slate-800 relative transition-all duration-500 glow-card group">
                        <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-yellow-500/10 transition-all duration-700"></div>
                        <div className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-6">Seller Central</div>
                        <h2 className="text-2xl font-bold text-white mb-8 group-hover:text-yellow-500 transition-colors">How to Sell on DAGIV</h2>
                        <div className="space-y-8 relative z-10">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm group-hover:border-yellow-500 transition-colors">1</div><div className="w-0.5 h-full bg-slate-800 my-2"></div></div>
                                <div><h4 className="text-white font-bold">Verification</h4><p className="text-slate-400 text-sm mt-1">Upload ID/Business Permit once.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm group-hover:border-yellow-500 transition-colors">2</div><div className="w-0.5 h-full bg-slate-800 my-2"></div></div>
                                <div><h4 className="text-white font-bold">List Inventory</h4><p className="text-slate-400 text-sm mt-1">Add detailed specs & photos.</p></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm"><Check size={16}/></div></div>
                                <div><h4 className="text-white font-bold">Instant Publish</h4><p className="text-slate-400 text-sm mt-1">Verified ads go live <strong>instantly</strong>.</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-7/12 p-12 flex flex-col justify-center bg-slate-900 relative">
                         <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
                         <div className="max-w-sm mx-auto w-full">
                             <h3 className="text-3xl font-bold text-white mb-2">Start Selling</h3>
                             <p className="text-slate-400 mb-8">Access thousands of contractors and engineers.</p>
                             <div className="space-y-4">
                                 <button onClick={() => setStage('GATE')} className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded-lg hover:bg-yellow-400 flex justify-between items-center px-6 group transition-all shadow-lg">
                                    <span>I have a Verified Account</span><ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                                 </button>
                                 <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">First time here?</span></div></div>
                                 <button onClick={() => setStage('GATE')} className="w-full bg-slate-800 text-white font-bold py-4 rounded-lg hover:bg-slate-700 border border-slate-700 flex justify-center items-center">Create Seller Profile</button>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. GATE (Check Phone)
    if (stage === 'GATE') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl relative">
                    <button onClick={() => setStage('WELCOME')} className="absolute top-4 left-4 text-slate-500"><ChevronLeft size={20}/></button>
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500"><X size={20}/></button>
                    <h2 className="text-2xl font-bold text-white mb-2">Seller Identification</h2>
                    <input className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white text-center text-lg font-bold tracking-widest mb-4 mt-6" placeholder="07XX XXX XXX" value={sellerIdentity.phone} onChange={(e) => setSellerIdentity({...sellerIdentity, phone: e.target.value})} />
                    <button onClick={checkSeller} disabled={loading} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-400 flex items-center justify-center">{loading ? <RefreshCw className="animate-spin mr-2"/> : "Continue"}</button>
                </div>
            </div>
        );
    }

    // 3. KYC REGISTER
    if (stage === 'KYC_REGISTER') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                        <div><h2 className="text-xl font-bold text-white">Seller Verification</h2><p className="text-xs text-slate-400">Step 1 of 1: Identity Proof</p></div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                        <input type="file" ref={docPrimaryRef} hidden onChange={(e) => handleFileSelect(e, 'doc_primary')} accept="image/*,.pdf" />
                        <input type="file" ref={docSecondaryRef} hidden onChange={(e) => handleFileSelect(e, 'doc_secondary')} accept="image/*,.pdf" />
                        <input type="file" ref={docProofRef} hidden onChange={(e) => handleFileSelect(e, 'doc_proof')} accept="image/*,.pdf" />
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button onClick={() => setSellerIdentity({...sellerIdentity, businessType: 'Company'})} className={`p-4 rounded-xl border-2 text-left transition-all ${sellerIdentity.businessType === 'Company' ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                                <div className="flex items-center gap-2 mb-2"><Building2 className={sellerIdentity.businessType === 'Company' ? 'text-blue-400' : 'text-slate-500'} size={24}/><span className={`font-bold ${sellerIdentity.businessType === 'Company' ? 'text-white' : 'text-slate-400'}`}>Registered Company</span></div>
                                <p className="text-xs text-slate-500">For dealers & contractors.</p>
                            </button>
                            <button onClick={() => setSellerIdentity({...sellerIdentity, businessType: 'Individual'})} className={`p-4 rounded-xl border-2 text-left transition-all ${sellerIdentity.businessType === 'Individual' ? 'bg-yellow-900/20 border-yellow-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                                <div className="flex items-center gap-2 mb-2"><User className={sellerIdentity.businessType === 'Individual' ? 'text-yellow-400' : 'text-slate-500'} size={24}/><span className={`font-bold ${sellerIdentity.businessType === 'Individual' ? 'text-white' : 'text-slate-400'}`}>Individual Seller</span></div>
                                <p className="text-xs text-slate-500">For private owners/brokers.</p>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input className="bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder={sellerIdentity.businessType === 'Company' ? "Company Name" : "Full Name"} onChange={e => setSellerIdentity({...sellerIdentity, name: e.target.value})} />
                                <input className="bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Email Address" onChange={e => setSellerIdentity({...sellerIdentity, email: e.target.value})} />
                            </div>
                            <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Physical Address / Yard Location" onChange={e => setSellerIdentity({...sellerIdentity, location: e.target.value})} />
                            
                            <div className="bg-slate-800/50 p-4 rounded border border-slate-700 mt-6">
                                <h4 className="text-white font-bold text-sm mb-4 flex items-center"><FileCheck size={16} className="mr-2 text-green-500"/> Required Documents</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                        <div><div className="text-white text-sm font-bold">{sellerIdentity.businessType === 'Company' ? 'Cert. of Incorporation' : 'National ID (Front)'}</div><div className="text-xs text-slate-500">{sellerIdentity.doc_primary_name || 'PDF or JPG'}</div></div>
                                        <button onClick={() => docPrimaryRef.current?.click()} className={`text-xs px-3 py-2 rounded flex items-center ${sellerIdentity.doc_primary ? 'bg-green-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                                            {sellerIdentity.doc_primary ? <><Check size={14} className="mr-2"/> Uploaded</> : <><UploadCloud size={14} className="mr-2"/> Upload</>}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                        <div><div className="text-white text-sm font-bold">{sellerIdentity.businessType === 'Company' ? 'KRA PIN Certificate' : 'National ID (Back)'}</div><div className="text-xs text-slate-500">{sellerIdentity.doc_secondary_name || 'Verifiable Document'}</div></div>
                                        <button onClick={() => docSecondaryRef.current?.click()} className={`text-xs px-3 py-2 rounded flex items-center ${sellerIdentity.doc_secondary ? 'bg-green-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                                            {sellerIdentity.doc_secondary ? <><Check size={14} className="mr-2"/> Uploaded</> : <><UploadCloud size={14} className="mr-2"/> Upload</>}
                                        </button>
                                    </div>
                                    <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <div><div className="text-yellow-500 text-sm font-bold">{sellerIdentity.businessType === 'Company' ? 'Business Permit / Yard Photo' : 'Proof of Possession Photo'}</div><div className="text-xs text-slate-400">{sellerIdentity.doc_proof_name || (sellerIdentity.businessType === 'Company' ? 'Business Permit' : 'Selfie with Item')}</div></div>
                                            <button onClick={() => docProofRef.current?.click()} className={`text-xs px-3 py-2 rounded flex items-center shadow-lg ${sellerIdentity.doc_proof ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'} text-white`}>
                                                {sellerIdentity.doc_proof ? <><Check size={14} className="mr-2"/> Uploaded</> : <><Camera size={14} className="mr-2"/> Upload</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{sellerIdentity.businessType === 'Company' ? 'Registration No. / KRA PIN' : 'National ID Number'}</label>
                                <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white font-mono tracking-wide" placeholder={sellerIdentity.businessType === 'Company' ? "P051..." : "12345678"} onChange={e => setSellerIdentity({...sellerIdentity, regNumber: e.target.value})} />
                            </div>
                            <button onClick={registerSeller} disabled={loading} className="w-full bg-green-600 text-white font-bold py-4 rounded hover:bg-green-500 mt-4 shadow-lg flex items-center justify-center">
                                {loading ? <RefreshCw className="animate-spin mr-2"/> : <ShieldCheck className="mr-2"/>} Submit for Verification
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 4. THE WIZARD (GLOBAL PROFESSIONAL STANDARD)
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
                                            <div><label className="text-xs text-slate-500 block mb-1">Engine Brand</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Cummins" value={formData.engineBrand} onChange={e => setFormData({...formData, engineBrand: e.target.value})} /></div>
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
};
// Service Request Modal Component
const ServiceRequestModal = ({ service, onClose }: { service: ServiceDetail, onClose: () => void }) => {
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        details: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');
        
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                serviceType: service.title,
                details: formData.details,
                company: formData.company || "N/A"
            };

            const res = await fetch('http://localhost:8000/api/service-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if(res.ok) setStatus('SUCCESS');
            else {
                alert("Server Error: Could not submit request.");
                setStatus('IDLE');
            }

        } catch (error) {
            console.error(error);
            alert("Failed to connect to server");
            setStatus('IDLE');
        }
    };

    if (status === 'SUCCESS') {
        return (
            <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Request Received</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        We have successfully logged your inquiry regarding <span className="text-yellow-500 font-bold">{service.title}</span>. 
                        <br/><br/>
                        Our engineering team has been notified and will contact you via email shortly.
                    </p>
                    <button onClick={onClose} className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors w-full border border-slate-700 hover:border-slate-600">
                        Close & Return to Services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-start">
                    <div>
                        <div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Service Request
                        </div>
                        <h3 className="text-2xl font-black text-white leading-tight">{service.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full"><X size={20}/></button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-slate-500 text-xs font-bold uppercase">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={16}/>
                                    <input 
                                        required 
                                        className="w-full bg-slate-950 border border-slate-700 p-3 pl-10 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                        placeholder="John Doe" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <label className="block text-slate-500 text-xs font-bold uppercase">Company (Optional)</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-3 top-3.5 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={16}/>
                                    <input 
                                        className="w-full bg-slate-950 border border-slate-700 p-3 pl-10 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                        placeholder="Acme Construction Ltd" 
                                        value={formData.company}
                                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                placeholder="john@example.com" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                         <div className="space-y-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase">Phone Number</label>
                            <input 
                                type="tel" 
                                required 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors placeholder:text-slate-700 font-medium" 
                                placeholder="+254 700 000 000" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase">Project Details / Requirements</label>
                            <textarea 
                                required 
                                className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white focus:border-yellow-500 outline-none transition-colors h-32 resize-none placeholder:text-slate-700 font-medium text-sm leading-relaxed" 
                                placeholder="Please describe your site location, equipment needs, or specific maintenance issues..."
                                value={formData.details}
                                onChange={(e) => setFormData({...formData, details: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={status === 'SENDING'} className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] disabled:opacity-70 disabled:shadow-none">
                                {status === 'SENDING' ? (
                                    <span className="flex items-center"><RefreshCw className="animate-spin mr-3" /> Processing Request...</span>
                                ) : (
                                    <span className="flex items-center">Submit Service Request <ArrowRight size={18} className="ml-2"/></span>
                                )}
                            </button>
                            <p className="text-center text-slate-600 text-xs mt-6">
                                By submitting this form, you request a formal quotation from DAGIV ENGINEERING. <br/>We respect your privacy and will not share your data.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- SERVICES PAGE ---
const ServicesPage = ({ setPage }: { setPage: (p: PageView) => void }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  // SENIOR DEV PATTERN: Smart Ordering Engine
  // -----------------------------------------------------------
  // Current Logic: Force 'High LTV' services (Maintenance) to top.
  // Future Logic: Replace this function with a 'usePersonalizedSort' hook 
  // that queries the backend for the user's most frequented categories.
  const getOrderedServices = () => {
      const PRIORITY_SERVICE_ID = 'srv3'; // ID for Maintenance & Repairs from constants.ts
      
      const primaryService = SERVICES_CONTENT.find(s => s.id === PRIORITY_SERVICE_ID);
      const otherServices = SERVICES_CONTENT.filter(s => s.id !== PRIORITY_SERVICE_ID);
      
      // Safety check: If ID changes or doesn't exist, fallback gracefully
      if (!primaryService) return SERVICES_CONTENT;
      
      return [primaryService, ...otherServices];
  };

  const orderedServices = getOrderedServices();
  // -----------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Our Engineering Services</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">From procurement to maintenance, we handle the entire lifecycle of your heavy machinery.</p>
            </div>
            <div className="space-y-20">
                {orderedServices.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                        <div key={service.id} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                            <div className="flex-1">
                                <img src={service.image} alt={service.title} className="rounded-xl shadow-2xl border border-slate-800" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-yellow-500 border border-slate-700 shadow-inner">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-white">{service.title}</h3>
                                <p className="text-slate-300 text-lg leading-relaxed">{service.fullDesc}</p>
                                
                                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                                    <h4 className="text-yellow-500 font-bold uppercase text-xs mb-4 tracking-wider">Our Process</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {service.process.map((step, i) => (
                                            <div key={i} className="flex items-center text-slate-400 text-sm">
                                                <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-slate-700 text-slate-500">{i+1}</span>
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedService(service)} 
                                    className="px-8 py-3 bg-white text-slate-900 font-bold rounded hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_4px_0_0_rgba(15,23,42,1)]"
                                >
                                    Request Service
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {selectedService && (
            <ServiceRequestModal 
                service={selectedService} 
                onClose={() => setSelectedService(null)} 
            />
        )}
    </div>
  );
};

// --- NEW COMPONENT: Seller CTA (Become a Seller) ---
const SellerCTA = ({ onSellClick }: { onSellClick: () => void }) => (
  <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg p-1 text-slate-900 mb-6">
    <div className="bg-slate-950/20 backdrop-blur-sm p-4 rounded flex justify-between items-center text-white">
      <div>
        <h3 className="font-bold text-lg">Have machinery lying idle?</h3>
        <p className="text-sm opacity-90">Turn your equipment into cash. Sell or Lease on DAGIV.</p>
      </div>
      <button 
        onClick={onSellClick} 
        className="bg-white text-slate-900 px-6 py-2 rounded font-bold hover:bg-slate-100 transition-colors shadow-lg whitespace-nowrap"
      >
        Start Selling
      </button>
    </div>
  </div>
);
// --- NEW COMPONENT: Marketplace Item Card (Jumia Style) ---
// FIXED: Explicitly typed as React.FC to allow 'key' prop in loops without TypeScript errors
const MarketplaceCard: React.FC<{ item: MarketItem; onClick: () => void }> = ({ item, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:shadow-xl hover:border-yellow-500/50 transition-all cursor-pointer group flex flex-col h-full relative"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {item.promoted && <span className="bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Ad</span>}
        {item.verifiedByDagiv && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center"><ShieldCheck size={10} className="mr-1"/> Inspected</span>}
      </div>

      <div className="h-48 overflow-hidden relative bg-slate-950">
        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        {item.listingType === 'Rent' && (
           <div className="absolute bottom-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-tl-lg">
             FOR RENT
           </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <div className="text-xs text-slate-500 mb-1 truncate">{item.brand} {item.model}</div>
        <h3 className="text-sm font-bold text-white mb-2 leading-tight line-clamp-2 h-10">{item.title}</h3>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-1">
             <span className="text-xs text-yellow-500 font-bold">{item.currency}</span>
             <span className="text-lg font-bold text-white">{item.price.toLocaleString()}</span>
             {item.listingType === 'Rent' && <span className="text-xs text-slate-400">/{item.priceUnit?.replace('per ', '')}</span>}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
             <div className="flex items-center text-[10px] text-slate-400">
               <MapPin size={10} className="mr-1"/> {item.location}
             </div>
             {item.condition === 'New' ? 
                <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded border border-green-900">New</span> :
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{item.condition}</span>
             }
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT: MarketplaceLayout (Updated for Dynamic Categories) ---
const MarketplaceLayout = ({ mode, setPage, onSellClick, isSpareParts = false }: { mode: 'BUY' | 'RENT', setPage: (p: PageView) => void, onSellClick: () => void, isSpareParts?: boolean }) => {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('All');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  // 1. FILTER LOGIC (Now includes strict Type Filtering)
  const filteredItems = MARKETPLACE_ITEMS.filter(item => {
    // Type Filter: Strictly separate Parts from Equipment
    const typeMatch = isSpareParts ? item.type === 'Part' : item.type === 'Equipment';

    // Mode Filter: Sale vs Rent (Parts are usually 'Sale' by default)
    const modeMatch = mode === 'BUY' ? item.listingType === 'Sale' : item.listingType === 'Rent';
    
    // Category Filter
    const catMatch = selectedMainCat === 'All' || item.category === selectedMainCat;
    const subCatMatch = selectedSubCat === 'All' || item.subCategory === selectedSubCat;
    
    // Search
    const searchMatch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                        item.brand.toLowerCase().includes(search.toLowerCase());

    return typeMatch && modeMatch && catMatch && subCatMatch && searchMatch;
  });

  // 2. DYNAMIC SIDEBAR LOGIC (The "Brain")
  const activeSubCategories = selectedMainCat !== 'All' 
    // @ts-ignore
    ? (isSpareParts 
        ? CATEGORY_STRUCTURE[selectedMainCat as keyof typeof CATEGORY_STRUCTURE]?.parts || []
        : CATEGORY_STRUCTURE[selectedMainCat as keyof typeof CATEGORY_STRUCTURE]?.equipment || [])
    : [];

  // 3. DYNAMIC HEADER TEXT
  const getPageTitle = () => {
      if (isSpareParts) return 'Genuine Spare Parts Market';
      return mode === 'BUY' ? 'Heavy Machinery Marketplace' : 'Plant Hire & Leasing';
  };

  const getSearchPlaceholder = () => {
      if (isSpareParts) return "Search by Part Number, Name (e.g. 1U3352RC)...";
      if (mode === 'RENT') return "Search for cranes, pumps, generators to rent...";
      return "Search for excavators, trucks, dozers...";
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="flex-1 w-full flex relative">
                   <input 
                      type="text" 
                      placeholder={getSearchPlaceholder()}
                      className="w-full bg-slate-950 border-y border-l border-slate-700 rounded-l text-white pl-4 pr-10 py-3 focus:outline-none focus:border-yellow-500"
                      onChange={(e) => setSearch(e.target.value)}
                   />
                   <button className="bg-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-r hover:bg-yellow-400 transition-colors uppercase text-sm tracking-wide">
                      Search
                   </button>
                </div>

                {/* Post Ad Button */}
                <button 
                    onClick={onSellClick}
                    className="hidden md:flex bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded font-bold items-center shadow-lg transition-transform hover:scale-105"
                >
                    <PlusCircle className="mr-2" size={18}/> 
                    {isSpareParts ? 'SELL PART' : mode === 'BUY' ? 'SELL MACHINE' : 'LIST FOR RENT'}
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR FILTERS */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950 font-bold text-white flex items-center">
                    <Filter size={16} className="mr-2 text-yellow-500"/> 
                    {isSpareParts ? 'Part Categories' : 'Machine Categories'}
                </div>
                
                {/* Main Categories */}
                <div className="p-2">
                    <button 
                         onClick={() => { setSelectedMainCat('All'); setSelectedSubCat('All'); }}
                         className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${selectedMainCat === 'All' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                        All Categories
                    </button>
                    {Object.keys(CATEGORY_STRUCTURE).map(cat => (
                        <button 
                            key={cat}
                            onClick={() => { setSelectedMainCat(cat); setSelectedSubCat('All'); }}
                            className={`w-full text-left px-3 py-2 rounded text-sm mb-1 flex justify-between items-center group ${selectedMainCat === cat ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                        >
                            <span className="truncate">{cat}</span>
                            {selectedMainCat === cat && <ChevronRight size={14} className="text-yellow-500"/>}
                        </button>
                    ))}
                </div>

                {/* Sub Categories (Dynamic List) */}
                {selectedMainCat !== 'All' && (
                    <div className="border-t border-slate-800 p-2 bg-slate-950/50 animate-in slide-in-from-left-2">
                        <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1">
                            {isSpareParts ? 'Component Type' : 'Machine Type'}
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                           <button 
                                onClick={() => setSelectedSubCat('All')}
                                className={`w-full text-left px-3 py-1.5 rounded text-xs mb-1 ${selectedSubCat === 'All' ? 'text-yellow-500 font-bold' : 'text-slate-400'}`}
                           >
                               View All
                           </button>
                           {activeSubCategories.map((sub: string) => (
                               <button 
                                   key={sub}
                                   onClick={() => setSelectedSubCat(sub)}
                                   className={`w-full text-left px-3 py-1.5 rounded text-xs mb-1 truncate ${selectedSubCat === sub ? 'text-yellow-500 font-bold bg-yellow-500/10' : 'text-slate-400 hover:text-white'}`}
                                   title={sub}
                               >
                                   {sub}
                               </button>
                           ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                    {selectedSubCat !== 'All' ? selectedSubCat : selectedMainCat !== 'All' ? selectedMainCat : getPageTitle()}
                </h2>
                <div className="text-sm text-slate-400">
                    {filteredItems.length} results found
                </div>
            </div>

            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredItems.map(item => (
                        <MarketplaceCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-12 text-center">
                    <Search className="w-16 h-16 text-slate-700 mx-auto mb-4"/>
                    <h3 className="text-white font-bold text-lg mb-2">No {isSpareParts ? 'parts' : 'machines'} found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search for a different {isSpareParts ? 'part number' : 'model'}.</p>
                </div>
            )}
        </div>
      </div>

      {/* ITEM DETAIL MODAL (Reused) */}
      {selectedItem && (
          <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur flex justify-end">
              <div className="w-full lg:w-[600px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right-10">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                      <div className="flex gap-2">
                        {selectedItem.verifiedByDagiv && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center"><ShieldCheck size={12} className="mr-1"/> VERIFIED BY DAGIV</span>}
                      </div>
                      <button onClick={() => setSelectedItem(null)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={20}/></button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="h-64 bg-black relative">
                          <img src={selectedItem.images[0]} className="w-full h-full object-contain" />
                      </div>

                      <div className="p-6">
                          <div className="text-yellow-500 text-xs font-bold uppercase mb-2">{selectedItem.category} &gt; {selectedItem.subCategory}</div>
                          <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-6 border-b border-slate-800 pb-6">
                              <span className="flex items-center"><MapPin size={14} className="mr-1"/> {selectedItem.location}</span>
                              <span>•</span>
                              <span>{selectedItem.condition}</span>
                          </div>

                          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6 flex justify-between items-center">
                              <div>
                                  <div className="text-xs text-slate-500 uppercase font-bold">Price</div>
                                  <div className="text-2xl font-bold text-white">
                                      {selectedItem.currency} {selectedItem.price.toLocaleString()}
                                      {selectedItem.listingType === 'Rent' && <span className="text-sm font-normal text-slate-400">/{selectedItem.priceUnit?.replace('per ','')}</span>}
                                  </div>
                              </div>
                              {selectedItem.negotiable && <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">Negotiable</span>}
                          </div>

                          <div className="space-y-4">
                              <h3 className="font-bold text-white">Details</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex justify-between border-b border-slate-800 pb-1">
                                      <span className="text-slate-500">Brand</span>
                                      <span className="text-white">{selectedItem.brand}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-800 pb-1">
                                      <span className="text-slate-500">Model</span>
                                      <span className="text-white">{selectedItem.model}</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-800 pb-1">
                                      <span className="text-slate-500">{isSpareParts ? 'Part Type' : 'Year'}</span>
                                      <span className="text-white">{isSpareParts ? 'OEM/Genuine' : selectedItem.yom || 'N/A'}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Sticky Footer */}
                  <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-4">
                       <button className="bg-slate-800 text-white font-bold py-3 rounded hover:bg-slate-700 border border-slate-700 flex items-center justify-center">
                           <Phone size={18} className="mr-2"/> Show Contact
                       </button>
                       <button className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-500 shadow-lg flex items-center justify-center">
                           <ShoppingCart size={18} className="mr-2"/> {selectedItem.listingType === 'Sale' ? 'Make Offer' : 'Book Rental'}
                       </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
// --- HOME PAGE (REFACTORED) ---
const HomePage = ({ setPage, onBookInspection, onSellClick }: { setPage: (p: PageView) => void, onBookInspection: () => void, onSellClick: () => void }) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  return (
  <div className="flex flex-col">
    {/* Hero Section */}
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80" 
          alt="Construction in the World" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-block px-4 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6 backdrop-blur-sm">
          <span className="text-yellow-500 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
             <MapPin size={14} /> world's Trusted Industrial Partner
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
          PREMIUM EQUIPMENT & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            ENGINEERING SOLUTIONS
          </span>
        </h1>
        <p className="text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
          From inspection and purchase to maintenance and fabrication, DAGIV ENGINEERING delivers comprehensive mechanical solutions for your business needs.
        </p>
        
        {/* NEW: QUICK ACTION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {/* BUTTON 1: SELL MACHINERY (Updated) */}
            <button 
                onClick={onSellClick}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <ShoppingCart size={24} />
                </div>
                <span className="text-white font-bold text-sm">Sell Machinery</span>
            </button>

            <button 
                onClick={onBookInspection}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Search size={24} />
                </div>
                <span className="text-white font-bold text-sm">Book Inspection</span>
            </button>

            <button 
                onClick={() => setPage(PageView.MARKETPLACE_RENT)}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Truck size={24} />
                </div>
                <span className="text-white font-bold text-sm">Lease Fleet</span>
            </button>

            <button 
                onClick={() => setPage(PageView.SERVICES)}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-yellow-500 p-6 rounded-xl flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                    <Wrench size={24} />
                </div>
                <span className="text-white font-bold text-sm">Get Maintenance</span>
            </button>
        </div>
      </div>
    </div>

    {/* ABOUT DAGIV SECTION */}
    <div className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">About DAGIV ENGINEERING</h2>
                <div className="h-1 w-20 bg-yellow-500 mx-auto mb-6"></div>
                <p className="text-slate-400 max-w-2xl mx-auto">Built on integrity, powered by expertise. We are setting new standards for mechanical engineering in the world.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                <div className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
                    <p className="text-slate-400 text-sm">To be the undisputed leader in industrial engineering solutions across the world, driving infrastructure growth through reliability.</p>
                </div>
                <div className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <BadgeCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                    <p className="text-slate-400 text-sm">Providing world-class machinery, precision fabrication, and proactive maintenance services that ensure zero downtime for our clients.</p>
                </div>
                <div className="text-center p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <Users size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Our Goals</h3>
                    <p className="text-slate-400 text-sm">Empowering local industries, upskilling World's engineers, and delivering sustainable mechanical solutions.</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center"><ShieldCheck className="text-yellow-500 mr-3" /> Trust & Compliance</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start text-slate-300">
                            <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                            <span><strong>Safety First:</strong> Adherence to DOSHS workplace safety standards and OSHA guidelines for all site operations.</span>
                        </li>
                        <li className="flex items-start text-slate-300">
                            <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                            <span><strong>Certified Excellence:</strong> ISO 9001:2015 compliant processes for maintenance and fabrication.</span>
                        </li>
                        <li className="flex items-start text-slate-300">
                            <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                            <span><strong>Regulatory Compliance:</strong> All fleet equipment fully licensed with NTSA and inspected by KEBS.</span>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <FileBadge className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">NCA Registered</span>
                        <span className="text-xs text-slate-500">Contractor Class 4</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <HardHat className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">EBK Certified</span>
                        <span className="text-xs text-slate-500">Professional Engineers</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <ShieldCheck className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">Insured</span>
                        <span className="text-xs text-slate-500">Comprehensive WIBA</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center border border-slate-800">
                        <Check className="mx-auto text-slate-500 mb-2" size={32}/>
                        <span className="text-slate-300 font-bold text-sm block">KEBS Standard</span>
                        <span className="text-xs text-slate-500">Quality Mark</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Core Services Preview (REFACTORED WITH REQUEST BUTTONS) */}
    <div className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Our Core Pillars</h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES_CONTENT.map((service) => {
                const Icon = service.icon;
                return (
                    <div key={service.id} className="bg-slate-900 p-8 border border-slate-800 hover:border-yellow-500/50 transition-all group flex flex-col">
                        <Icon className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{service.shortDesc}</p>
                        <button 
                            onClick={() => setSelectedService(service)}
                            className="w-full bg-slate-800 hover:bg-white hover:text-slate-900 text-white font-bold py-2 rounded text-sm transition-colors border border-slate-700"
                        >
                            Request Service
                        </button>
                    </div>
                );
            })}
        </div>
      </div>
    </div>

    {/* ERP Teaser */}
    <div className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(#eab308 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-black text-white mb-6">MANAGE YOUR FLEET LIKE A CORPORATION.</h2>
                    <p className="text-lg text-slate-300 mb-8">
                        The <span className="text-yellow-500 font-bold">DAGIV Mechanical ERP</span> gives you full control. Track fuel usage, monitor driver logs, schedule maintenance, and predict costs—all from one premium dashboard.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {['Real-time GPS Tracking', 'Automated Maintenance Alerts', 'Cost & Fuel Analytics', 'Driver Performance Logs'].map((item, i) => (
                            <li key={i} className="flex items-center text-slate-400">
                                <CheckCircle className="text-yellow-500 w-5 h-5 mr-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => setPage(PageView.ERP)}
                        className="px-8 py-4 bg-white text-slate-900 font-bold rounded shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(234,179,8,1)] transition-all"
                    >
                        REQUEST ERP ACCESS
                    </button>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-yellow-500/20 blur-xl rounded-full"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="ERP Dashboard Preview" 
                        className="rounded-lg shadow-2xl border border-slate-700 relative z-10"
                    />
                     {/* Floating UI Elements for effect */}
                     <div className="absolute -bottom-6 -left-6 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl z-20">
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Fuel Efficiency</div>
                        <div className="text-2xl font-bold text-green-500">+12.4%</div>
                     </div>
                </div>
            </div>
        </div>
    </div>

    {/* Modal Overlay */}
    {selectedService && (
        <ServiceRequestModal 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
        />
    )}
  </div>
  );
};

// --- INSPECTION BOOKING PAGE (FIXED VALIDATION) ---
const InspectionBookingPage = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    
    const [bookingData, setBookingData] = useState({
        machineType: 'Excavator',
        location: '',
        contactPerson: '',
        phone: '',
        date: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBookingData({...bookingData, [e.target.name]: e.target.value});
    };

    // Validation Check for Step 1
    const canProceedToStep2 = () => {
        return bookingData.location.length > 2; // Basic check ensuring location is filled
    };

    const canSubmit = () => {
        return bookingData.contactPerson.length > 2 && bookingData.phone.length > 9 && bookingData.date !== '';
    };

    const submitBooking = async () => {
        if (!canSubmit()) {
            alert("Please fill in all contact details and date.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/book-inspection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            
            if (response.ok) {
                setStep(3); 
            } else {
                alert("Failed to book inspection. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error. Is the backend running?");
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-950 py-16 px-4">
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-yellow-500 p-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center"><Search className="mr-3"/> BOOK INSPECTION</h2>
                    <p className="text-slate-900/80 font-medium">Schedule a certified engineer to inspect your machinery.</p>
                </div>
                
                {/* Progress Bar */}
                <div className="flex border-b border-slate-800">
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 1 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>1. Machine</div>
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 2 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>2. Contact</div>
                    <div className={`flex-1 py-3 text-center text-sm font-bold ${step >= 3 ? 'text-yellow-500 bg-slate-800' : 'text-slate-600'}`}>3. Confirm</div>
                </div>
                
                {step === 1 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 1: Machine Details</h3>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Machine Type</label>
                            <select 
                                name="machineType"
                                value={bookingData.machineType}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4"
                            >
                                <option>Excavator</option>
                                <option>Truck</option>
                                <option>Generator</option>
                                <option>Backhoe Loader</option>
                                <option>Grader</option>
                                <option>Other</option>
                            </select>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Location of Machine</label>
                            <input 
                                name="location"
                                value={bookingData.location}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" 
                                placeholder="e.g. Athi River Site" 
                            />
                        </div>
                        <button 
                            onClick={() => {
                                if (canProceedToStep2()) setStep(2);
                                else alert("Please enter the machine location.");
                            }} 
                            className={`w-full font-bold py-3 rounded transition-colors ${canProceedToStep2() ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Step 2: Contact Info</h3>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Contact Person</label>
                            <input 
                                name="contactPerson"
                                value={bookingData.contactPerson}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4" 
                                placeholder="Full Name" 
                            />
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone Number</label>
                            <input 
                                name="phone"
                                value={bookingData.phone}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-4" 
                                placeholder="0700 000 000" 
                            />
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Preferred Date</label>
                            <input 
                                name="date"
                                value={bookingData.date}
                                onChange={handleChange}
                                type="date" 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" 
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded hover:bg-slate-700">Back</button>
                            <button 
                                onClick={submitBooking} 
                                className={`flex-1 font-bold py-3 rounded transition-colors ${canSubmit() ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6 text-white"><Check size={40}/></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Inspection Booked!</h3>
                        <p className="text-slate-400 mb-6">Order #INSP-{Math.floor(Math.random()*1000)}. Status: <span className="text-yellow-500 font-bold">PENDING</span>.<br/>Our team will confirm availability within 2 hours.</p>
                        <button onClick={onComplete} className="bg-slate-800 text-white px-8 py-3 rounded font-bold hover:bg-slate-700">Return Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CONTACT PAGE ---
const ContactPage = () => (
    <div className="min-h-screen bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800">
            <div className="p-10 md:w-1/2 bg-yellow-500 text-slate-900">
                <h2 className="text-3xl font-black mb-6">Get in Touch</h2>
                <p className="font-medium mb-8">Visit our HQ or send us a message regarding equipment sales or leasing.</p>
                <div className="space-y-4">
                    <div className="flex items-center"><MapPin className="mr-3"/> Industrial Area, Nairobi</div>
                    <a href="tel:+254700000000" className="flex items-center hover:underline"><Phone className="mr-3"/> +254 700 000 000</a>
                    <a href="mailto:info@dagiv.co.ke" className="flex items-center hover:underline"><User className="mr-3"/> info@dagiv.co.ke</a>
                </div>
            </div>
            <div className="p-10 md:w-1/2">
                <form className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" />
                    <input type="email" placeholder="Email" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" />
                    <textarea placeholder="Message" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-32"></textarea>
                    <button className="w-full bg-white text-slate-900 font-bold py-3 rounded hover:bg-slate-200">Send Message</button>
                </form>
            </div>
        </div>
    </div>
);

// --- PROFESSIONALS PAGE (UPDATED) ---
const ProfessionalsPage = () => {
    const [filterRole, setFilterRole] = useState('All');
    const [selectedPro, setSelectedPro] = useState<ProfessionalProfile | null>(null);
    
    // Updated Role List including Mechanical Engineer
    const roles = ['All', 'Civil Engineer', 'Structural Engineer', 'Mechanical Engineer', 'Software Engineer', 'Welder', 'Mechanic', 'Operator', 'Driver'];
    
    // Filter logic - strict equality to match the distinct roles in constants.ts
    const filteredPros = filterRole === 'All' ? PROFESSIONALS : PROFESSIONALS.filter(p => p.role === filterRole);

    // Professional Profile Modal
    const ProfessionalModal = () => {
        if(!selectedPro) return null;
        return (
            <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
                <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]">
                    <button onClick={() => setSelectedPro(null)} className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"><X size={20}/></button>
                    
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative border-b border-slate-800">
                        {/* Avatar */}
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                                {selectedPro.image ? <img src={selectedPro.image} className="w-full h-full object-cover"/> : 
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-2xl">{selectedPro.name.charAt(0)}</div>}
                            </div>
                        </div>
                        {selectedPro.verified && (
                            <div className="absolute -bottom-10 left-24 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center border border-slate-900 shadow-sm" title="DAGIV Verified">
                                <BadgeCheck size={12} className="mr-1"/> Verified
                            </div>
                        )}
                    </div>

                    <div className="pt-16 px-8 pb-8 overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white flex items-center">{selectedPro.name}</h2>
                                <p className="text-yellow-500 font-bold uppercase text-sm tracking-wider flex items-center gap-2 mt-1">
                                    {selectedPro.role} <span className="text-slate-600">•</span> {selectedPro.specialization}
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                                    <span className="flex items-center"><MapPin size={14} className="mr-1"/> {selectedPro.location}</span>
                                    <span className="flex items-center"><Briefcase size={14} className="mr-1"/> {selectedPro.yearsExperience} Years Exp.</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                                <div className="text-2xl font-bold text-white flex items-center gap-1">
                                    {selectedPro.rating} <Star className="fill-yellow-500 text-yellow-500" size={20}/>
                                </div>
                                <span className="text-slate-500 text-xs">{selectedPro.reviews?.length || 0} Verified Reviews</span>
                            </div>
                        </div>

                        {/* Bio & Certs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="md:col-span-2">
                                <h3 className="text-white font-bold mb-3 border-b border-slate-800 pb-2">About</h3>
                                <p className="text-slate-300 leading-relaxed text-sm">{selectedPro.bio}</p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-3 border-b border-slate-800 pb-2">Certifications</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPro.certifications?.map((cert, i) => (
                                        <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded flex items-center">
                                            <Shield size={10} className="mr-1 text-green-500"/> {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div className="mb-8">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <FileBarChart size={18} className="text-yellow-500"/> Project Portfolio
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedPro.portfolio?.length > 0 ? selectedPro.portfolio.map((img, i) => (
                                    // FIXED: Made "View Project" clickable (Opens image in new tab)
                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-slate-800 h-32 group relative cursor-pointer">
                                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-xs font-bold border border-white px-2 py-1 rounded flex items-center">
                                                <Search size={12} className="mr-1"/> View Project
                                            </span>
                                        </div>
                                    </a>
                                )) : <p className="text-slate-500 text-sm italic">No portfolio items uploaded.</p>}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <h3 className="text-white font-bold mb-4">Client Reviews</h3>
                            <div className="space-y-4">
                                {selectedPro.reviews?.map((review) => (
                                    <div key={review.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center">
                                                <span className="text-white font-bold text-sm">{review.user}</span>
                                                {review.verifiedClient && (
                                                    <span className="ml-2 bg-green-900/30 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-900/50 flex items-center">
                                                        <CheckCircle size={10} className="mr-1"/> Verified Client
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-slate-500 text-xs">{review.date}</span>
                                        </div>
                                        <div className="flex text-yellow-500 gap-0.5 mb-2">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                                        </div>
                                        <p className="text-slate-400 text-sm italic">"{review.comment}"</p>
                                    </div>
                                ))}
                                {selectedPro.reviews?.length === 0 && <p className="text-slate-500 text-sm">No reviews yet.</p>}
                            </div>
                        </div>

                        {/* FIXED: Contact Button now calls Admin */}
                        <div className="sticky bottom-0 pt-6 mt-6 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-slate-500">
                                <Info size={12} className="inline mr-1 text-yellow-500"/>
                                For security, all bookings are handled via the DAGIV Central Admin.
                            </p>
                            <a 
                                href="tel:+254704385809" 
                                className="w-full md:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded transition-colors shadow-lg flex items-center justify-center"
                            >
                                <Phone size={18} className="mr-2"/> Call Admin to Book
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-4xl font-bold text-white mb-2">Professionals Hub</h2>
                    <p className="text-slate-400 text-sm">Hire verified engineers, operators, and fabricators.</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center md:justify-end">
                    {roles.map(r => (
                        <button 
                            key={r} 
                            onClick={() => setFilterRole(r)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filterRole === r ? 'bg-yellow-500 text-slate-900 transform scale-105 shadow-lg' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-yellow-500'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPros.map(prof => (
                <div key={prof.id} className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-center hover:border-yellow-500/50 transition-all group hover:-translate-y-1 relative overflow-hidden shadow-lg">
                    {/* Verified Badge (Corner) */}
                    {prof.verified && (
                        <div className="absolute top-3 right-3 text-blue-500 bg-slate-900 rounded-full p-1 border border-slate-800 shadow-sm" title="Verified Professional">
                            <BadgeCheck size={20} />
                        </div>
                    )}
                    
                    <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl overflow-hidden relative border-2 border-slate-700 group-hover:border-yellow-500 transition-colors">
                        {prof.image ? <img src={prof.image} alt={prof.name} className="w-full h-full object-cover" /> : <span className="text-slate-500 font-bold">{prof.name.charAt(0)}</span>}
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight">{prof.name}</h3>
                    <p className="text-yellow-500 text-xs font-bold uppercase mb-1 mt-1">{prof.role}</p>
                    <p className="text-slate-500 text-xs mb-3">{prof.specialization}</p>
                    
                    <div className="flex justify-center gap-1 mb-4 text-yellow-500">
                        {[...Array(5)].map((_,i) => <Star key={i} size={14} fill={i < Math.floor(prof.rating) ? "currentColor" : "none"} />)}
                        <span className="text-slate-600 text-xs ml-1">({prof.reviews?.length || 0})</span>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-4 mt-4">
                        <button onClick={() => setSelectedPro(prof)} className="w-full bg-slate-800 text-white py-2 rounded text-sm hover:bg-white hover:text-slate-900 font-bold transition-colors border border-slate-700">
                            View Profile & Portfolio
                        </button>
                    </div>
                </div>
                ))}
            </div>
            
            {filteredPros.length === 0 && (
                 <div className="text-center py-20">
                     <p className="text-slate-500">No professionals found for this category yet.</p>
                 </div>
            )}
            </div>
            <ProfessionalModal />
        </div>
    );
};

// --- CONSULT PAGE (AI Removed - Professional Only) ---
const ConsultPage = () => {
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');
  const [humanForm, setHumanForm] = useState({
      name: '',
      phone: '',
      type: 'General Technical Advice (Free)',
      details: ''
  });

  const handleHumanSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('SUBMITTING');
      
      const payload = {
          name: humanForm.name,
          phone: humanForm.phone,
          type: humanForm.type,
          details: humanForm.details
      };

      try {
          const res = await fetch('http://localhost:8000/api/consultation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res.ok) setFormStatus('SUCCESS');
          else {
              alert("Failed to submit request.");
              setFormStatus('IDLE');
          }
      } catch (e) {
          console.error(e);
          alert("Error sending request. Is the server online?");
          setFormStatus('IDLE');
      }
  };

  return (
     <div className="min-h-screen bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">Engineering Consultation</h2>
                <p className="text-slate-400">Schedule a session with a certified professional engineer for site inspections, valuations, or technical advice.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl animate-in fade-in">
                {formStatus === 'SUCCESS' ? (
                    <div className="text-center py-10">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                        <p className="text-slate-400">Your consultation request has been logged. Ticket #CN-921.<br/>An engineer will contact you shortly via WhatsApp.</p>
                        <button onClick={() => setFormStatus('IDLE')} className="mt-6 text-yellow-500 underline">Submit another request</button>
                    </div>
                ) : (
                    <form onSubmit={handleHumanSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Your Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" 
                                    required 
                                    value={humanForm.name}
                                    onChange={(e) => setHumanForm({...humanForm, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Phone (WhatsApp)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none" 
                                    placeholder="+254..." 
                                    required 
                                    value={humanForm.phone}
                                    onChange={(e) => setHumanForm({...humanForm, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Consultation Type</label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none"
                                value={humanForm.type}
                                onChange={(e) => setHumanForm({...humanForm, type: e.target.value})}
                            >
                                <option>General Technical Advice (Free)</option>
                                <option>Site Inspection Request (Paid)</option>
                                <option>Machine Valuation (Paid)</option>
                                <option>Project Feasibility Study (Paid)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Project / Machine Details</label>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none h-32" 
                                required 
                                placeholder="Describe your issue or requirement..."
                                value={humanForm.details}
                                onChange={(e) => setHumanForm({...humanForm, details: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="submit" disabled={formStatus === 'SUBMITTING'} className="flex-1 bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 transition-colors">
                                {formStatus === 'SUBMITTING' ? 'Scheduling...' : 'SCHEDULE CONSULTATION'}
                            </button>
                            <a 
                                href="tel:0704385809" 
                                className="px-6 py-4 bg-green-600 text-white font-bold rounded hover:bg-green-500 flex items-center transition-colors"
                            >
                                <Phone className="mr-2" size={20} /> Call Now
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
     </div>
  );
};

const ERPDashboard = ({ hasAccess, onSubscribe, logs }: { hasAccess: boolean, onSubscribe: () => void, logs: OperatorLog[] }) => {
    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center filter blur-sm"></div>
                <div className="relative z-10 max-w-lg bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 p-10 rounded-2xl text-center shadow-2xl">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                        <Lock size={32} className="text-slate-900" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">RESTRICTED ACCESS</h2>
                    <p className="text-slate-300 mb-8">The DAGIV Fleet ERP is a premium enterprise tool for fleet managers. Monitor fuel, track assets, and predict maintenance costs.</p>
                    <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                        <div className="flex items-center text-slate-400"><CheckCircle size={16} className="text-yellow-500 mr-2"/> Real-time Telemetry</div>
                        <div className="flex items-center text-slate-400"><CheckCircle size={16} className="text-yellow-500 mr-2"/> Driver Performance Scorecards</div>
                        <div className="flex items-center text-slate-400"><CheckCircle size={16} className="text-yellow-500 mr-2"/> Automated Expense Reports</div>
                    </div>
                    <button onClick={onSubscribe} className="w-full py-4 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg">
                        REQUEST ACCESS DEMO
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Fleet Command Center</h2>
                        <p className="text-slate-400">Enterprise Resource Planning • Nairobi Region</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2 rounded flex items-center"><Calendar size={16} className="mr-2"/> Oct 2023</button>
                        <button className="bg-yellow-500 text-slate-900 px-4 py-2 rounded font-bold flex items-center"><FileText size={16} className="mr-2"/> Export Report</button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Fleet Value</div>
                        <div className="text-2xl font-bold text-white">KES 142.5M</div>
                        <div className="text-green-500 text-xs mt-2 flex items-center"><ArrowRight size={12} className="rotate-45 mr-1"/> +2.4% vs last month</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Monthly Fuel Cost</div>
                        <div className="text-2xl font-bold text-white">KES 840K</div>
                        <div className="text-red-500 text-xs mt-2 flex items-center"><ArrowRight size={12} className="rotate-45 mr-1"/> +12% due to price hike</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Active Maintenance</div>
                        <div className="text-2xl font-bold text-white">3 Units</div>
                        <div className="text-yellow-500 text-xs mt-2">2 Critical</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-2">Fleet Utilization</div>
                        <div className="text-2xl font-bold text-white">88%</div>
                        <div className="text-green-500 text-xs mt-2">Optimal Range</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-white font-bold mb-6">Operational Costs (6 Months)</h3>
                        <CostChart />
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-white font-bold mb-6">Fleet Status Distribution</h3>
                        <FleetStatusChart />
                    </div>
                </div>

                {/* Recent Logs Table */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-white font-bold">Recent Operator Logs</h3>
                        <button className="text-yellow-500 text-sm font-bold">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-950">
                                <tr>
                                    <th className="px-6 py-3">Log ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Operator</th>
                                    <th className="px-6 py-3">Machine</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{log.id}</td>
                                        <td className="px-6 py-4">{log.date}</td>
                                        <td className="px-6 py-4">{log.operatorName}</td>
                                        <td className="px-6 py-4">{log.machineId}</td>
                                        <td className="px-6 py-4">{log.location}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-bold">Verified</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- OPERATOR PORTAL (Moved to end for clarity) ---
const OperatorPortal = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (log: OperatorLog) => void }) => {
    // Stage 1: Auth, Stage 2: Log Entry
    const [authStep, setAuthStep] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [token, setToken] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        machineId: '',
        startTime: '', // Changed to Time String
        endTime: '',   // Changed to Time String
        currentReading: '', // New: The cumulative meter reading
        readingUnit: 'Kilometers (km)', // New: Unit selector
        fuel: '',
        location: '',
        notes: '',
        checklist: { tires: false, oil: false, hydraulics: false, brakes: false }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (response.ok) { setToken(data.access_token); setAuthStep(false); } 
            else { alert(data.detail || "Login failed."); }
        } catch (error) { alert("Connection error."); } 
        finally { setIsLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.startTime || !formData.endTime) { alert("Please enter start and end times."); return; }
        
        const payload = {
            id: `LOG-${Date.now()}`,
            machineId: formData.machineId,
            operatorName: credentials.username, 
            date: new Date().toISOString().split('T')[0],
            startTime: formData.startTime, 
            endTime: formData.endTime,
            // We use 'startOdometer' field to send the CURRENT cumulative reading
            startOdometer: parseFloat(formData.currentReading) || 0, 
            // We use 'endOdometer' to send the Unit type (hack to avoid changing DB schema too much)
            // ideally we send a new field, but let's stick to the structure or send it as a note
            endOdometer: 0, 
            fuelAddedLiters: parseFloat(formData.fuel) || 0,
            location: formData.location,
            checklist: formData.checklist,
            // We append the unit to notes so backend can parse it safely
            notes: `${formData.notes} [UNIT:${formData.readingUnit}]` 
        };

        try {
            const response = await fetch('http://localhost:8000/api/operator-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) { onSubmit(payload as any); onBack(); } 
            else { alert("Failed to submit log."); }
        } catch (error) { alert("Network error."); }
    };

    const toggleCheck = (key: keyof typeof formData.checklist) => {
        setFormData(prev => ({ ...prev, checklist: { ...prev.checklist, [key]: !prev.checklist[key] } }));
    };

    if (authStep) {
        // ... (Login UI remains the same as before)
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                {/* Same Login UI Code from previous step... just simpler here for brevity */}
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Operator Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Username" onChange={e=>setCredentials({...credentials, username: e.target.value})}/>
                        <input type="password" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Password" onChange={e=>setCredentials({...credentials, password: e.target.value})}/>
                        <button disabled={isLoading} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded">Login</button>
                    </form>
                    <button onClick={onBack} className="w-full text-center text-slate-500 mt-4">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center"><ClipboardCheck className="mr-2 text-yellow-500"/> Daily Log</h2>
                    <button onClick={onBack} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Machine Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Machine ID / Plate</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500" 
                                placeholder="e.g. KCD 892J" value={formData.machineId} onChange={e => setFormData({...formData, machineId: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Site Location</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500" 
                                placeholder="e.g. Athi River" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                    </div>

                    {/* NEW: Time & Meter Reading */}
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                        <h3 className="text-white font-bold text-sm mb-4 flex items-center"><Activity size={16} className="mr-2 text-blue-500"/> Time & Meter Reading</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Start Time</label>
                                <input required type="time" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">End Time</label>
                                <input required type="time" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Current Meter Reading</label>
                                <input required type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white font-bold" 
                                    placeholder="e.g. 12500" value={formData.currentReading} onChange={e => setFormData({...formData, currentReading: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Reading Unit</label>
                                <select className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white"
                                    value={formData.readingUnit} onChange={e => setFormData({...formData, readingUnit: e.target.value})}>
                                    <option value="km">Kilometers (km)</option>
                                    <option value="mi">Miles (mi)</option>
                                    <option value="hrs">Engine Hours (hrs)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-500 text-xs mb-1 block">Fuel Added (L)</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" 
                                    value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* Safety Checklist */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4 flex items-center"><ShieldCheck size={16} className="mr-2 text-green-500"/> Pre-Start Safety Check</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Tires/Tracks', 'Engine Oil', 'Hydraulics', 'Brakes'].map((label, i) => {
                                const key = Object.keys(formData.checklist)[i] as keyof typeof formData.checklist;
                                return (
                                    <button key={key} type="button" onClick={() => toggleCheck(key)}
                                        className={`p-3 rounded border flex flex-col items-center justify-center transition-all ${formData.checklist[key] ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-slate-950 border-slate-700 text-slate-500'}`}>
                                        <span className="text-xs font-bold">{label}</span>
                                        <div className={`w-3 h-3 rounded-full mt-2 ${formData.checklist[key] ? 'bg-green-500' : 'bg-slate-800'}`}></div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Operational Notes</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-20 text-sm" 
                            placeholder="Issues, delays, or maintenance requests..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button type="submit" className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded hover:bg-yellow-400 shadow-lg flex items-center justify-center">
                            <FileBadge className="mr-2" size={20}/> Submit Daily Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [page, setPage] = useState<PageView>(PageView.HOME);
  const [erpAccess, setErpAccess] = useState(false);
  const [operatorLogs, setOperatorLogs] = useState<OperatorLog[]>(INITIAL_LOGS);
  const [showOperatorPortal, setShowOperatorPortal] = useState(false);
  const [inspectionMode, setInspectionMode] = useState(false);
  
  // NEW STATE: Seller Wizard Visibility
  const [isSelling, setIsSelling] = useState(false);

  // Helper to handle log submission from portal
  const handleLogSubmit = (newLog: OperatorLog) => {
    setOperatorLogs([newLog, ...operatorLogs]);
  };

  if (showOperatorPortal) {
    return (
      <OperatorPortal 
        onBack={() => setShowOperatorPortal(false)} 
        onSubmit={handleLogSubmit} 
      />
    );
  }

  if (inspectionMode) {
      return <InspectionBookingPage onComplete={() => { setInspectionMode(false); setPage(PageView.HOME); }} />
  }
// In App.tsx

  const renderContent = () => {
    switch (page) {
      case PageView.HOME:
        return <HomePage 
                  setPage={setPage} 
                  onBookInspection={() => setInspectionMode(true)} 
                  onSellClick={() => setIsSelling(true)} 
               />;
               
      case PageView.MARKETPLACE_BUY:
        // Buy Equipment Tab: Shows SALE items, Equipment Sub-cats
        return <MarketplaceLayout 
                  mode="BUY" 
                  setPage={setPage} 
                  onSellClick={() => setIsSelling(true)} 
                  isSpareParts={false} 
               />;
        
      case PageView.MARKETPLACE_RENT:
        // Plant Hire Tab: Shows RENT items, Equipment Sub-cats
        return <MarketplaceLayout 
                  mode="RENT" 
                  setPage={setPage} 
                  onSellClick={() => setIsSelling(true)} 
                  isSpareParts={false} 
               />;
        
      case PageView.SPARE_PARTS:
        // Spare Parts Tab: Shows SALE items, PARTS Sub-cats
        return <MarketplaceLayout 
                  mode="BUY" 
                  setPage={setPage} 
                  onSellClick={() => setIsSelling(true)} 
                  isSpareParts={true} 
               />;
        
      case PageView.SERVICES:
        return <ServicesPage setPage={setPage} />;
        
      case PageView.ERP:
        return <ERPDashboard hasAccess={erpAccess} onSubscribe={() => setErpAccess(true)} logs={operatorLogs} />;
        
      case PageView.PROFESSIONALS:
        return <ProfessionalsPage />;
        
      case PageView.CONSULT:
        return <ConsultPage />;
        
      case PageView.CONTACT:
        return <ContactPage />;
        
      default:
        return <HomePage 
                  setPage={setPage} 
                  onBookInspection={() => setInspectionMode(true)} 
                  onSellClick={() => setIsSelling(true)}
               />;
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col font-sans text-slate-200 selection:bg-yellow-500 selection:text-slate-900">
      <Navbar 
        currentPage={page} 
        setPage={setPage} 
        onLoginClick={() => setShowOperatorPortal(true)} 
      />
      <div className="flex-1">
        {renderContent()}
      </div>
      <Footer setPage={setPage} />
      {isSelling && <SellItemModal onClose={() => setIsSelling(false)} />}
    </div>
  );
};

export default App;