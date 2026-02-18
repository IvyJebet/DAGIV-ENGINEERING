import React, { useState } from 'react';
import { 
  ShoppingCart, ShieldCheck, X, Check, CheckCircle, 
  Phone, Building2, Lock, Clock, RefreshCw, Smartphone, CreditCard, AlertCircle 
} from 'lucide-react';
import { MarketItem } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const SecureCheckoutModal = ({ item, onClose }: { item: MarketItem; onClose: () => void }) => {
    const [step, setStep] = useState(1); // 1: Method, 2: Processing, 3: Success
    const [loading, setLoading] = useState(false);
    const [rentalDuration, setRentalDuration] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'CARD' | 'BANK'>('MPESA');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    
    // FIX 1: Type assertion to string to avoid "no overlap" error
    const isRental = (item.listingType as string) === 'Rent' || (item.listingType as string) === 'RENT';
    
    const basePrice = isRental ? (item.price * rentalDuration) : item.price;
    const taxRate = 0.16; // 16% VAT
    const logisticsCost = item.deliveryOptions === 'Nationwide Delivery' ? 15000 : 0;
    const subTotal = basePrice;
    const total = subTotal + (subTotal * taxRate) + logisticsCost;

    const handleConfirmOrder = async () => {
        const token = localStorage.getItem('dagiv_seller_token');
        if (!token) {
            alert("Please log in to complete your purchase.");
            return;
        }

        // Validate Phone for M-Pesa
        if (paymentMethod === 'MPESA' && phoneNumber.length < 9) {
            setError("Please enter a valid M-Pesa phone number");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Create Order
            const payload = {
                listing_id: item.id,
                quantity: 1,
                payment_method: paymentMethod,
                duration: isRental ? rentalDuration : 0,
                shipping_cost: logisticsCost
            };

            const res = await fetch(`${API_URL}/api/orders/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (!res.ok) throw new Error(data.detail || "Order Creation Failed");

            // 2. Trigger Payment (If M-Pesa)
            if (paymentMethod === 'MPESA') {
                const payRes = await fetch(`${API_URL}/api/payments/mpesa/pay`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_id: data.orderId,
                        phone_number: phoneNumber,
                        amount: total
                    })
                });
                const payData = await payRes.json();
                
                if (payData.status === 'success') {
                    setStep(2); // Move to "Check your phone" screen
                } else {
                    throw new Error(payData.detail || "Payment Initiation Failed");
                }
            } else {
                // For Card/Bank (Simulation for now)
                setTimeout(() => setStep(3), 1500); 
            }

        } catch (error: any) {
            console.error(error);
            setError(error.message || "Connection error. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row overflow-hidden">
                
                {/* Left: Summary Panel */}
                <div className="w-full md:w-1/3 bg-slate-950 p-8 border-r border-slate-800 flex flex-col">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center"><ShoppingCart className="mr-2 text-yellow-500"/> Order Summary</h3>
                    
                    <div className="flex gap-4 mb-6">
                        <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded border border-slate-800"/>
                        <div>
                            <div className="text-xs text-slate-500 uppercase">{item.brand}</div>
                            <div className="text-sm font-bold text-white line-clamp-2">{item.title}</div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm text-slate-400 flex-1">
                        <div className="flex justify-between">
                            <span>Subtotal {isRental && `(${rentalDuration} ${item.priceUnit?.replace('per ', '') || 'units'})`}</span>
                            <span>{item.currency} {subTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between"><span>Logistics</span><span>{logisticsCost > 0 ? logisticsCost.toLocaleString() : 'TBD'}</span></div>
                        <div className="flex justify-between"><span>VAT (16%)</span><span>{(subTotal * taxRate).toLocaleString()}</span></div>
                        <div className="h-px bg-slate-800 my-2"></div>
                        <div className="flex justify-between text-white font-bold text-lg"><span>Total</span><span>{item.currency} {total.toLocaleString()}</span></div>
                    </div>

                    <div className="mt-6 bg-yellow-500/10 p-3 rounded border border-yellow-500/30">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="text-yellow-500 mt-0.5 shrink-0" size={16}/>
                            <p className="text-[10px] text-slate-300">
                                <strong>DAGIV Escrow Protection:</strong> Funds are held securely until you confirm receipt (Parts) or complete inspection (Equipment).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Steps */}
                <div className="w-full md:w-2/3 p-8 bg-slate-900 relative flex flex-col">
                    <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-slate-500 hover:text-white"><X/></button>
                    
                    {/* Steps Header */}
                    <div className="flex mb-8 gap-4 border-b border-slate-800 pb-4">
                        {['Payment Method', 'Processing', 'Done'].map((s, i) => (
                            <div key={s} className={`flex items-center text-sm font-bold ${step === i + 1 ? 'text-yellow-500' : step > i + 1 ? 'text-green-500' : 'text-slate-600'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs border ${step === i + 1 ? 'border-yellow-500 bg-yellow-500/10' : step > i + 1 ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-800'}`}>
                                    {step > i + 1 ? <Check size={12}/> : i + 1}
                                </div>
                                {s}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        
                        {/* STEP 1: PAYMENT METHOD SELECTION */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-bold text-white">Select Payment Method</h2>
                                
                                {isRental && (
                                    <div className="bg-slate-950 border border-yellow-500/30 p-4 rounded text-sm mb-4">
                                        <h4 className="font-bold text-yellow-500 mb-2 flex items-center"><Clock size={16} className="mr-2"/> Confirm Duration</h4>
                                        <div className="flex items-center gap-4">
                                            <label className="text-slate-400 text-xs uppercase font-bold">Number of {item.priceUnit?.replace('per ', '') || 'Days'}:</label>
                                            {/* FIX: Added aria-label for accessibility */}
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={rentalDuration} 
                                                aria-label="Rental Duration"
                                                onChange={(e) => setRentalDuration(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="bg-slate-900 border border-slate-700 rounded p-2 text-white w-24 text-center font-bold focus:border-yellow-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <button 
                                        onClick={() => setPaymentMethod('MPESA')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'MPESA' ? 'border-green-500 bg-green-500/10 text-white' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}
                                    >
                                        <Smartphone size={24} className="mb-2"/>
                                        <span className="text-xs font-bold">M-Pesa</span>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('CARD')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'CARD' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}
                                    >
                                        <CreditCard size={24} className="mb-2"/>
                                        <span className="text-xs font-bold">Card</span>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('BANK')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'BANK' ? 'border-yellow-500 bg-yellow-500/10 text-white' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}
                                    >
                                        <Building2 size={24} className="mb-2"/>
                                        <span className="text-xs font-bold">Bank</span>
                                    </button>
                                </div>

                                {/* Dynamic Input Fields */}
                                <div className="mb-8">
                                    {paymentMethod === 'MPESA' && (
                                        <div className="animate-in fade-in">
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">M-Pesa Phone Number</label>
                                            <div className="flex">
                                                <span className="bg-slate-800 border border-slate-700 border-r-0 rounded-l px-3 flex items-center text-slate-400 text-sm font-mono">+254</span>
                                                {/* FIX 2: Added aria-label for accessibility */}
                                                <input 
                                                    type="tel" 
                                                    placeholder="712 345 678"
                                                    aria-label="M-Pesa Phone Number"
                                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-r p-3 text-white font-bold tracking-widest outline-none focus:border-green-500"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2 flex items-center">
                                                <ShieldCheck size={10} className="mr-1 text-green-500"/> 
                                                You will receive an STK Push on this phone.
                                            </p>
                                        </div>
                                    )}
                                    
                                    {paymentMethod === 'CARD' && (
                                        <div className="text-center py-8 text-slate-500 bg-slate-950 rounded border border-slate-800 border-dashed animate-in fade-in">
                                            VISA / Mastercard integration coming soon. <br/> Please use M-Pesa for instant processing.
                                        </div>
                                    )}

                                    {paymentMethod === 'BANK' && (
                                        <div className="bg-slate-950 p-4 rounded border border-yellow-500/30 animate-in fade-in">
                                            <div className="text-xs text-yellow-500 font-bold uppercase mb-2">Bank Transfer Details</div>
                                            <div className="text-sm text-slate-300 space-y-1">
                                                <div className="flex justify-between"><span>Bank:</span> <span className="font-bold text-white">KCB Bank</span></div>
                                                <div className="flex justify-between"><span>Account Name:</span> <span className="font-bold text-white">DAGIV ENGINEERING LTD</span></div>
                                                <div className="flex justify-between"><span>Account No:</span> <span className="font-bold text-white font-mono">123 456 7890</span></div>
                                            </div>
                                            <div className="mt-4 text-[10px] text-slate-500">Use Order ID as Reference.</div>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm flex items-center">
                                        <AlertCircle size={16} className="mr-2"/> {error}
                                    </div>
                                )}

                                <div className="mt-8">
                                    <button 
                                        onClick={handleConfirmOrder} 
                                        disabled={loading || paymentMethod === 'CARD'}
                                        className="w-full px-6 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
                                    >
                                        {loading ? <RefreshCw className="animate-spin mr-2"/> : <Lock className="mr-2" size={18}/>} 
                                        {paymentMethod === 'BANK' ? 'Confirm Order' : `Pay ${item.currency} ${total.toLocaleString()}`}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: STK PUSH SENT */}
                        {step === 2 && (
                            <div className="p-12 text-center animate-in zoom-in-95">
                                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                    <Smartphone size={48} className="text-green-500 animate-pulse"/>
                                    <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Check your phone</h2>
                                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                    We've sent an M-Pesa request to <strong>+254 {phoneNumber}</strong>. <br/>
                                    Please enter your PIN to complete the transaction.
                                </p>
                                <div className="space-y-3">
                                    <button onClick={() => setStep(3)} className="bg-slate-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-700 w-full border border-slate-700">
                                        I have entered my PIN
                                    </button>
                                    <button onClick={() => setStep(1)} className="text-slate-500 text-sm hover:text-white">
                                        Didn't receive it? Retry
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {step === 3 && (
                            <div className="text-center py-10 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"><CheckCircle size={40} className="text-white"/></div>
                                <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
                                <p className="text-slate-400 mb-8">Status: <span className="text-yellow-500 font-bold">Processing</span>.<br/>Funds are secured in Escrow.</p>
                                <div className="bg-slate-900 p-6 rounded border border-slate-800 text-left max-w-sm mx-auto mb-8">
                                    <h4 className="text-yellow-500 font-bold text-xs uppercase mb-2">Next Steps</h4>
                                    <ul className="text-sm text-slate-300 space-y-2">
                                        <li className="flex gap-2"><Check size={14} className="mt-1 text-green-500"/> Order created in system.</li>
                                        <li className="flex gap-2"><Check size={14} className="mt-1 text-green-500"/> Logistics team will contact you.</li>
                                    </ul>
                                </div>
                                <button onClick={onClose} className="px-8 py-3 bg-slate-800 text-white font-bold rounded hover:bg-slate-700 border border-slate-600">Return to Marketplace</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};