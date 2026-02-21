import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ShieldCheck, Truck, CreditCard, Building, Smartphone, 
  ChevronRight, Lock, Loader2, MapPin, CheckCircle, Copy, AlertCircle, X
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- Zod Validation Schema for Shipping ---
const shippingSchema = z.object({
  firstName: z.string().min(2, { message: "First Name is required" }),
  lastName: z.string().min(2, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().regex(/^(07|01|\+2547|\+2541)[0-9]{8}$/, { message: "Invalid Kenyan phone number (e.g., 0712345678)" }),
  region: z.string().min(2, { message: "Region/County is required" }),
  city: z.string().min(2, { message: "City/Town is required" }),
  address: z.string().min(5, { message: "Specific Address/Plot No. is required" }),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export default function Checkout() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    
    // Cart & Order Data
    const [cart, setCart] = useState<any>({ items: [], summary: { total_value: 0, currency: 'KES' } });
    const [orderResult, setOrderResult] = useState<any>(null);

    // Form Handling
    const { register, handleSubmit, formState: { errors, isValid, touchedFields }, trigger, getValues } = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
        mode: 'onChange' 
    });

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'CARD' | 'BANK'>('MPESA');
    const [mpesaPhone, setMpesaPhone] = useState('');

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('dagiv_seller_token') || localStorage.getItem('dagiv_token');
            if (!token) {
                navigate('/marketplace');
                return;
            }
            try {
                const res = await fetch(`${API_URL}/api/cart`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (!data.items || data.items.length === 0) {
                        navigate('/marketplace'); 
                    } else {
                        setCart(data);
                    }
                }
            } catch (err) {
                console.error("Cart fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const handleContinueToPayment = async () => {
        const isFormValid = await trigger(); 
        if (isFormValid) {
            setStep(2);
            window.scrollTo(0, 0);
        }
    };

    const handlePlaceOrder = async () => {
        // Updated Regex: strictly checks for exactly 9 digits starting with 7 or 1
        if (paymentMethod === 'MPESA' && !/^(7|1)[0-9]{8}$/.test(mpesaPhone)) {
            alert("Please enter a valid 9-digit M-Pesa number (e.g., 712345678)");
            return;
        }
        
        setProcessing(true);
        const token = localStorage.getItem('dagiv_seller_token') || localStorage.getItem('dagiv_token');
        const shippingData = getValues(); 
        
        // Format the phone number perfectly for Safaricom Daraja API
        const formattedMpesaPhone = paymentMethod === 'MPESA' ? `254${mpesaPhone}` : null;

        try {
            const res = await fetch(`${API_URL}/api/checkout/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    payment_method: paymentMethod,
                    mpesa_phone: formattedMpesaPhone, // Send the fully formatted number
                    shipping_details: shippingData
                })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setOrderResult(data);
                setStep(3);
                window.dispatchEvent(new Event('cartUpdated'));
                window.scrollTo(0, 0);
            } else {
                alert(data.detail || "Failed to process checkout.");
            }
        } catch (e) {
            alert("Connection error. Ensure the server is running.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-yellow-500">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold tracking-widest text-slate-300">PREPARING SECURE CHECKOUT...</p>
            </div>
        );
    }

    const subtotal = cart.summary?.total_value || 0;
    const shippingCost = 0.0; 
    const total = subtotal + shippingCost;
    const currency = cart.summary?.currency || 'KES';

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-4">
                
                {/* PROGRESS HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white flex items-center mb-6">
                        <Lock className="mr-3 text-yellow-500" /> Secure Checkout
                    </h1>
                    {/* Progress Bar */}
                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`absolute top-0 left-0 h-full bg-yellow-500 transition-all duration-500 ease-out ${
                                step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
                            }`}
                        ></div>
                    </div>
                    {/* Steps */}
                    <div className="flex justify-between text-sm font-bold text-slate-500 mt-3">
                        <div className={`flex items-center ${step >= 1 ? 'text-yellow-500' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 1 ? 'border-yellow-500 bg-yellow-500 text-slate-900' : 'border-slate-700 bg-slate-900'}`}>
                                {step > 1 ? <CheckCircle size={18}/> : '1'}
                            </div>
                            Shipping Address
                        </div>
                        <div className={`flex items-center ${step >= 2 ? 'text-yellow-500' : ''}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 2 ? 'border-yellow-500 bg-yellow-500 text-slate-900' : 'border-slate-700 bg-slate-900'}`}>
                                {step > 2 ? <CheckCircle size={18}/> : '2'}
                            </div>
                            Payment Method
                        </div>
                        <div className={`flex items-center ${step === 3 ? 'text-green-500' : ''}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step === 3 ? 'border-green-500 bg-green-500 text-white' : 'border-slate-700 bg-slate-900'}`}>
                                3
                            </div>
                            Confirmation
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 relative">
                    
                    {/* LEFT COLUMN: FORMS & SUCCESS */}
                    <div className="flex-1 space-y-8">
                        
                        {/* STEP 1: SHIPPING & CONTACT */}
{step === 1 && (
    <div className="bg-slate-900 rounded-2xl border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)] overflow-hidden animate-in fade-in slide-in-from-left-4">
        <div className="bg-slate-950 p-6 border-b border-slate-800">
            <h2 className="text-xl font-black text-white flex items-center tracking-wide">
                <Truck className="mr-3 text-yellow-500" size={24}/> Delivery Details
            </h2>
            <p className="text-sm text-slate-400 mt-2 ml-9">Where should we deliver your item?</p>
        </div>
        
        <form className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="relative group">
                    <input 
                        {...register('firstName')} 
                        id="firstName"
                        placeholder="e.g. John"
                        className={`peer w-full bg-slate-950 border-2 ${errors.firstName ? 'border-red-500/50 focus:border-red-500' : touchedFields.firstName && !errors.firstName ? 'border-green-500/50 focus:border-green-500' : 'border-slate-800 hover:border-slate-700 focus:border-yellow-500'} px-4 pt-7 pb-2.5 rounded-xl text-white outline-none transition-all shadow-inner`}
                    />
                    <label htmlFor="firstName" className={`absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider transition-colors pointer-events-none ${errors.firstName ? 'text-red-400' : touchedFields.firstName && !errors.firstName ? 'text-green-400' : 'text-slate-500 group-focus-within:text-yellow-500'}`}>
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="absolute right-4 top-4 pointer-events-none">
                        {errors.firstName ? <AlertCircle size={20} className="text-red-500 animate-in zoom-in"/> : touchedFields.firstName && !errors.firstName ? <CheckCircle size={20} className="text-green-500 animate-in zoom-in"/> : null}
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1.5 flex items-start animate-in fade-in slide-in-from-top-1"><AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0"/>{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div className="relative group">
                    <input 
                        {...register('lastName')} 
                        id="lastName"
                        placeholder="e.g. Doe"
                        className={`peer w-full bg-slate-950 border-2 ${errors.lastName ? 'border-red-500/50 focus:border-red-500' : touchedFields.lastName && !errors.lastName ? 'border-green-500/50 focus:border-green-500' : 'border-slate-800 hover:border-slate-700 focus:border-yellow-500'} px-4 pt-7 pb-2.5 rounded-xl text-white outline-none transition-all shadow-inner`}
                    />
                    <label htmlFor="lastName" className={`absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider transition-colors pointer-events-none ${errors.lastName ? 'text-red-400' : touchedFields.lastName && !errors.lastName ? 'text-green-400' : 'text-slate-500 group-focus-within:text-yellow-500'}`}>
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="absolute right-4 top-4 pointer-events-none">
                        {errors.lastName ? <AlertCircle size={20} className="text-red-500 animate-in zoom-in"/> : touchedFields.lastName && !errors.lastName ? <CheckCircle size={20} className="text-green-500 animate-in zoom-in"/> : null}
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1.5 flex items-start animate-in fade-in slide-in-from-top-1"><AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0"/>{errors.lastName.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="relative group">
                    <input 
                        {...register('email')} 
                        type="email"
                        id="email"
                        placeholder="john@company.com"
                        className={`peer w-full bg-slate-950 border-2 ${errors.email ? 'border-red-500/50 focus:border-red-500' : touchedFields.email && !errors.email ? 'border-green-500/50 focus:border-green-500' : 'border-slate-800 hover:border-slate-700 focus:border-yellow-500'} px-4 pt-7 pb-2.5 rounded-xl text-white outline-none transition-all shadow-inner`}
                    />
                    <label htmlFor="email" className={`absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider transition-colors pointer-events-none ${errors.email ? 'text-red-400' : touchedFields.email && !errors.email ? 'text-green-400' : 'text-slate-500 group-focus-within:text-yellow-500'}`}>
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="absolute right-4 top-4 pointer-events-none">
                        {errors.email ? <AlertCircle size={20} className="text-red-500 animate-in zoom-in"/> : touchedFields.email && !errors.email ? <CheckCircle size={20} className="text-green-500 animate-in zoom-in"/> : null}
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-start animate-in fade-in slide-in-from-top-1"><AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0"/>{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="relative group">
                    <input 
                        {...register('phone')} 
                        type="tel"
                        id="phone"
                        placeholder="07XX XXX XXX"
                        className={`peer w-full bg-slate-950 border-2 ${errors.phone ? 'border-red-500/50 focus:border-red-500' : touchedFields.phone && !errors.phone ? 'border-green-500/50 focus:border-green-500' : 'border-slate-800 hover:border-slate-700 focus:border-yellow-500'} px-4 pt-7 pb-2.5 rounded-xl text-white outline-none transition-all shadow-inner font-mono`}
                    />
                    <label htmlFor="phone" className={`absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider transition-colors pointer-events-none ${errors.phone ? 'text-red-400' : touchedFields.phone && !errors.phone ? 'text-green-400' : 'text-slate-500 group-focus-within:text-yellow-500'}`}>
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="absolute right-4 top-4 pointer-events-none">
                        {errors.phone ? <AlertCircle size={20} className="text-red-500 animate-in zoom-in"/> : touchedFields.phone && !errors.phone ? <CheckCircle size={20} className="text-green-500 animate-in zoom-in"/> : null}
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 flex items-start animate-in fade-in slide-in-from-top-1"><AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0"/>{errors.phone.message}</p>}
                </div>
            </div>

            <div className="border-t border-slate-800 pt-8 mt-4">
                <h3 className="text-sm font-black text-white mb-6 flex items-center tracking-widest uppercase">
                    <MapPin size={18} className="mr-2 text-yellow-500"/> Site / Yard Location
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Region */}
                    <div className="relative group">
                        <input 
                            {...register('region')} 
                            id="region"
                            placeholder="e.g. Nairobi"
                            className={`peer w-full bg-slate-950 border-2 ${errors.region ? 'border-red-500/50 focus:border-red-500' : touchedFields.region && !errors.region ? 'border-green-500/50 focus:border-green-500' : 'border-slate-800 hover:border-slate-700 focus:border-yellow-500'} px-4 pt-7 pb-2.5 rounded-xl text-white outline-none transition-all shadow-inner`}
                        />
                        <label htmlFor="region" className={`absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider transition-colors pointer-events-none ${errors.region ? 'text-red-400' : touchedFields.region && !errors.region ? 'text-green-400' : 'text-slate-500 group-focus-within:text-yellow-500'}`}>
                            Region / County <span className="text-red-500">*</span>
                        </label>
                        <div className="absolute right-4 top-4 pointer-events-none">
                            {errors.region ? <AlertCircle size={20} className="text-red-500 animate-in zoom-in"/> : touchedFields.region && !errors.region ? <CheckCircle size={20} className="text-green-500 animate-in zoom-in"/> : null}
                        </div>
                        {errors.region && <p className="text-red-500 text-xs mt-1.5 flex items-start animate-in fade-in slide-in-from-top-1"><AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0"/>{errors.region.message}</p>}
                    </div>

                    {/* City */}
                    <div className="relative group">
                        <input 
                            {...register('city')} 
                            id="city"
                            placeholder="e.g. Industrial Area"
                            className={`peer w-full bg-slate-950 border-2 ${errors.city ? 'border-red-500/50 focus:border-red-500' : touchedFields.city && !errors.city ? 'border-green-500/50 focus:border-green-500' : 'border-slate-800 hover:border-slate-700 focus:border-yellow-500'} px-4 pt-7 pb-2.5 rounded-xl text-white outline-none transition-all shadow-inner`}
                        />
                        <label htmlFor="city" className={`absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider transition-colors pointer-events-none ${errors.city ? 'text-red-400' : touchedFields.city && !errors.city ? 'text-green-400' : 'text-slate-500 group-focus-within:text-yellow-500'}`}>
                            City / Town <span className="text-red-500">*</span>
                        </label>
                        <div className="absolute right-4 top-4 pointer-events-none">
                            {errors.city ? <AlertCircle size={20} className="text-red-500 animate-in zoom-in"/> : touchedFields.city && !errors.city ? <CheckCircle size={20} className="text-green-500 animate-in zoom-in"/> : null}
                        </div>
                        {errors.city && <p className="text-red-500 text-xs mt-1.5 flex items-start animate-in fade-in slide-in-from-top-1"><AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0"/>{errors.city.message}</p>}
                    </div>
                </div>

                {/* Address */}
                <div className="relative group">
                    <input 
                        {...register('address')} 
                        id="address"
                        placeholder="Street name, building, warehouse number..."
                        className={`peer w-full bg-slate-950 border-2 ${errors.address ? 'border-red-500/50 focus:border-red-500' : touchedFields.address && !errors.address ? 'border-green-500/50 focus:border-green-500' : 'border-slate-800 hover:border-slate-700 focus:border-yellow-500'} px-4 pt-7 pb-2.5 rounded-xl text-white outline-none transition-all shadow-inner`}
                    />
                    <label htmlFor="address" className={`absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider transition-colors pointer-events-none ${errors.address ? 'text-red-400' : touchedFields.address && !errors.address ? 'text-green-400' : 'text-slate-500 group-focus-within:text-yellow-500'}`}>
                        Specific Address / Plot No. <span className="text-red-500">*</span>
                    </label>
                    <div className="absolute right-4 top-4 pointer-events-none">
                        {errors.address ? <AlertCircle size={20} className="text-red-500 animate-in zoom-in"/> : touchedFields.address && !errors.address ? <CheckCircle size={20} className="text-green-500 animate-in zoom-in"/> : null}
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1.5 flex items-start animate-in fade-in slide-in-from-top-1"><AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0"/>{errors.address.message}</p>}
                </div>
            </div>
            
            <div className="pt-4">
                <button 
                    type="button"
                    onClick={handleContinueToPayment}
                    disabled={!isValid}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-950 font-black py-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(234,179,8,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center tracking-wide text-lg"
                >
                    CONTINUE TO PAYMENT <ChevronRight size={22} className="ml-2"/>
                </button>
            </div>
        </form>
    </div>
)}

                       {/* STEP 2: PAYMENT METHOD */}
                        {step === 2 && (
                            <div className="bg-slate-900 rounded-2xl border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all overflow-hidden animate-in fade-in slide-in-from-right-4">
                                <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-white flex items-center"><CreditCard className="mr-2 text-yellow-500" size={20}/> Payment Method</h2>
                                    <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white underline transition-colors">Edit Shipping</button>
                                </div>
                                
                                <div className="p-6 space-y-5">
                                    {/* TRUST BADGE */}
                                    <div className="bg-gradient-to-r from-blue-900/30 to-slate-900 border border-blue-500/30 p-4 rounded-xl flex items-center mb-8 shadow-inner">
                                        <div className="bg-blue-500/20 p-2 rounded-full mr-4 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                            <ShieldCheck className="text-blue-400" size={28}/>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-sm tracking-wide">DAGIV Escrow Protection</h4>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Your payment is encrypted and held securely. The seller only receives funds once you inspect and accept the machinery.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 relative">
                                        
                                        {/* --- 1. M-PESA CARD --- */}
                                        <div 
                                            onClick={() => setPaymentMethod('MPESA')}
                                            className={`relative overflow-hidden block border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'MPESA' ? 'border-green-500 bg-gradient-to-br from-green-900/20 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-green-500' : 'border-slate-800 hover:border-slate-600 bg-slate-900/50'}`}
                                        >
                                            <div className="absolute top-0 right-0 bg-green-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-widest shadow-md">
                                                Fastest
                                            </div>
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${paymentMethod === 'MPESA' ? 'border-green-500' : 'border-slate-600'}`}>
                                                    {paymentMethod === 'MPESA' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-in zoom-in"></div>}
                                                </div>
                                                <div className="h-10 w-16 bg-white rounded shadow-md flex items-center justify-center p-1 border border-slate-200 shrink-0">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="max-h-full object-contain"/>
                                                </div>
                                                <div className="flex-1 ml-4">
                                                    <div className={`font-black text-lg transition-colors ${paymentMethod === 'MPESA' ? 'text-green-400' : 'text-white'}`}>M-Pesa Express</div>
                                                    <div className="text-xs text-slate-400">Instant STK Push to your phone</div>
                                                </div>
                                            </div>
                                            
                                            <div className={`grid transition-all duration-300 ease-in-out ${paymentMethod === 'MPESA' ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'}`}>
                                                <div className="overflow-hidden">
                                                    <div className="ml-9 pl-5 border-l-2 border-slate-800 space-y-2">
                                                        <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider">M-Pesa Number</label>
                                                        <div className="relative flex items-center group">
    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-24 bg-slate-900 rounded-l-lg border border-slate-700 group-focus-within:border-green-500 transition-colors shadow-inner z-10 px-3">
        {/* SVG Flag ensures it renders perfectly on Windows, Mac, and Mobile */}
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg" 
            alt="KE" 
            className="w-5 h-auto mr-2 rounded-[2px] shadow-sm object-cover" 
        />
        <span className="text-slate-300 font-mono text-sm font-bold">+254</span>
    </div>
    <input 
        type="tel" 
        placeholder="7XX XXX XXX" 
        value={mpesaPhone} 
        onChange={(e) => {
            // Senior UX: Auto-clean the input. If user pastes "0712...", it strips the "0" automatically!
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.startsWith('254')) val = val.substring(3);
            if (val.startsWith('0')) val = val.substring(1);
            setMpesaPhone(val);
        }} 
        maxLength={9} // Prevents typing too many numbers
        className="w-full bg-slate-950 border border-slate-700 pl-28 p-3.5 rounded-lg text-white font-mono text-lg tracking-widest focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all shadow-inner relative"
    />
</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* --- 2. CARD PAYMENT CARD --- */}
                                        <div 
                                            onClick={() => setPaymentMethod('CARD')}
                                            className={`relative overflow-hidden block border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'CARD' ? 'border-purple-500 bg-gradient-to-br from-purple-900/20 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500' : 'border-slate-800 hover:border-slate-600 bg-slate-900/50'}`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${paymentMethod === 'CARD' ? 'border-purple-500' : 'border-slate-600'}`}>
                                                    {paymentMethod === 'CARD' && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-in zoom-in"></div>}
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {/* High Quality Visa SVG */}
                                                    <div className="h-10 w-14 bg-white rounded shadow-md flex items-center justify-center border border-slate-200 p-1.5">
                                                        {/* Fixed Visa Logo visibility by changing the URL */}
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/1280px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png" alt="Visa" className="h-full object-contain"/>
                                                    </div>
                                                    {/* High Quality Mastercard SVG */}
                                                    <div className="h-10 w-14 bg-white rounded shadow-md flex items-center justify-center border border-slate-200 p-1.5">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-full object-contain"/>
                                                    </div>
                                                </div>
                                                <div className="flex-1 ml-4">
                                                    <div className={`font-black text-lg transition-colors ${paymentMethod === 'CARD' ? 'text-purple-400' : 'text-white'}`}>Credit / Debit Card</div>
                                                    <div className="text-xs text-slate-400">Secure gateway via Pesapal</div>
                                                </div>
                                            </div>
                                            
                                            <div className={`grid transition-all duration-300 ease-in-out ${paymentMethod === 'CARD' ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'}`}>
                                                <div className="overflow-hidden">
                                                    <div className="ml-9 pl-5 border-l-2 border-slate-800">
                                                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-start gap-4 shadow-inner">
                                                            <Lock className="text-purple-500 shrink-0 mt-1" size={20}/>
                                                            <div>
                                                                <p className="text-sm text-white font-bold">PCI-DSS Compliant Gateway</p>
                                                                <p className="text-xs text-slate-400 mt-1">Clicking "Pay" will seamlessly open a secure gateway. DAGIV does not store your card details.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* --- 3. BANK TRANSFER CARD (KCB UI) --- */}
        <label className={`block border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${paymentMethod === 'BANK' ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500' : 'border-slate-800 hover:border-slate-600 bg-slate-950'}`}>
            <div className="flex items-center">
                <input 
                    type="radio" 
                    name="payment" 
                    value="BANK" 
                    checked={paymentMethod === 'BANK'} 
                    onChange={() => setPaymentMethod('BANK')} 
                    className="sr-only" 
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${paymentMethod === 'BANK' ? 'border-blue-500' : 'border-slate-600'}`}>
                    {paymentMethod === 'BANK' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-in zoom-in"></div>}
                </div>
                {/* KCB Logo Container Adjusted */}
                <div className="h-10 w-16 bg-white rounded shadow-md flex items-center justify-center border border-slate-200 p-1 shrink-0">
                    <img 
                        src="https://vectorseek.com/wp-content/uploads/2023/09/Kcb-Group-Plc-Logo-Vector.svg-.png" 
                        alt="KCB" 
                        className="h-full w-full object-cover scale-150 object-center" 
                    />
                </div>
                <div className="flex-1 ml-4">
                    <div className={`font-black text-lg transition-colors ${paymentMethod === 'BANK' ? 'text-blue-400' : 'text-white'}`}>Bank Transfer (KCB)</div>
                    <div className="text-xs text-slate-400">RTGS/EFT for heavy machinery</div>
                </div>
            </div>
            
            <div className={`grid transition-all duration-300 ease-in-out ${paymentMethod === 'BANK' ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="ml-9 pl-5 border-l-2 border-slate-800">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-inner">
                            <h4 className="text-white font-bold mb-5 flex items-center text-sm uppercase tracking-wider">
                                <Building size={16} className="text-blue-500 mr-2"/> KCB Payment Instructions
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Bank Name</p>
                                    <p className="text-white font-medium">KCB Bank Kenya</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Account Name</p>
                                    <p className="text-white font-medium">DAGIV Engineering Ltd</p>
                                </div>
                            </div>
                            
                            <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-2 gap-6">
                                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 shadow-sm">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Paybill Number</p>
                                    <p className="text-xl font-black text-white font-mono flex items-center justify-between">
                                        522522
                                        <button 
                                            onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText('522522'); }} 
                                            className="text-slate-500 hover:text-blue-500 transition-colors p-1" 
                                            title="Copy Paybill"
                                        >
                                            <Copy size={16}/>
                                        </button>
                                    </p>
                                </div>
                                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 shadow-sm">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Account Number</p>
                                    <p className="text-lg sm:text-xl font-black text-yellow-500 font-mono flex items-center justify-between">
                                        1280877812
                                        <button 
                                            onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText('1280877812'); }} 
                                            className="text-slate-500 hover:text-yellow-500 transition-colors p-1" 
                                            title="Copy Account No."
                                        >
                                            <Copy size={16}/>
                                        </button>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-blue-900/20 border border-blue-900/50 rounded p-3 mt-4 flex items-start">
                                <AlertCircle size={16} className="mr-2 flex-shrink-0 text-blue-400 mt-0.5"/> 
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Please use your Order ID as the transaction reference. Manual verification takes 1-2 business hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </label>

                                    </div>

                                    {/* PREMIUM PAY BUTTON (DYNAMIC) */}
    <div className="pt-6 mt-4 border-t border-slate-800">
        <button 
            onClick={handlePlaceOrder}
            disabled={processing || (paymentMethod === 'MPESA' && mpesaPhone.length < 9)}
            className={`group relative w-full overflow-hidden rounded-xl font-black py-4 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] ${
                paymentMethod === 'CARD' ? 'shadow-[0_10px_40px_-10px_rgba(168,85,247,0.5)]' : 
                paymentMethod === 'BANK' ? 'shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)]' : 
                'shadow-[0_10px_40px_-10px_rgba(34,197,94,0.5)]'
            }`}
        >
            {/* Animated Button Background - Smoothly morphs color based on selected method */}
            <div className={`absolute inset-0 bg-gradient-to-r bg-[length:200%_auto] animate-gradient transition-colors duration-500 ${
                paymentMethod === 'CARD' ? 'from-purple-600 via-fuchsia-500 to-purple-600' : 
                paymentMethod === 'BANK' ? 'from-blue-600 via-cyan-500 to-blue-600' : 
                'from-green-600 via-emerald-500 to-green-600'
            }`}></div>
            
            <div className="relative flex items-center justify-center text-white text-lg tracking-wide">
                {processing ? (
                    <>
                        <Loader2 className="animate-spin mr-3" size={24}/>
                        <span className="animate-pulse">
                            {paymentMethod === 'CARD' ? 'ESTABLISHING SECURE CONNECTION...' : 
                             paymentMethod === 'BANK' ? 'GENERATING INVOICE...' : 
                             'INITIATING STK PUSH...'}
                        </span>
                    </>
                ) : (
                    <>
                        <Lock className="mr-3 text-white/90 group-hover:scale-110 transition-transform" size={22}/>
                        <span>
                            {paymentMethod === 'CARD' ? `OPEN SECURE GATEWAY • ${currency} ${total.toLocaleString()}` : 
                             paymentMethod === 'BANK' ? `CONFIRM ORDER • ${currency} ${total.toLocaleString()}` : 
                             `SECURE PAY • ${currency} ${total.toLocaleString()}`}
                        </span>
                    </>
                )}
            </div>
        </button>
        <p className="text-center text-[11px] text-slate-500 mt-4 flex items-center justify-center font-medium">
            <Lock size={12} className="mr-1.5"/> 256-Bit SSL Encryption • Your data is safe
        </p>
    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SUCCESS & INSTRUCTIONS */}
                        {step === 3 && orderResult && orderResult.payment_info?.type !== 'CARD' && (
                            <div className="bg-slate-900 rounded-2xl border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)] p-8 text-center animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                                    <CheckCircle size={40} className="text-white"/>
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Order Secured!</h2>
                                <p className="text-slate-400 mb-8 font-medium">Order Ref: <span className="font-mono text-yellow-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">{orderResult.order_id}</span></p>

                                {/* DYNAMIC PAYMENT INSTRUCTIONS */}
                                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-left mb-8">
                                    {orderResult.payment_info.type === 'MPESA' && (
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><Smartphone size={24} className="text-green-500"/></div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg mb-1">Check Your Phone</h4>
                                                <p className="text-sm text-slate-400 leading-relaxed">{orderResult.payment_info.message}</p>
                                            </div>
                                        </div>
                                    )}
                                    {orderResult.payment_info.type === 'BANK' && (
                                        <div>
                                             <div className="flex items-center mb-4">
                                                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><Building size={24} className="text-blue-500"/></div>
                                                <h4 className="text-white font-bold text-lg">Complete Bank Transfer</h4>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-6 pl-16 leading-relaxed">{orderResult.payment_info.message}</p>
                                            
                                            <div className="pl-16 space-y-4 font-mono text-sm">
                                                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Paybill</p>
                                                        <p className="text-xl font-black text-white flex items-center justify-between">
                                                            522522
                                                            <button onClick={() => navigator.clipboard.writeText('522522')} className="text-slate-500 hover:text-white transition-colors p-1" title="Copy Paybill" aria-label="Copy Paybill"><Copy size={16}/></button>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Account No.</p>
                                                        <p className="text-xl font-black text-yellow-500 flex items-center justify-between">
                                                            1280877812
                                                            <button onClick={() => navigator.clipboard.writeText('1280877812')} className="text-slate-500 hover:text-yellow-500 transition-colors p-1" title="Copy Account No." aria-label="Copy Account Number"><Copy size={16}/></button>
                                                        </p>
                                                    </div>
                                                </div>
                                                 <p className="text-xs text-slate-400 flex items-center mt-2"><AlertCircle size={12} className="mr-1 text-blue-400"/> Use Order Ref <span className="text-white font-bold mx-1">{orderResult.order_id}</span> as payment reference.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/marketplace" className="bg-slate-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        Continue Shopping
                                    </Link>
                                    <button disabled className="bg-yellow-500/50 text-slate-900 font-bold py-3 px-8 rounded-lg cursor-not-allowed opacity-70">
                                        Track Order (Coming Soon)
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- PESAPAL IFRAME OVERLAY --- */}
{step === 3 && orderResult?.payment_info?.type === 'CARD' && orderResult.payment_info.url && (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in-95">
        <div className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl h-[85vh] flex flex-col shadow-[0_20px_70px_rgba(0,0,0,0.7)] relative border border-slate-700">
            
            {/* Professional Header */}
            <div className="bg-slate-900 p-5 flex justify-between items-center shadow-lg z-20">
                <div className="flex items-center">
                    <Lock className="text-green-500 mr-3" size={24}/>
                    <div>
                        <div className="text-white font-black tracking-widest uppercase text-sm">Pesapal Secure Gateway</div>
                        <div className="text-green-400 text-[10px] flex items-center mt-1 font-mono">
                            <ShieldCheck size={12} className="mr-1"/> PCI-DSS Compliant • 256-bit Encryption
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => window.location.href = '/marketplace'} 
                    className="text-slate-400 hover:text-white bg-slate-800 hover:bg-red-500 p-2 rounded-full transition-colors group"
                    title="Cancel Payment"
                    aria-label="Cancel Payment"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform"/>
                </button>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 w-full relative bg-slate-50 flex items-center justify-center">
                
                {/* Loading State Behind Iframe */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin mb-4 shadow-lg"></div>
                    <span className="text-sm font-bold tracking-wide">Establishing secure connection...</span>
                </div>
                
                {/* The Actual Secure Iframe */}
                <iframe 
                    src={orderResult.payment_info.url} 
                    className="absolute inset-0 w-full h-full z-10 border-0 bg-transparent"
                    title="Pesapal Secure Payment"
                    allow="payment"
                />
            </div>
        </div>
    </div>
)}

                    </div>

                    {/* RIGHT COLUMN: ORDER SUMMARY (STICKY) */}
                    {step < 3 && (
                        <div className="w-full lg:w-[400px] relative">
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 sticky top-24 shadow-xl">
                                <div className="p-6 border-b border-slate-800">
                                    <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                                    <div className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                        {cart.items.map((item: any) => (
                                            <div key={item.listing_id} className="flex gap-3 group">
                                                <div className="w-16 h-12 bg-slate-950 rounded overflow-hidden border border-slate-700 flex-shrink-0 group-hover:border-slate-500 transition-colors">
                                                    <img src={item.image} alt={item.model} className="w-full h-full object-cover"/>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.brand}</div>
                                                    <div className="text-sm font-bold text-white line-clamp-1">{item.model}</div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                                                        <span className="text-sm font-bold text-yellow-500">{currency} {item.price.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-slate-950/50 rounded-b-2xl">
                                    <div className="space-y-3 mb-6 border-b border-slate-800 pb-6">
                                        <div className="flex justify-between text-sm text-slate-400">
                                            <span>Subtotal</span>
                                            <span>{currency} {subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-400">
                                            <span>Heavy Haulage Logistics</span>
                                            <span>{currency} {shippingCost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-white font-bold">Total to Secure</span>
                                        <span className="text-3xl font-black text-white tracking-tight">{currency} {total.toLocaleString()}</span>
                                    </div>

                                    <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4 flex gap-3">
                                        <ShieldCheck className="text-blue-500 flex-shrink-0" size={24}/>
                                        <div>
                                            <div className="text-blue-500 font-bold text-sm">DAGIV Escrow Protection</div>
                                            <p className="text-xs text-slate-400 mt-1 leading-snug">Your payment is held securely in trust. The seller only receives funds once you inspect and accept the equipment.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}