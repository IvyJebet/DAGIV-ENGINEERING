import React, { useState } from 'react';
import { 
  ShoppingCart, ShieldCheck, X, Check, CheckCircle, 
  Phone, Building2, Lock, Clock, RefreshCw 
} from 'lucide-react';
import { MarketItem } from '../../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const SecureCheckoutModal = ({ item, onClose }: { item: MarketItem; onClose: () => void }) => {
    const [step, setStep] = useState(1); // 1: Review, 2: Details, 3: Payment, 4: Success
    const [loading, setLoading] = useState(false);
    const [rentalDuration, setRentalDuration] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'BANK'>('MPESA');
    
    // Order Calculation
    const isRental = item.listingType === 'Rent';
    const basePrice = isRental ? (item.price * rentalDuration) : item.price;
    const taxRate = 0.16; // 16% VAT
    const logisticsCost = item.deliveryOptions === 'Nationwide Delivery' ? 15000 : 0;
    const subTotal = basePrice;
    const total = subTotal + (subTotal * taxRate) + logisticsCost;

    const handleConfirmOrder = async () => {
        const token = localStorage.getItem('dagiv_seller_token'); // Or buyer token
        if (!token) {
            alert("Please log in to complete your purchase.");
            return;
        }

        setLoading(true);
        try {
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
            
            if (res.ok) {
                setStep(4); // Success screen
            } else {
                alert(data.detail || "Order failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Connection error. Is the server running?");
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
                        <img src={item.images[0]} className="w-20 h-20 object-cover rounded border border-slate-800"/>
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

                {/* Right: Steps */}
                <div className="w-full md:w-2/3 p-8 bg-slate-900 relative flex flex-col">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X/></button>
                    
                    {/* Steps Header */}
                    <div className="flex mb-8 gap-4 border-b border-slate-800 pb-4">
                        {['Review', 'Details', 'Payment', 'Done'].map((s, i) => (
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
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-2xl font-bold text-white">Review Order</h2>
                                <p className="text-slate-400 text-sm">Please verify the item details before proceeding. By continuing, you agree to the DAGIV Buyer Terms.</p>
                                
                                {isRental && (
                                    <div className="bg-slate-950 border border-yellow-500/30 p-4 rounded text-sm">
                                        <h4 className="font-bold text-yellow-500 mb-2 flex items-center"><Clock size={16} className="mr-2"/> Rental Duration</h4>
                                        <div className="flex items-center gap-4">
                                            <label className="text-slate-400 text-xs uppercase font-bold">Number of {item.priceUnit?.replace('per ', '') || 'Days'}:</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={rentalDuration} 
                                                onChange={(e) => setRentalDuration(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="bg-slate-900 border border-slate-700 rounded p-2 text-white w-24 text-center font-bold focus:border-yellow-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="bg-slate-950 border border-slate-800 p-4 rounded text-sm">
                                    <h4 className="font-bold text-white mb-2">Item Condition</h4>
                                    <p className="text-slate-400">{item.description}</p>
                                </div>
                                
                                <div className="flex gap-4 mt-8">
                                    <button onClick={onClose} className="px-6 py-3 rounded text-slate-400 font-bold hover:bg-slate-800">Cancel</button>
                                    <button onClick={() => setStep(2)} className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded hover:bg-yellow-400 flex-1">Continue to Details</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-8">
                                <h2 className="text-2xl font-bold text-white">Buyer Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-slate-500">First Name</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white"/></div>
                                    <div><label className="text-xs font-bold text-slate-500">Last Name</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white"/></div>
                                </div>
                                <div><label className="text-xs font-bold text-slate-500">Email Address</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white"/></div>
                                <div><label className="text-xs font-bold text-slate-500">Phone Number</label><input className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white"/></div>
                                <div><label className="text-xs font-bold text-slate-500">Delivery Address / Site Location</label><textarea className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-24"/></div>
                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setStep(1)} className="px-6 py-3 rounded text-slate-400 font-bold hover:bg-slate-800">Back</button>
                                    <button onClick={() => setStep(3)} className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded hover:bg-yellow-400 flex-1">Proceed to Payment</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8">
                                <h2 className="text-2xl font-bold text-white">Secure Payment</h2>
                                <div className="space-y-3">
                                    <label onClick={() => setPaymentMethod('MPESA')} className={`flex items-center justify-between p-4 bg-slate-950 border rounded cursor-pointer relative overflow-hidden transition-all ${paymentMethod === 'MPESA' ? 'border-yellow-500' : 'border-slate-800 hover:border-slate-600'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'MPESA' ? 'border-yellow-500' : 'border-slate-600'}`}>
                                                {paymentMethod === 'MPESA' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                                            </div>
                                            <div><div className="font-bold text-white">M-Pesa / Mobile Money</div><div className="text-xs text-slate-400">Instant Escrow Deposit</div></div>
                                        </div>
                                        <Phone className="text-slate-500"/>
                                    </label>
                                    <label onClick={() => setPaymentMethod('BANK')} className={`flex items-center justify-between p-4 bg-slate-950 border rounded cursor-pointer relative overflow-hidden transition-all ${paymentMethod === 'BANK' ? 'border-yellow-500' : 'border-slate-800 hover:border-slate-600'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'BANK' ? 'border-yellow-500' : 'border-slate-600'}`}>
                                                {paymentMethod === 'BANK' && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                                            </div>
                                            <div><div className="font-bold text-white">Bank Transfer (EFT/RTGS)</div><div className="text-xs text-slate-400">KCB, Equity, StanChart</div></div>
                                        </div>
                                        <Building2 className="text-slate-500"/>
                                    </label>
                                </div>
                                <div className="p-4 bg-blue-900/20 rounded border border-blue-500/30 text-xs text-blue-200">
                                    Your payment is held in the <strong>DAGIV Trust Account</strong>. The seller is only paid after you verify the item (Inspection or Delivery).
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setStep(2)} className="px-6 py-3 rounded text-slate-400 font-bold hover:bg-slate-800">Back</button>
                                    <button onClick={handleConfirmOrder} disabled={loading} className="px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-500 flex-1 flex items-center justify-center">
                                        {loading ? <RefreshCw className="animate-spin mr-2"/> : <Lock className="mr-2" size={18}/>} 
                                        {item.listingType === 'Sale' ? 'Pay & Secure Item' : 'Pay Deposit'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="text-center py-10 animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"><CheckCircle size={40} className="text-white"/></div>
                                <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
                                <p className="text-slate-400 mb-8">Status: <span className="text-yellow-500 font-bold">PENDING PAYMENT</span>.<br/>Check your email for payment instructions.</p>
                                <div className="bg-slate-950 p-6 rounded border border-slate-800 text-left max-w-sm mx-auto mb-8">
                                    <h4 className="text-yellow-500 font-bold text-xs uppercase mb-2">Next Steps</h4>
                                    <ul className="text-sm text-slate-300 space-y-2">
                                        <li className="flex gap-2"><Check size={14} className="mt-1 text-green-500"/> Order created in system.</li>
                                        <li className="flex gap-2"><Check size={14} className="mt-1 text-green-500"/> Proceed to make payment.</li>
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