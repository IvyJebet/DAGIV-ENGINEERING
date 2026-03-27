// src/features/seller/components/SellItemModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, BadgeCheck, Truck, Clock, Settings, MapPin, 
  DollarSign, Camera, Video, FileText, UploadCloud, 
  Check, List, ShieldCheck, RefreshCw, ChevronRight, 
  User, Building2, FileCheck, CheckCircle, Eye, EyeOff, Info, Loader2 
} from 'lucide-react';
import { CATEGORY_STRUCTURE } from '@/config/constants';
import { useAuth } from '@/context/AuthContext';
import { useJsApiLoader, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import { DynamicFieldEngine } from './DynamicFieldEngine';
import { ListingType } from '@/config/listingSchemas';
import { uploadImageToSupabase } from '@/utils/supabaseClient';

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
  initialStage?: 'WELCOME' | 'GATE' | 'KYC_REGISTER' | 'OTP_VERIFY' | 'WIZARD';
  editData?: any; 
}

const COMMISSION_RATES = { SALE: 0.03, RENT: 0.05, PART: 0.10 };
const VAT_RATE = 0.16;
const MAPS_LIBRARIES: ("places")[] = ["places"];

export const SellItemModal: React.FC<SellItemModalProps> = ({ onClose, onLoginSuccess, onListingComplete, initialStage = 'WELCOME', editData }) => {
    const { login } = useAuth(); 

    const [stage, setStage] = useState<'WELCOME' | 'LOGIN' | 'GATE' | 'KYC_REGISTER' | 'OTP_VERIFY' | 'WIZARD'>(initialStage);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [otpCode, setOtpCode] = useState('');
    const [showPassword, setShowPassword] = useState(false); 

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: MAPS_LIBRARIES
    });
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [mapMarker, setMapMarker] = useState<{lat: number, lng: number} | null>(null);
    const [geocoding, setGeocoding] = useState(false);

    const docPrimaryRef = useRef<HTMLInputElement>(null);
    const docSecondaryRef = useRef<HTMLInputElement>(null);
    const docProofRef = useRef<HTMLInputElement>(null);
    const mediaVideoRef = useRef<HTMLInputElement>(null);
    const mediaDocRef = useRef<HTMLInputElement>(null);
    
    const YEARS = Array.from({length: 37}, (_, i) => (2026 - i).toString());
    const CONDITIONS = ["New", "Used - Like New", "Used - Good", "Refurbished", "For Parts"];
    
    const [sellerIdentity, setSellerIdentity] = useState({ 
        phone: '', name: '', status: '', id: '', location: '', email: '', password: '', countryCode: '+254', 
        businessType: 'Company', regNumber: '',
        doc_primary: '', doc_secondary: '', doc_proof: '',
        doc_primary_name: '', doc_secondary_name: '', doc_proof_name: ''
    });
    
    const [listingType, setListingType] = useState<ListingType>('SALE');
    
    const [formData, setFormData] = useState<Record<string, any>>({
        listingTitle: '', category: 'Heavy Plant and Equipment', subCategory: '', 
        brand: '', model: '', yom: '', condition: 'Used',
        currency: 'KES', priceOnRequest: false,
        
        price: '', 
        
        country: '', region: '', city: '', address: '', lat: '', lng: '', availabilityDate: '',
        
        images: [] as (string | File)[], 
        videos: [] as (string | File)[], 
        complianceDocs: [] as (string | File)[],
        warrantyDetails: '', originalPaint: 'Yes', sellerTerms: '', shippingInfo: '', description: ''
    });

    useEffect(() => {
        if (editData) {
            setStage('WIZARD');
            setStep(2); 
            setListingType(editData.listing_type || 'SALE');
            
            let parsedSpecs: Record<string, any> = {};
            try {
                parsedSpecs = typeof editData.specs === 'string' ? JSON.parse(editData.specs) : (editData.specs || {});
            } catch(e) {}

            setFormData(prev => ({
                ...prev,
                ...parsedSpecs,
                category: editData.category || prev.category,
                subCategory: editData.sub_category || prev.subCategory,
                brand: editData.brand || prev.brand,
                model: editData.model || prev.model,
                price: editData.price ? editData.price.toString() : prev.price,
                currency: editData.currency || prev.currency,
                listingTitle: parsedSpecs.listingTitle || `${editData.brand} ${editData.model}`
            }));
        }
    }, [editData]);
    
    // @ts-ignore
    const categories = Object.keys(CATEGORY_STRUCTURE);
    // @ts-ignore
    const subCategories = formData.category ? (listingType === 'PART' ? CATEGORY_STRUCTURE[formData.category].parts : CATEGORY_STRUCTURE[formData.category].equipment) : [];

    // --- UPDATED: Strict TypeScript Fix & Removed Base64 for Listing Media ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: string | null, isArray = false, arrayField = 'images') => {
        if (e.target.files && e.target.files.length > 0) {
            if (isArray) {
                // Keep the raw File object in state, NO Base64 conversion
                const newFiles = Array.from(e.target.files);
                setFormData(prev => ({...prev, [arrayField]: [...prev[arrayField], ...newFiles]})); 
            } else if (field) {
                // Explicitly cast to File to satisfy strict TS checks
                const file = e.target.files[0] as File; 
                
                // KYC docs stay as Base64 for now, as they likely don't go to Supabase yet
                const reader = new FileReader();
                reader.onload = () => { 
                    if (reader.result) { 
                        setSellerIdentity(prev => ({ ...prev, [`${field}_name`]: file.name, [field]: reader.result as string })); 
                    } 
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const isStepValid = () => {
        if (step === 2) return formData.listingTitle && formData.category && formData.subCategory && formData.brand && formData.city;
        if (step === 3) return formData.price || formData.dailyRate || formData.hourlyRate; 
        if (step === 4) return formData.images.length > 0;
        return true;
    };

    // --- Google Maps Event Handlers ---
    const handlePlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            let country = '', region = '', city = '';

            place.address_components?.forEach(component => {
                if (component.types.includes('country')) country = component.long_name;
                if (component.types.includes('administrative_area_level_1')) region = component.long_name;
                if (component.types.includes('locality')) city = component.long_name;
            });

            setFormData(prev => ({
                ...prev,
                address: place.formatted_address || '',
                country: country || prev.country,
                region: region || prev.region,
                city: city || prev.city,
                lat: place.geometry?.location?.lat().toString() || '',
                lng: place.geometry?.location?.lng().toString() || ''
            }));
            
            if (place.geometry?.location) {
                setMapMarker({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
            }
        }
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setMapMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
    };

    const handleConfirmLocation = () => {
        if (!mapMarker) return;
        setGeocoding(true);
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: mapMarker }, (results, status) => {
            setGeocoding(false);
            if (status === 'OK' && results && results[0]) {
                const place = results[0];
                let country = '', region = '', city = '';

                place.address_components?.forEach(component => {
                    if (component.types.includes('country')) country = component.long_name;
                    if (component.types.includes('administrative_area_level_1')) region = component.long_name;
                    if (component.types.includes('locality')) city = component.long_name;
                });

                setFormData(prev => ({
                    ...prev,
                    address: place.formatted_address || '',
                    country: country || prev.country,
                    region: region || prev.region,
                    city: city || prev.city,
                    lat: mapMarker.lat.toString(),
                    lng: mapMarker.lng.toString()
                }));
                setMapModalOpen(false);
            } else {
                alert("Could not fetch a readable address for this location. Please try another spot or enter manually.");
            }
        });
    };

    // --- Authentication & Submission ---
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
                login(data.access_token, { 
                    id: data.user_id, 
                    username: data.username, 
                    role: data.role 
                });
                
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
            return alert("Please fill in ALL fields.");
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
                setStage('OTP_VERIFY'); 
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

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: sellerIdentity.email, otp_code: otpCode })
            });
            const data = await res.json();
            if (res.ok) {
                login(data.access_token, { id: data.user_id, username: data.username, role: data.role });
                if (onLoginSuccess) onLoginSuccess(data.access_token);
                setStage('WIZARD'); 
            } else { alert(data.detail || "Verification failed"); }
        } catch (err) { alert("Connection Error"); } finally { setLoading(false); }
    };

    const calculatePricing = () => {
        const base = parseFloat(listingType === 'RENT' ? formData.dailyRate : formData.price) || 0;
        const commission = base * COMMISSION_RATES[listingType];
        const vat = base * VAT_RATE;
        const finalPrice = base + vat;
        return { base, commission, vat, finalPrice };
    };

    const pricingBreakdown = calculatePricing();

    // --- UPDATED: The Supabase Processing Loop ---
    const handleSubmitListing = async () => { 
        setLoading(true); 
        
        const token = localStorage.getItem('dagiv_seller_token');
        if (!token) {
            alert("Authentication Error: You are not logged in. Please log in to list items.");
            setLoading(false);
            return;
        }

        try { 
            // 1. Upload Images to Supabase
            const uploadedImages: string[] = [];
            for (const item of formData.images) {
                if (typeof item === 'string') {
                    uploadedImages.push(item); // Already a URL
                } else {
                    const url = await uploadImageToSupabase(item);
                    uploadedImages.push(url);
                }
            }

            // 2. Upload Videos to Supabase
            const uploadedVideos: string[] = [];
            for (const item of formData.videos) {
                if (typeof item === 'string') {
                    uploadedVideos.push(item);
                } else {
                    const url = await uploadImageToSupabase(item);
                    uploadedVideos.push(url);
                }
            }

            // 3. Upload Compliance Docs to Supabase
            const uploadedDocs: string[] = [];
            for (const item of formData.complianceDocs) {
                if (typeof item === 'string') {
                    uploadedDocs.push(item);
                } else {
                    const url = await uploadImageToSupabase(item);
                    uploadedDocs.push(url);
                }
            }

            // 4. Construct lightweight JSON payload
            const payload = { 
                listingType, 
                title: formData.listingTitle, 
                sellerName: sellerIdentity.name || "Seller", 
                phone: sellerIdentity.phone || "0000000000", 
                location: formData.city || sellerIdentity.location || "Kenya", 
                category: formData.category, 
                subCategory: formData.subCategory, 
                brand: formData.brand, 
                model: formData.model, 
                price: pricingBreakdown.base, 
                currency: formData.currency, 
                specs: { 
                    ...formData,
                    images: uploadedImages,
                    videos: uploadedVideos,
                    complianceDocs: uploadedDocs
                } 
            }; 
            
            const endpoint = editData 
                ? `${API_URL}/api/marketplace/edit/${editData.id}` 
                : `${API_URL}/api/marketplace/submit`;
            
            const method = editData ? 'PUT' : 'POST';

            const res = await fetch(endpoint, { 
                method: method, 
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
                alert(`Backend Rejected: ${err.detail || "Unknown Error"}`);
            }
        } catch (err: any) { 
            console.error("Submission Error Pipeline:", err);
            // ⚡ This will now show you the EXACT error (e.g., Supabase upload failed, Network Error, etc.)
            alert(`Process Failed: ${err.message || err.toString()}`); 
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
                    
                    <button onClick={onClose} aria-label="Close Modal" className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>

                    <button onClick={() => setStage('WELCOME')} aria-label="Go Back" className="absolute top-4 left-4 text-slate-500 hover:text-white"><ChevronRight size={20} className="rotate-180"/></button>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Dashboard Login</h2>
                    <div className="space-y-4">
                        <input aria-label="Email Address" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Email Address" 
                            value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
                        
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                aria-label="Password"
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
                    
                    <button onClick={onClose} aria-label="Close Modal" className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>

                    <button onClick={() => setStage('WELCOME')} aria-label="Go Back" className="absolute top-4 left-4 text-slate-500"><ChevronRight size={20} className="rotate-180"/></button>
                    <h2 className="text-2xl font-bold text-white mb-2">Seller Identification</h2>
                    <input aria-label="Phone Number" className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white text-center text-lg font-bold tracking-widest mb-4 mt-6" placeholder="07XX XXX XXX" value={sellerIdentity.phone} onChange={(e) => setSellerIdentity({...sellerIdentity, phone: e.target.value})} />
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
                    
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                        <div><h2 className="text-xl font-bold text-white">Seller Verification</h2><p className="text-xs text-slate-400">Step 1 of 1: Identity Proof</p></div>
                        <button onClick={onClose} aria-label="Close Modal" className="p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors"><X size={20}/></button>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                        <input aria-label="Primary Document" type="file" ref={docPrimaryRef} hidden onChange={(e) => handleFileSelect(e, 'doc_primary')} accept="image/*,.pdf" />
                        <input aria-label="Secondary Document" type="file" ref={docSecondaryRef} hidden onChange={(e) => handleFileSelect(e, 'doc_secondary')} accept="image/*,.pdf" />
                        <input aria-label="Proof Document" type="file" ref={docProofRef} hidden onChange={(e) => handleFileSelect(e, 'doc_proof')} accept="image/*,.pdf" />
                        
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
                                <input aria-label={sellerIdentity.businessType === 'Company' ? "Company Name" : "Full Name"} className="bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder={sellerIdentity.businessType === 'Company' ? "Company Name" : "Full Name"} onChange={e => setSellerIdentity({...sellerIdentity, name: e.target.value})} />
                                <input aria-label="Email Address" className="bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Email Address" onChange={e => setSellerIdentity({...sellerIdentity, email: e.target.value})} />
                            </div>

                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    aria-label="Create Password"
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

                            <input aria-label="Physical Address" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" placeholder="Physical Address / Yard Location" onChange={e => setSellerIdentity({...sellerIdentity, location: e.target.value})} />
                            
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
                                <input aria-label={sellerIdentity.businessType === 'Company' ? 'Registration Number' : 'National ID'} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white font-mono tracking-wide" placeholder={sellerIdentity.businessType === 'Company' ? "P051..." : "12345678"} onChange={e => setSellerIdentity({...sellerIdentity, regNumber: e.target.value})} />
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

    // --- VIEW 4.5: OTP VERIFICATION ---
    if (stage === 'OTP_VERIFY') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl relative">
                    <button onClick={onClose} aria-label="Close Modal" className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-slate-800 rounded-full text-white transition-colors"><X size={20} /></button>
                    <ShieldCheck size={48} className="text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Verify Your Account</h2>
                    <p className="text-slate-400 text-sm mb-6">We've sent a 6-digit code to {sellerIdentity.email}</p>
                    <input aria-label="OTP Code" className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white text-center text-3xl tracking-[1em] font-mono mb-4" placeholder="••••••" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                    <button onClick={handleVerifyOtp} disabled={loading || otpCode.length !== 6} className="w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50">
                        {loading ? <RefreshCw className="animate-spin mx-auto"/> : "Verify & Enter Dashboard"}
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'WIZARD') {
        return (
            <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                <style>{`
                    input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                    .custom-select { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 0.7rem top 50%; background-size: 0.65rem auto; }
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 10px; }
                `}</style>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[90vh]">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl shrink-0">
                        <div className="flex items-center gap-2"><BadgeCheck size={18} className="text-green-500"/><span className="text-white font-bold">{editData ? 'Edit Listing' : 'New Listing'}</span></div>
                        <button onClick={onClose} aria-label="Close Modal"><X className="text-slate-500 hover:text-white"/></button>
                    </div>

                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                        
                        {/* STEP 1: SERVICE TYPE */}
                        {step === 1 && !editData && (
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
                                                {subCategories.map((sc: any) => <option key={sc} value={sc}>{sc}</option>)}
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

                                <div className="pt-4 border-t border-slate-800">
                                    <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center"><MapPin size={16} className="mr-2"/> Location</h4>
                                    
                                    <div className="relative group mb-4">
                                        <label className="text-xs text-slate-500 font-bold block mb-1">Specific Address / Location</label>
                                        <div className="relative">
                                            {isLoaded ? (
                                                <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
                                                    <input 
                                                        aria-label="Search Address" 
                                                        className="w-full bg-slate-950 border border-slate-700 p-3 pr-14 rounded text-white focus:border-yellow-500 outline-none transition-all shadow-inner" 
                                                        placeholder="Start typing address or click map pin..."
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                    />
                                                </Autocomplete>
                                            ) : (
                                                <input aria-label="Search Address" disabled placeholder="Loading Maps..." className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-slate-500" />
                                            )}
                                            
                                            <button 
                                                type="button"
                                                onClick={() => setMapModalOpen(true)}
                                                className="absolute right-2 top-1.5 text-slate-400 hover:text-yellow-500 transition-colors p-1.5 bg-slate-900 border border-slate-800 rounded shadow-md"
                                                title="Pick from Map"
                                                aria-label="Pick location from interactive map"
                                            >
                                                <MapPin size={18}/>
                                            </button>
                                        </div>
                                        <p className="text-xs text-yellow-500/80 mt-2 flex items-center cursor-pointer hover:text-yellow-400 w-fit font-medium transition-colors" onClick={() => setMapModalOpen(true)}>
                                            <MapPin size={12} className="mr-1"/> Open interactive map to drop a pin
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div><label className="text-xs text-slate-500 block mb-1">Country</label><input aria-label="Country" disabled className="w-full bg-slate-900 border border-slate-800 p-3 rounded text-slate-400" value={formData.country} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">Region / State</label><input aria-label="Region or State" disabled className="w-full bg-slate-900 border border-slate-800 p-3 rounded text-slate-400" value={formData.region} /></div>
                                        <div><label className="text-xs text-slate-500 block mb-1">City / Town</label><input aria-label="City or Town" disabled className="w-full bg-slate-900 border border-slate-800 p-3 rounded text-slate-400" value={formData.city} /></div>
                                    </div>
                                    {listingType === 'RENT' && (
                                        <div className="mt-4"><label className="text-xs text-slate-500 block mb-1">Availability Start Date</label><input aria-label="Availability Start Date" type="date" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white" value={formData.availabilityDate} onChange={e => setFormData({...formData, availabilityDate: e.target.value})} /></div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: TECHNICAL SPECS & PRICING */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4">
                                
                                <div>
                                    <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-wider border-b border-yellow-500/30 pb-2 mb-4">
                                        Dynamic Machine Specifications
                                    </h4>
                                    
                                    {/* 🚀 THE SCHEMA ENGINE IN ACTION */}
                                    <DynamicFieldEngine 
                                      listingType={listingType} 
                                      subCategory={formData.subCategory} 
                                      formData={formData} 
                                      setFormData={setFormData} 
                                    />
                                </div>

                                {/* BASE PRICING FOR SALE OR PART (Rent is handled in the engine fields) */}
                                {listingType !== 'RENT' && (
                                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                                      <h4 className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center"><DollarSign size={16} className="mr-2"/> Outright Base Pricing</h4>
                                      
                                      <div className="flex gap-4 items-end mb-6">
                                          <div className="w-1/3">
                                              <label className="text-xs text-slate-500 block mb-1">Currency</label>
                                              <select aria-label="Currency" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-bold custom-select" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                                                  {WORLD_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                              </select>
                                          </div>
                                          <div className="flex-1">
                                              <label className="text-xs text-slate-500 block mb-1">Total Asking Price (Without Fees)</label>
                                              <input aria-label="Base Price" type="number" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-bold text-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                          </div>
                                      </div>
                                  </div>
                                )}

                                {/* TRANSPARENT ESCROW PREVIEW */}
                                <div className="bg-blue-900/10 border border-blue-900/50 p-4 rounded-lg">
                                    <div className="flex items-center text-blue-400 font-bold mb-2 text-sm"><Info size={16} className="mr-2"/> Platform Pricing Breakdown</div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-slate-400"><span>Your Setup Price ({listingType === 'RENT' ? 'Daily' : 'Total'}):</span> <span>{formData.currency} {pricingBreakdown.base.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                        <div className="flex justify-between text-slate-400"><span>Platform Escrow/Comm ({(COMMISSION_RATES[listingType]*100).toFixed(0)}% Deducted later):</span> <span className="text-red-400">- {formData.currency} {pricingBreakdown.commission.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                        <div className="flex justify-between text-slate-400"><span>VAT ({(VAT_RATE*100).toFixed(0)}% added on top):</span> <span>+ {formData.currency} {pricingBreakdown.vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                        <div className="border-t border-slate-700 my-2 pt-2 flex justify-between text-white font-bold text-lg">
                                            <span>Final Displayed {listingType === 'RENT' ? 'Daily Rate' : 'Price'}:</span> <span>{formData.currency} {pricingBreakdown.finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {(listingType === 'SALE' || listingType === 'PART') && (
                                    <div className="flex items-center mt-4">
                                        <input type="checkbox" id="por" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-yellow-500 focus:ring-yellow-500" checked={formData.priceOnRequest} onChange={e => setFormData({...formData, priceOnRequest: e.target.checked})} />
                                        <label htmlFor="por" className="ml-2 text-sm text-slate-300">Price on Request (Hide Price from Public View)</label>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 4: MEDIA, DOCS & EXTRAS */}
                        {step === 4 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4">
                                <div>
                                    <h4 className="text-white font-bold mb-4 flex items-center"><Camera className="mr-2 text-yellow-500"/> Media Gallery</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:bg-slate-900 transition-colors">
                                            <input type="file" multiple id="listingImages" hidden onChange={(e) => handleFileSelect(e, null, true, 'images')} accept="image/*" />
                                            <label htmlFor="listingImages" className="cursor-pointer block">
                                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2"><Camera size={24} className="text-slate-400"/></div>
                                                <span className="text-white font-bold text-sm block">Upload Photos *</span>
                                                <span className="text-xs text-slate-500">Min 1 required. Max 10.</span>
                                            </label>
                                            {/* --- UPDATED: Safe object URL rendering for raw Files --- */}
                                            {formData.images.length > 0 && (
                                              <div className="mt-4 grid grid-cols-4 gap-2">
                                                {formData.images.slice(0,4).map((item: string | File, i: number) => (
                                                  <img 
                                                    key={i} 
                                                    src={typeof item === 'string' ? item : URL.createObjectURL(item as File)} 
                                                    alt={`Uploaded ${i}`} 
                                                    className="h-12 w-full object-cover rounded border border-slate-700" 
                                                  />
                                                ))}
                                              </div>
                                            )}
                                        </div>
                                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:bg-slate-900 transition-colors">
                                            <input aria-label="Upload Video" type="file" ref={mediaVideoRef} hidden onChange={(e) => handleFileSelect(e, null, true, 'videos')} accept="video/*" />
                                            <button onClick={() => mediaVideoRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2"><Video size={24} className="text-slate-400"/></div>
                                                <span className="text-white font-bold text-sm block">Add Video (Optional)</span>
                                                <span className="text-xs text-slate-500">Walkthroughs increase trust.</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white font-bold mb-4 flex items-center"><FileText className="mr-2 text-blue-500"/> Documentation</h4>
                                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-white">Compliance & Manuals</div>
                                            <div className="text-xs text-slate-500">Upload service history, logbooks, or specs (PDF).</div>
                                        </div>
                                        <input aria-label="Upload Compliance Document" type="file" ref={mediaDocRef} hidden accept=".pdf" onChange={(e) => handleFileSelect(e, null, true, 'complianceDocs')} />
                                        <button onClick={() => mediaDocRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center"><UploadCloud size={14} className="mr-2"/> Upload PDF</button>
                                    </div>
                                    {formData.complianceDocs.length > 0 && <div className="mt-2 text-xs text-green-500 flex items-center"><Check size={12} className="mr-1"/> {formData.complianceDocs.length} Document(s) Attached</div>}
                                </div>

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
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {editData ? "Listing Updated!" : "Listing Published!"}
                                </h2>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                    {editData 
                                        ? "Your changes have been saved and applied to the marketplace." 
                                        : (sellerIdentity.status === 'VERIFIED' ? "Your verified listing is now LIVE on the marketplace." : "Your listing has been submitted for engineering review.")}
                                </p>
                                <button onClick={onClose} className="bg-slate-800 text-white font-bold py-4 px-12 rounded-xl hover:bg-slate-700 border border-slate-700">Return to Dashboard</button>
                            </div>
                        )}
                    </div>

                    {/* FOOTER NAV */}
                    {step < 5 && (
                        <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-950 rounded-b-2xl shrink-0">
                            {(editData ? step > 2 : step > 1) ? <button onClick={() => setStep(step-1)} className="text-slate-400 font-bold px-6 hover:text-white transition-colors">Back</button> : <div></div>}
                            {step < 4 ? (
                                <button onClick={() => setStep(step+1)} disabled={!isStepValid()} className="bg-white text-slate-900 font-bold py-3 px-8 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next Step</button>
                            ) : (
                                <button onClick={handleSubmitListing} disabled={loading || !isStepValid()} className="bg-yellow-500 text-slate-900 font-bold py-3 px-8 rounded hover:bg-yellow-400 shadow-lg disabled:opacity-50 transition-colors flex items-center">{loading ? <RefreshCw className="animate-spin mr-2"/> : <CheckCircle className="mr-2"/>} {editData ? 'Save Changes' : 'Publish Listing'}</button>
                            )}
                        </div>
                    )}
                </div>
                
                {/* --- GOOGLE MAPS PINPOINT MODAL --- */}
                {isMapModalOpen && (
                    <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                                <h3 className="text-white font-bold flex items-center"><MapPin className="text-yellow-500 mr-2"/> Pinpoint Equipment Location</h3>
                                
                                <button 
                                    onClick={() => setMapModalOpen(false)} 
                                    aria-label="Close map modal"
                                    title="Close map modal"
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={20}/>
                                </button>
                            </div>
                            
                            <div className="flex-1 relative bg-slate-800">
                                {!isLoaded ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                                        <Loader2 className="animate-spin text-yellow-500 mb-2" size={32}/>
                                        <span>Loading Map Engine...</span>
                                    </div>
                                ) : (
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        center={mapMarker || { lat: -0.3031, lng: 36.0800 }} 
                                        zoom={13}
                                        onClick={handleMapClick}
                                        options={{ 
                                            mapTypeControl: false, 
                                            streetViewControl: false,
                                            styles: [ 
                                              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                              { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                                              { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                                              { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                                              { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
                                              { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
                                              { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
                                              { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
                                              { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                                              { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
                                              { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
                                            ]
                                        }}
                                    >
                                        {mapMarker && <Marker position={mapMarker} />}
                                    </GoogleMap>
                                )}
                                
                                {!mapMarker && isLoaded && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-slate-700 animate-pulse pointer-events-none">
                                        Click anywhere on the map to drop a pin
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
                                <button 
                                    onClick={() => setMapModalOpen(false)} 
                                    className="px-6 py-2 rounded-lg font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmLocation} 
                                    disabled={!mapMarker || geocoding} 
                                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded-lg font-bold flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {geocoding ? <Loader2 className="animate-spin mr-2" size={18}/> : <CheckCircle className="mr-2" size={18}/>}
                                    Confirm Location
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        );
    }
    return null; 
};