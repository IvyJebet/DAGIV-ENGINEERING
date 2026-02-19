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
    const { register, handleSubmit, formState: { errors, isValid }, trigger, getValues } = useForm<ShippingFormValues>({
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
        if (paymentMethod === 'MPESA' && !/^(07|01|\+2547|\+2541)[0-9]{8}$/.test(mpesaPhone)) {
            alert("Please enter a valid M-Pesa phone number");
            return;
        }
        
        // REMOVED THE FAKE MOCK BLOCK! This will now correctly process ALL payments.
        setProcessing(true);
        const token = localStorage.getItem('dagiv_seller_token') || localStorage.getItem('dagiv_token');
        const shippingData = getValues(); 

        try {
            const res = await fetch(`${API_URL}/api/checkout/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    payment_method: paymentMethod,
                    mpesa_phone: paymentMethod === 'MPESA' ? mpesaPhone : null,
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
    const shippingCost = 15000; 
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
                            Shipping
                        </div>
                        <div className={`flex items-center ${step >= 2 ? 'text-yellow-500' : ''}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 2 ? 'border-yellow-500 bg-yellow-500 text-slate-900' : 'border-slate-700 bg-slate-900'}`}>
                                {step > 2 ? <CheckCircle size={18}/> : '2'}
                            </div>
                            Payment
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
                            <div className="bg-slate-900 rounded-2xl border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)] overflow-hidden animate-in fade-in slide-in-from-left-4">
                                <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-white flex items-center"><Truck className="mr-2 text-yellow-500" size={20}/> Delivery Details</h2>
                                </div>
                                
                                <form className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1 font-bold">First Name <span className="text-red-500">*</span></label>
                                            <input {...register('firstName')} className={`w-full bg-slate-950 border ${errors.firstName ? 'border-red-500' : 'border-slate-700'} p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors`} placeholder="John"/>
                                            {errors.firstName && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.firstName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1 font-bold">Last Name <span className="text-red-500">*</span></label>
                                            <input {...register('lastName')} className={`w-full bg-slate-950 border ${errors.lastName ? 'border-red-500' : 'border-slate-700'} p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors`} placeholder="Doe"/>
                                            {errors.lastName && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.lastName.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1 font-bold">Email Address <span className="text-red-500">*</span></label>
                                            <input type="email" {...register('email')} className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-700'} p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors`} placeholder="john@company.com"/>
                                            {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1 font-bold">Phone Number <span className="text-red-500">*</span></label>
                                            <input type="tel" {...register('phone')} className={`w-full bg-slate-950 border ${errors.phone ? 'border-red-500' : 'border-slate-700'} p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors`} placeholder="07XX XXX XXX"/>
                                            {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-800 pt-4 mt-4">
                                        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center"><MapPin size={16} className="mr-2"/> Site / Yard Location</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1 font-bold">Region / County <span className="text-red-500">*</span></label>
                                                <input {...register('region')} className={`w-full bg-slate-950 border ${errors.region ? 'border-red-500' : 'border-slate-700'} p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors`} placeholder="e.g. Nairobi"/>
                                                {errors.region && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.region.message}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1 font-bold">City / Town <span className="text-red-500">*</span></label>
                                                <input {...register('city')} className={`w-full bg-slate-950 border ${errors.city ? 'border-red-500' : 'border-slate-700'} p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors`} placeholder="e.g. Industrial Area"/>
                                                {errors.city && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.city.message}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1 font-bold">Specific Address / Plot No. <span className="text-red-500">*</span></label>
                                            <input {...register('address')} className={`w-full bg-slate-950 border ${errors.address ? 'border-red-500' : 'border-slate-700'} p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors`} placeholder="Street name, building, landmark..."/>
                                            {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/>{errors.address.message}</p>}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="button"
                                        onClick={handleContinueToPayment}
                                        disabled={!isValid}
                                        className="w-full bg-yellow-500 text-slate-900 font-black py-4 rounded-lg mt-6 hover:bg-yellow-400 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                                    >
                                        CONTINUE TO PAYMENT <ChevronRight size={20} className="ml-2"/>
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* STEP 2: PAYMENT METHOD */}
                        {step === 2 && (
                            <div className="bg-slate-900 rounded-2xl border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all overflow-hidden animate-in fade-in slide-in-from-right-4">
                                <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-white flex items-center"><CreditCard className="mr-2 text-yellow-500" size={20}/> Payment Method</h2>
                                    <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white underline">Edit Shipping</button>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-start mb-6">
                                        <ShieldCheck className="text-blue-400 flex-shrink-0 mr-3" size={24}/>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">DAGIV Escrow Protection</h4>
                                            <p className="text-xs text-slate-400 leading-relaxed">Your payment is held securely in trust. The seller only receives funds once you inspect and accept the equipment.</p>
                                        </div>
                                    </div>
                                    
                                    {/* M-PESA */}
                                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'MPESA' ? 'border-green-500 bg-green-900/10 shadow-md' : 'border-slate-700 hover:border-slate-600 bg-slate-950'}`}>
                                        <div className="flex items-center">
                                            <input type="radio" name="payment" value="MPESA" checked={paymentMethod === 'MPESA'} onChange={() => setPaymentMethod('MPESA')} className="w-5 h-5 text-green-600 bg-slate-900 border-slate-700 focus:ring-green-600"/>
                                            <div className="h-10 w-16 bg-white rounded ml-4 flex items-center justify-center p-1"><img src="/mpesa-logo.png" alt="M-Pesa" className="max-h-full object-contain"/></div>
                                            <div className="flex-1 ml-4">
                                                <div className="font-bold text-white text-lg">M-Pesa Express</div>
                                                <div className="text-xs text-slate-400">Instant STK Push to your phone</div>
                                            </div>
                                        </div>
                                        {paymentMethod === 'MPESA' && (
                                            <div className="mt-4 ml-12 animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-xs text-slate-400 mb-1 font-bold">M-Pesa Phone Number</label>
                                                <input type="tel" placeholder="e.g., 0712345678" value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white text-sm focus:border-green-500 outline-none transition-colors"/>
                                            </div>
                                        )}
                                    </label>

                                    {/* BANK TRANSFER */}
                                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'BANK' ? 'border-blue-500 bg-blue-900/10 shadow-md' : 'border-slate-700 hover:border-slate-600 bg-slate-950'}`}>
                                        <div className="flex items-center">
                                            <input type="radio" name="payment" value="BANK" checked={paymentMethod === 'BANK'} onChange={() => setPaymentMethod('BANK')} className="w-5 h-5 text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-600"/>
                                            <div className="h-10 w-16 bg-white rounded ml-4 flex items-center justify-center p-1"><Building className="text-blue-800" size={24}/></div>
                                            <div className="flex-1 ml-4">
                                                <div className="font-bold text-white text-lg">Bank Transfer (KCB)</div>
                                                <div className="text-xs text-slate-400">RTGS/EFT for large amounts</div>
                                            </div>
                                        </div>
                                        {paymentMethod === 'BANK' && (
                                            <div className="mt-6 ml-12 bg-slate-950 border border-slate-800 rounded-lg p-5 animate-in fade-in slide-in-from-top-2">
                                                <h4 className="text-white font-bold mb-4 flex items-center text-sm uppercase tracking-wider"><Building size={16} className="text-blue-500 mr-2"/> Payment Instructions</h4>
                                                
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
                                                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-6">
                                                    <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Paybill Number</p>
                                                        <p className="text-2xl font-black text-white font-mono flex items-center justify-between">
                                                            522522
                                                            <button onClick={() => navigator.clipboard.writeText('522522')} className="text-slate-500 hover:text-blue-500 transition-colors" title="Copy Paybill" aria-label="Copy Paybill"><Copy size={16}/></button>
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Account Number</p>
                                                        <p className="text-xl font-black text-yellow-500 font-mono flex items-center justify-between">
                                                            1280877812
                                                            <button onClick={() => navigator.clipboard.writeText('1280877812')} className="text-slate-500 hover:text-yellow-500 transition-colors" title="Copy Account No." aria-label="Copy Account Number"><Copy size={16}/></button>
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-4 flex items-start"><AlertCircle size={14} className="mr-2 flex-shrink-0 text-blue-400"/> Please use your Order ID as the transaction reference if possible.</p>
                                            </div>
                                        )}
                                    </label>

                                    {/* CARD */}
                                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-purple-500 bg-purple-900/10 shadow-md' : 'border-slate-700 hover:border-slate-600 bg-slate-950'}`}>
                                        <div className="flex items-center mb-4">
                                            <input type="radio" name="payment" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="w-5 h-5 text-purple-600 bg-slate-900 border-slate-700 focus:ring-purple-600"/>
                                            <div className="flex ml-4 gap-2">
                                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><CreditCard className="text-slate-900" size={20}/></div>
                                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><span className="font-bold text-blue-800 text-xs">VISA</span></div>
                                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><span className="font-bold text-red-600 text-xs">MC</span></div>
                                            </div>
                                            <div className="flex-1 ml-4">
                                                <div className="font-bold text-white text-lg">Credit / Debit Card</div>
                                                <div className="text-xs text-slate-400">Securely pay with Visa, Mastercard</div>
                                            </div>
                                        </div>
                                        {paymentMethod === 'CARD' && (
                                            <div className="mt-4 ml-12 p-6 bg-slate-950 border border-slate-800 rounded-xl animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-slate-800 opacity-20 pointer-events-none">
                                                    <CreditCard size={150}/>
                                                </div>
                                                
                                                <div className="space-y-4 relative z-10">
                                                    <div>
                                                        <label className="block text-xs text-slate-400 mb-1 font-bold">Card Number</label>
                                                        <div className="relative">
                                                            <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-slate-900 border border-slate-700 p-3 pl-12 rounded text-white font-mono focus:border-purple-500 outline-none transition-colors"/>
                                                            <CreditCard className="absolute left-4 top-3.5 text-slate-500" size={20}/>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs text-slate-400 mb-1 font-bold">Expiry Date</label>
                                                            <input type="text" placeholder="MM/YY" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-mono focus:border-purple-500 outline-none transition-colors text-center"/>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-slate-400 mb-1 font-bold">CVV / CVC</label>
                                                            <input type="text" placeholder="XXX" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white font-mono focus:border-purple-500 outline-none transition-colors text-center"/>
                                                        </div>
                                                    </div>
                                                     <div>
                                                        <label className="block text-xs text-slate-400 mb-1 font-bold">Cardholder Name</label>
                                                        <input type="text" placeholder="e.g. JOHN DOE" className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white focus:border-purple-500 outline-none transition-colors uppercase"/>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </label>

                                    <div className="mt-8">
                                        <button 
                                            onClick={handlePlaceOrder}
                                            disabled={processing || (paymentMethod === 'MPESA' && !mpesaPhone)}
                                            className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-500 shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                                        >
                                            {processing ? <Loader2 className="animate-spin mr-2"/> : <Lock className="mr-2" size={20}/>}
                                            {processing ? "PROCESSING SECURELY..." : `PAY ${currency} ${total.toLocaleString()}`}
                                        </button>
                                        <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center">
                                            <Lock size={12} className="mr-1"/> By clicking Pay, you agree to DAGIV's Terms of Service.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SUCCESS & INSTRUCTIONS */}
                        {step === 3 && orderResult && (
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
                            <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 animate-in fade-in zoom-in-95">
                                <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl h-full max-h-[800px] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                                    <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-800">
                                        <div className="flex items-center">
                                            <ShieldCheck className="text-green-500 mr-2" size={24}/>
                                            <span className="text-white font-bold tracking-widest uppercase text-sm">Secure Checkout Gateway</span>
                                        </div>
                                        <button 
                                            onClick={() => window.location.href = '/marketplace'} 
                                            className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
                                            title="Close Payment Gateway"
                                            aria-label="Close Payment Gateway"
                                        >
                                            <X size={20}/>
                                        </button>
                                    </div>
                                    <iframe 
                                        src={orderResult.payment_info.url} 
                                        className="flex-1 w-full bg-slate-50" 
                                        frameBorder="0"
                                        title="Pesapal Secure Payment"
                                        allow="payment"
                                    ></iframe>
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