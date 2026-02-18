import React, { useState, useRef } from 'react';
import { 
  X, BadgeCheck, Truck, Clock, Settings, MapPin, 
  DollarSign, Camera, Video, FileText, UploadCloud, 
  Check, List, ShieldCheck, RefreshCw, ChevronRight, 
  User, Building2, FileCheck, 
  CheckCircle, Eye, EyeOff 
} from 'lucide-react';
import { CATEGORY_STRUCTURE } from '@/config/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const WORLD_CURRENCIES = [
    { code: "USD", name: "United States Dollar" },
    { code: "KES", name: "Kenyan Shilling" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound Sterling" },
    { code: "AED", name: "United Arab Emirates Dirham" },
    { code: "AFN", name: "Afghan Afghani" },
    { code: "ALL", name: "Albanian Lek" },
    { code: "AMD", name: "Armenian Dram" },
    { code: "ANG", name: "Netherlands Antillean Guilder" },
    { code: "AOA", name: "Angolan Kwanza" },
    { code: "ARS", name: "Argentine Peso" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "AWG", name: "Aruban Florin" },
    { code: "AZN", name: "Azerbaijani Manat" },
    { code: "BAM", name: "Bosnia-Herzegovina Mark" },
    { code: "BBD", name: "Barbadian Dollar" },
    { code: "BDT", name: "Bangladeshi Taka" },
    { code: "BGN", name: "Bulgarian Lev" },
    { code: "BHD", name: "Bahraini Dinar" },
    { code: "BIF", name: "Burundian Franc" },
    { code: "BMD", name: "Bermudan Dollar" },
    { code: "BND", name: "Brunei Dollar" },
    { code: "BOB", name: "Bolivian Boliviano" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "BSD", name: "Bahamian Dollar" },
    { code: "BTN", name: "Bhutanese Ngultrum" },
    { code: "BWP", name: "Botswanan Pula" },
    { code: "BYN", name: "Belarusian Ruble" },
    { code: "BZD", name: "Belize Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CDF", name: "Congolese Franc" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CLP", name: "Chilean Peso" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "COP", name: "Colombian Peso" },
    { code: "CRC", name: "Costa Rican Colón" },
    { code: "CUP", name: "Cuban Peso" },
    { code: "CVE", name: "Cape Verdean Escudo" },
    { code: "CZK", name: "Czech Republic Koruna" },
    { code: "DJF", name: "Djiboutian Franc" },
    { code: "DKK", name: "Danish Krone" },
    { code: "DOP", name: "Dominican Peso" },
    { code: "DZD", name: "Algerian Dinar" },
    { code: "EGP", name: "Egyptian Pound" },
    { code: "ERN", name: "Eritrean Nakfa" },
    { code: "ETB", name: "Ethiopian Birr" },
    { code: "FJD", name: "Fijian Dollar" },
    { code: "FKP", name: "Falkland Islands Pound" },
    { code: "GEL", name: "Georgian Lari" },
    { code: "GHS", name: "Ghanaian Cedi" },
    { code: "GIP", name: "Gibraltar Pound" },
    { code: "GMD", name: "Gambian Dalasi" },
    { code: "GNF", name: "Guinean Franc" },
    { code: "GTQ", name: "Guatemalan Quetzal" },
    { code: "GYD", name: "Guyanaese Dollar" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "HNL", name: "Honduran Lempira" },
    { code: "HRK", name: "Croatian Kuna" },
    { code: "HTG", name: "Haitian Gourde" },
    { code: "HUF", name: "Hungarian Forint" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "ILS", name: "Israeli New Sheqel" },
    { code: "INR", name: "Indian Rupee" },
    { code: "IQD", name: "Iraqi Dinar" },
    { code: "IRR", name: "Iranian Rial" },
    { code: "ISK", name: "Icelandic Króna" },
    { code: "JMD", name: "Jamaican Dollar" },
    { code: "JOD", name: "Jordanian Dinar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "KGS", name: "Kyrgystani Som" },
    { code: "KHR", name: "Cambodian Riel" },
    { code: "KMF", name: "Comorian Franc" },
    { code: "KPW", name: "North Korean Won" },
    { code: "KRW", name: "South Korean Won" },
    { code: "KWD", name: "Kuwaiti Dinar" },
    { code: "KYD", name: "Cayman Islands Dollar" },
    { code: "KZT", name: "Kazakhstani Tenge" },
    { code: "LAK", name: "Laotian Kip" },
    { code: "LBP", name: "Lebanese Pound" },
    { code: "LKR", name: "Sri Lankan Rupee" },
    { code: "LRD", name: "Liberian Dollar" },
    { code: "LSL", name: "Lesotho Loti" },
    { code: "LYD", name: "Libyan Dinar" },
    { code: "MAD", name: "Moroccan Dirham" },
    { code: "MDL", name: "Moldovan Leu" },
    { code: "MGA", name: "Malagasy Ariary" },
    { code: "MKD", name: "Macedonian Denar" },
    { code: "MMK", name: "Myanma Kyat" },
    { code: "MNT", name: "Mongolian Tugrik" },
    { code: "MOP", name: "Macanese Pataca" },
    { code: "MRU", name: "Mauritanian Ouguiya" },
    { code: "MUR", name: "Mauritian Rupee" },
    { code: "MVR", name: "Maldivian Rufiyaa" },
    { code: "MWK", name: "Malawian Kwacha" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "MZN", name: "Mozambican Metical" },
    { code: "NAD", name: "Namibian Dollar" },
    { code: "NGN", name: "Nigerian Naira" },
    { code: "NIO", name: "Nicaraguan Córdoba" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "NPR", name: "Nepalese Rupee" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "OMR", name: "Omani Rial" },
    { code: "PAB", name: "Panamanian Balboa" },
    { code: "PEN", name: "Peruvian Nuevo Sol" },
    { code: "PGK", name: "Papua New Guinean Kina" },
    { code: "PHP", name: "Philippine Peso" },
    { code: "PKR", name: "Pakistani Rupee" },
    { code: "PLN", name: "Polish Zloty" },
    { code: "PYG", name: "Paraguayan Guarani" },
    { code: "QAR", name: "Qatari Rial" },
    { code: "RON", name: "Romanian Leu" },
    { code: "RSD", name: "Serbian Dinar" },
    { code: "RUB", name: "Russian Ruble" },
    { code: "RWF", name: "Rwandan Franc" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "SBD", name: "Solomon Islands Dollar" },
    { code: "SCR", name: "Seychellois Rupee" },
    { code: "SDG", name: "Sudanese Pound" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "SHP", name: "Saint Helena Pound" },
    { code: "SLL", name: "Sierra Leonean Leone" },
    { code: "SOS", name: "Somali Shilling" },
    { code: "SRD", name: "Surinamese Dollar" },
    { code: "STN", name: "São Tomé and Príncipe Dobra" },
    { code: "SYP", name: "Syrian Pound" },
    { code: "SZL", name: "Swazi Lilangeni" },
    { code: "THB", name: "Thai Baht" },
    { code: "TJS", name: "Tajikistani Somoni" },
    { code: "TMT", name: "Turkmenistani Manat" },
    { code: "TND", name: "Tunisian Dinar" },
    { code: "TOP", name: "Tongan Pa'anga" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "TTD", name: "Trinidad and Tobago Dollar" },
    { code: "TWD", name: "New Taiwan Dollar" },
    { code: "TZS", name: "Tanzanian Shilling" },
    { code: "UAH", name: "Ukrainian Hryvnia" },
    { code: "UGX", name: "Ugandan Shilling" },
    { code: "UYU", name: "Uruguayan Peso" },
    { code: "UZS", name: "Uzbekistan Som" },
    { code: "VES", name: "Venezuelan Bolívar" },
    { code: "VND", name: "Vietnamese Dong" },
    { code: "VUV", name: "Vanuatu Vatu" },
    { code: "WST", name: "Samoan Tala" },
    { code: "XAF", name: "CFA Franc BEAC" },
    { code: "XCD", name: "East Caribbean Dollar" },
    { code: "XOF", name: "CFA Franc BCEAO" },
    { code: "XPF", name: "CFP Franc" },
    { code: "YER", name: "Yemeni Rial" },
    { code: "ZAR", name: "South African Rand" },
    { code: "ZMW", name: "Zambian Kwacha" },
    { code: "ZWL", name: "Zimbabwean Dollar" }
];

interface SellItemModalProps {
  onClose: () => void;
  onLoginSuccess?: (token: string) => void;
  onListingComplete?: () => void; 
  initialStage?: 'WELCOME' | 'GATE' | 'KYC_REGISTER' | 'WIZARD';
}

export const SellItemModal: React.FC<SellItemModalProps> = ({ onClose, onLoginSuccess, onListingComplete, initialStage = 'WELCOME' }) => {
    const [stage, setStage] = useState<'WELCOME' | 'LOGIN' | 'GATE' | 'KYC_REGISTER' | 'WIZARD'>(initialStage);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Auth State for Login
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    // State for Password Visibility
    const [showPassword, setShowPassword] = useState(false); 

    // File Input References
    const docPrimaryRef = useRef<HTMLInputElement>(null);
    const docSecondaryRef = useRef<HTMLInputElement>(null);
    const docProofRef = useRef<HTMLInputElement>(null);
    const mediaVideoRef = useRef<HTMLInputElement>(null);
    const mediaDocRef = useRef<HTMLInputElement>(null);
    
    // Constants
    const YEARS = Array.from({length: 37}, (_, i) => (2026 - i).toString());
    const USAGE_UNITS = ["Hours", "Km", "Miles"];
    const RENT_PERIODS = ["Hour", "Day", "Week", "Month"];
    const CONDITIONS = ["New", "Used - Like New", "Used - Good", "Refurbished", "For Parts"];
    
    // Seller State
    const [sellerIdentity, setSellerIdentity] = useState({ 
        phone: '', name: '', status: '', id: '', location: '', email: '', password: '', countryCode: '+254', 
        businessType: 'Company', regNumber: '',
        doc_primary: '', doc_secondary: '', doc_proof: '',
        doc_primary_name: '', doc_secondary_name: '', doc_proof_name: ''
    });
    
    // Listing Data
    const [listingType, setListingType] = useState<'SALE' | 'RENT' | 'PART'>('SALE');
    const [formData, setFormData] = useState({
        listingTitle: '', category: 'Heavy Plant and Equipment', subCategory: '', 
        brand: '', model: '', stockId: '', yom: '', condition: 'Used',
        price: '', currency: 'KES', priceOnRequest: false, rentDry: '', rentWet: '', rentCurrency: 'KES', rentPeriod: 'Day', additionalCostTerms: '',
        engineBrand: '', enginePower: '', fuelType: 'Diesel', emissionStandard: '', transmissionType: '', maxSpeed: '', 
        dimLength: '', dimWidth: '', dimHeight: '', netWeight: '', trackWidth: '', tireSize: '', axles: '', residualTread: '',
        auxHydraulics: 'No', hammerProtection: 'No', performanceSpecs: '', usage: '', usageUnit: 'Hours', runningHours: '',
        partType: 'Original', partNumber: '', oemNumber: '', partWeight: '', applicableModels: '',
        country: '', region: '', city: '', address: '', pickupLocation: '', availabilityDate: '',
        images: [] as string[], videos: [] as string[], complianceDocs: [] as string[],
        warranty: 'No', warrantyDetails: '', originalPaint: 'Yes', sellerTerms: '', shippingInfo: '', description: ''
    });
    
    // @ts-ignore
    const categories = Object.keys(CATEGORY_STRUCTURE);
    // @ts-ignore
    const subCategories = formData.category ? (listingType === 'PART' ? CATEGORY_STRUCTURE[formData.category].parts : CATEGORY_STRUCTURE[formData.category].equipment) : [];

    // Helper: File to Base64
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

    const isStepValid = () => {
        if (step === 2) return formData.listingTitle && formData.category && formData.subCategory && formData.brand;
        if (step === 3) return true;
        if (step === 4) return formData.images.length > 0;
        return true;
    };

    const handleSecureLogin = async () => { 
        setLoading(true); 
        try { 
            const res = await fetch(`${API_URL}/api/auth/login`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ identifier: loginForm.email, password: loginForm.password }) 
            }); 
            const data = await res.json(); 
            if (res.ok) { 
                if (onLoginSuccess) onLoginSuccess(data.access_token); 
            } else { 
                alert(data.detail || "Login failed"); 
            } 
        } catch (err) { alert("Connection Error"); } 
        finally { setLoading(false); } 
    };

    const checkSeller = async () => { 
        if(!sellerIdentity.phone) return alert("Enter phone number"); 
        setLoading(true); 
        try { 
            const res = await fetch(`${API_URL}/api/sellers/check`, { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ phone: sellerIdentity.phone }) 
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
        if(!sellerIdentity.name || !sellerIdentity.email || !sellerIdentity.location || 
           !sellerIdentity.regNumber || !sellerIdentity.doc_primary || 
           !sellerIdentity.password || !sellerIdentity.phone) {
            return alert("Please fill in ALL fields (Name, Email, Location, ID, Document, Password).");
        }
        
        setLoading(true);
        const fullPhone = `${sellerIdentity.countryCode}${sellerIdentity.phone}`;

        try {
            const res = await fetch(`${API_URL}/api/sellers/register`, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ 
                    ...sellerIdentity,
                    phone: fullPhone 
                })
            });

            const data = await res.json(); 

            if(res.ok) { 
                alert("Submitted! Verification pending. Please Log In."); 
                onClose(); 
            } else {
                console.error("Registration Validation Error:", data);
                const errorMsg = Array.isArray(data.detail) 
                    ? data.detail.map((e: any) => `${e.loc.join('.')} - ${e.msg}`).join('\n')
                    : data.detail || "Registration failed";
                
                alert(`Error: ${errorMsg}`);
            }
        } catch (err) { 
            console.error(err);
            alert("Connection Error. Ensure Backend is running."); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleSubmitListing = async () => { 
        setLoading(true); 
        
        const token = localStorage.getItem('dagiv_seller_token');
        if (!token) {
            alert("Authentication Error: You are not logged in. Please log in to list items.");
            setLoading(false);
            return;
        }

        const finalPrice = listingType === 'SALE' || listingType === 'PART' ? parseFloat(formData.price) : parseFloat(formData.rentDry) || 0; 
        
        const payload = { 
            listingType, 
            title: formData.listingTitle, 
            sellerName: sellerIdentity.name, 
            phone: sellerIdentity.phone, 
            location: formData.city || sellerIdentity.location, 
            category: formData.category, 
            subCategory: formData.subCategory, 
            brand: formData.brand, 
            model: formData.model, 
            price: finalPrice, 
            currency: listingType === 'RENT' ? formData.rentCurrency : formData.currency, 
            specs: { ...formData } 
        }; 
        
        try { 
            const res = await fetch(`${API_URL}/api/marketplace/submit`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }, 
                body: JSON.stringify(payload) 
            }); 
            
            if (res.ok) {
                if (onListingComplete) onListingComplete(); 
                setStep(5); 
            } else {
                const err = await res.json();
                alert(`Failed: ${err.detail || "Unknown Error"}`);
            }
        } catch { 
            alert("Connection Error"); 
        } finally { 
            setLoading(false); 
        } 
    };

    // --- VIEW 1: WELCOME SCREEN ---
    if (stage === 'WELCOME') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <style>{`.glow-card:hover { box-shadow: 0 0 40px rgba(234, 179, 8, 0.15); border-color: rgba(234, 179, 8, 0.5); }`}</style>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] relative">
                    
                    {/* Fixed: Accessible name added */}
                    <button onClick={onClose} aria-label="Close Modal" className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>

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
                         <div className="max-w-sm mx-auto w-full">
                             <h3 className="text-3xl font-bold text-white mb-2">Start Selling</h3>
                             <p className="text-slate-400 mb-8">Access thousands of contractors and engineers.</p>
                             <div className="space-y-4">
                                 <button onClick={() => setStage('LOGIN')} className="w-full bg-yellow-500 text-slate-900 font-bold py-4 rounded-lg hover:bg-yellow-400 flex justify-between items-center px-6 group transition-all shadow-lg">
                                    <span>Log In to Seller Dashboard</span><ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                                 </button>
                                 <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">First time here?</span></div></div>
                                 <button onClick={() => setStage('GATE')} className="w-full bg-slate-800 text-white font-bold py-4 rounded-lg hover:bg-slate-700 border border-slate-700 flex justify-center items-center">
                                    Create Seller Profile (KYC)
                                 </button>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: LOGIN SCREEN ---
    if (stage === 'LOGIN') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
                    
                    {/* Fixed: Accessible name added */}
                    <button onClick={onClose} aria-label="Close Modal" className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>

                    <button onClick={() => setStage('WELCOME')} aria-label="Go Back" className="absolute top-4 left-4 text-slate-500 hover:text-white"><ChevronRight size={20} className="rotate-180"/></button>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Dashboard Login</h2>
                    <div className="space-y-4">
                        <input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Email Address" 
                            value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
                        {/* Modern Password Input */}
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white pr-10" 
                                placeholder="Password" 
                                value={loginForm.password} 
                                onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button onClick={handleSecureLogin} disabled={loading} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-400 flex items-center justify-center">
                            {loading ? <RefreshCw className="animate-spin mr-2"/> : "Access Dashboard"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 3: GATE (Phone Check) ---
    if (stage === 'GATE') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl relative">
                    
                    {/* Fixed: Accessible name added */}
                    <button onClick={onClose} aria-label="Close Modal" className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>

                    <button onClick={() => setStage('WELCOME')} aria-label="Go Back" className="absolute top-4 left-4 text-slate-500"><ChevronRight size={20} className="rotate-180"/></button>
                    <h2 className="text-2xl font-bold text-white mb-2">Seller Identification</h2>
                    <input className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white text-center text-lg font-bold tracking-widest mb-4 mt-6" placeholder="07XX XXX XXX" value={sellerIdentity.phone} onChange={(e) => setSellerIdentity({...sellerIdentity, phone: e.target.value})} />
                    <button onClick={checkSeller} disabled={loading} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-400 flex items-center justify-center">{loading ? <RefreshCw className="animate-spin mr-2"/> : "Continue"}</button>
                </div>
            </div>
        );
    }

    // --- VIEW 4: KYC REGISTER ---
    if (stage === 'KYC_REGISTER') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
                    
                    {/* Fixed: Accessible name added */}
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                        <div><h2 className="text-xl font-bold text-white">Seller Verification</h2><p className="text-xs text-slate-400">Step 1 of 1: Identity Proof</p></div>
                        <button onClick={onClose} aria-label="Close Modal" className="p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors"><X size={20}/></button>
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

                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white pr-10" 
                                    placeholder="Create Password" 
                                    value={sellerIdentity.password} 
                                    onChange={e => setSellerIdentity({...sellerIdentity, password: e.target.value})} 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
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
                        <button onClick={onClose} aria-label="Close Modal"><X className="text-slate-500 hover:text-white"/></button>
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
                                            aria-label="Listing Title"
                                            className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white font-bold text-lg focus:border-yellow-500" 
                                            placeholder={listingType === 'PART' ? "e.g. Caterpillar 320D Hydraulic Pump" : "e.g. Komatsu PC200-8 Excavator"} 
                                            value={formData.listingTitle} 
                                            onChange={e => setFormData({...formData, listingTitle: e.target.value})} 
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold block mb-1">Category</label>
                                            <select aria-label="Category" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                {categories.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold block mb-1">{listingType === 'PART' ? 'Component Type' : 'Machine Type'}</label>
                                            <select aria-label="Sub Category" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                                                <option value="">Select...</option>
                                                {subCategories.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-slate-500 font-bold block mb-1">{listingType === 'PART' ? 'Manufacturer' : 'Brand'}</label>
                                            <input aria-label="Brand" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. Caterpillar" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                                        </div>
                                        {listingType === 'PART' ? (
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Part Number (OEM)</label>
                                                <input aria-label="Part Number" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white font-mono" placeholder="e.g. 1U3352" value={formData.partNumber} onChange={e => setFormData({...formData, partNumber: e.target.value})} />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Model</label>
                                                <input aria-label="Model" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. 320D GC" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Year & Condition */}
                                    {listingType !== 'PART' && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Year of Manufacture</label>
                                                <select aria-label="Year of Manufacture" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.yom} onChange={e => setFormData({...formData, yom: e.target.value})}>
                                                    <option value="">Select Year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Condition</label>
                                                <select aria-label="Condition" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                                                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    {listingType === 'PART' && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Compatible Machine Models</label>
                                                <input aria-label="Compatible Models" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. CAT 320D, 325D" value={formData.applicableModels} onChange={e => setFormData({...formData, applicableModels: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 font-bold block mb-1">Part Condition</label>
                                                <select aria-label="Part Condition" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
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
                                        <div><label className="text-xs text-slate-500 block mb-1">Country</label><input aria-label="Country" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Kenya" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">Region / State</label><input aria-label="Region" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Nairobi County" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">City / Town</label><input aria-label="City" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Nairobi" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">{listingType === 'RENT' ? 'Pickup Location' : 'Specific Address'}</label><input aria-label="Address" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Industrial Area, Road A" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                                    </div>
                                    {listingType === 'RENT' && (
                                        <div className="mt-4"><label className="text-xs text-slate-500 block mb-1">Availability Start Date</label><input aria-label="Availability Date" type="date" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.availabilityDate} onChange={e => setFormData({...formData, availabilityDate: e.target.value})} /></div>
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
                                                    <select 
                                                        aria-label="Currency"
                                                        className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-bold custom-select" 
                                                        value={formData.currency} 
                                                        onChange={e => setFormData({...formData, currency: e.target.value})}
                                                    >
                                                        {WORLD_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-slate-500 block mb-1">Selling Price</label>
                                                    <input aria-label="Selling Price" type="number" disabled={formData.priceOnRequest} className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-bold text-lg disabled:opacity-50" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
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
                                                        <select 
                                                            aria-label="Rent Currency Dry"
                                                            className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" 
                                                            value={formData.rentCurrency} 
                                                            onChange={e => setFormData({...formData, rentCurrency: e.target.value})}
                                                        >
                                                            {WORLD_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                                        </select>
                                                        <input aria-label="Rent Rate Dry" type="number" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white" placeholder="Rate" value={formData.rentDry} onChange={e => setFormData({...formData, rentDry: e.target.value})} />
                                                        <select aria-label="Rent Period Dry" className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" value={formData.rentPeriod} onChange={e => setFormData({...formData, rentPeriod: e.target.value})}>{RENT_PERIODS.map(p => <option key={p}>/{p}</option>)}</select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400 block mb-1">Wet Rate (With Operator/Fuel)</label>
                                                    <div className="flex gap-2">
                                                        <select 
                                                            aria-label="Rent Currency Wet"
                                                            className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" 
                                                            value={formData.rentCurrency} 
                                                            onChange={e => setFormData({...formData, rentCurrency: e.target.value})}
                                                        >
                                                            {WORLD_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                                        </select>
                                                        <input aria-label="Rent Rate Wet" type="number" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white" placeholder="Rate" value={formData.rentWet} onChange={e => setFormData({...formData, rentWet: e.target.value})} />
                                                        <select aria-label="Rent Period Wet" className="w-24 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs custom-select" value={formData.rentPeriod} onChange={e => setFormData({...formData, rentPeriod: e.target.value})}>{RENT_PERIODS.map(p => <option key={p}>/{p}</option>)}</select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Additional Cost Terms</label>
                                                <input aria-label="Additional Cost Terms" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white text-sm" placeholder="e.g. Mobilization fee, min hours per day..." value={formData.additionalCostTerms} onChange={e => setFormData({...formData, additionalCostTerms: e.target.value})} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* --- TECHNICAL SPECS --- */}
                                <div className="space-y-4">
                                    <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-wider border-b border-yellow-500/30 pb-2">Technical Specifications</h4>
                                    
                                    {listingType === 'PART' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-xs text-slate-500 block mb-1">Weight (kg)</label><input aria-label="Weight" type="number" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.partWeight} onChange={e => setFormData({...formData, partWeight: e.target.value})} /></div>
                                            <div><label className="text-xs text-slate-500 block mb-1">Dimensions (L x W x H)</label><input aria-label="Dimensions" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. 50x30x20 cm" value={formData.dimLength} onChange={e => setFormData({...formData, dimLength: e.target.value})} /></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Engine & Power */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div><label className="text-xs text-slate-500 block mb-1">Engine Brand</label><input aria-label="Engine Brand" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Cummins" value={formData.engineBrand} onChange={e => setFormData({...formData, engineBrand: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Power</label><input aria-label="Engine Power" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="kW / HP" value={formData.enginePower} onChange={e => setFormData({...formData, enginePower: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Fuel Type</label><select aria-label="Fuel Type" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}><option>Diesel</option><option>Petrol</option><option>Electric</option></select></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Emission</label><select aria-label="Emission Standard" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.emissionStandard} onChange={e => setFormData({...formData, emissionStandard: e.target.value})}><option value="">Standard</option><option>Euro 3</option><option>Euro 4</option><option>Euro 5</option><option>Tier 4F</option></select></div>
                                            </div>

                                            {/* Usage & Dimensions */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                                <div className="col-span-2 flex gap-2">
                                                    <div className="flex-1"><label className="text-xs text-slate-500 block mb-1">Usage / Mileage</label><input aria-label="Usage" type="number" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.usage} onChange={e => setFormData({...formData, usage: e.target.value})} /></div>
                                                    <div className="w-24"><label className="text-xs text-slate-500 block mb-1">Unit</label><select aria-label="Usage Unit" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.usageUnit} onChange={e => setFormData({...formData, usageUnit: e.target.value})}>{USAGE_UNITS.map(u => <option key={u}>{u}</option>)}</select></div>
                                                </div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Net Weight (kg)</label><input aria-label="Net Weight" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.netWeight} onChange={e => setFormData({...formData, netWeight: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Axles / Tracks</label><input aria-label="Axles Tracks" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Config" value={formData.axles} onChange={e => setFormData({...formData, axles: e.target.value})} /></div>
                                            </div>

                                            {/* Performance */}
                                            <div className="mt-4"><label className="text-xs text-slate-500 block mb-1">Performance Specs</label><input aria-label="Performance Specs" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. Dig Depth: 6m, Lift: 4T, Bucket Cap: 1.2m3" value={formData.performanceSpecs} onChange={e => setFormData({...formData, performanceSpecs: e.target.value})} /></div>
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
                                            {/* Fixed: Replaced inline style div with img tag */}
                                            {formData.images.length > 0 && <div className="mt-4 grid grid-cols-4 gap-2">{formData.images.slice(0,4).map((src, i) => <img key={i} src={src} alt={`Uploaded ${i}`} className="h-12 w-full object-cover rounded border border-slate-700" />)}</div>}
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
                                            <div><label className="text-xs text-slate-500 block mb-1">Shipping / Packaging Info</label><input aria-label="Shipping Info" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.shippingInfo} onChange={e => setFormData({...formData, shippingInfo: e.target.value})} /></div>
                                        ) : (
                                            <>
                                                <div><label className="text-xs text-slate-500 block mb-1">Warranty Details</label><input aria-label="Warranty Details" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. 6 Months Dealer" value={formData.warrantyDetails} onChange={e => setFormData({...formData, warrantyDetails: e.target.value})} /></div>
                                                <div><label className="text-xs text-slate-500 block mb-1">Original Paint?</label><select aria-label="Original Paint" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white custom-select" value={formData.originalPaint} onChange={e => setFormData({...formData, originalPaint: e.target.value})}><option>Yes</option><option>No</option></select></div>
                                            </>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                         <label className="text-xs text-slate-500 block mb-1">Seller Terms / Remarks</label>
                                         <input aria-label="Seller Terms" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="e.g. Sold as is, Buyer arranges transport" value={formData.sellerTerms} onChange={e => setFormData({...formData, sellerTerms: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Detailed Description</label>
                                        <textarea aria-label="Description" className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white h-32" placeholder="Mention specific condition, recent repairs, or included attachments..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
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

    return null; 
};