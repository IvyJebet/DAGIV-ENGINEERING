import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, Loader2, AlertCircle, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  listing_id: string;
  quantity: number;
  brand: string;
  model: string;
  price: number;
  currency: string;
  listing_type: string;
  image: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();
    const [summary, setSummary] = useState({ item_count: 0, total_value: 0, currency: 'KES' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        const token = localStorage.getItem('dagiv_seller_token') || localStorage.getItem('dagiv_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null); // Reset error state on new fetch
            const res = await fetch(`${API_URL}/api/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                
                // Safe fallbacks in case the backend returns null for these
                setItems(data.items || []);
                setSummary({
                    item_count: data.summary?.item_count || 0,
                    total_value: data.summary?.total_value || 0,
                    currency: data.summary?.currency || 'KES'
                });
            } else {
                setError("Could not load cart items.");
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart whenever the drawer is opened
    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const handleRemove = async (listingId: string) => {
        const token = localStorage.getItem('dagiv_seller_token') || localStorage.getItem('dagiv_token');
        try {
            // Optimistic UI update
            setItems(prev => prev.filter(i => i.listing_id !== listingId));
            
            await fetch(`${API_URL}/api/cart/remove/${listingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Re-fetch to get accurate totals
            fetchCart();
            // Dispatch event to update Navbar badge
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-800">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                    <div className="flex items-center text-white font-black text-xl">
                        <ShoppingCart className="mr-3 text-yellow-500" />
                        Your Cart
                        <span className="ml-3 bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full font-bold">
                            {summary.item_count} Items
                        </span>
                    </div>
                    {/* ACCESSIBILITY FIX: Added aria-label and title */}
                    <button 
                        onClick={onClose} 
                        aria-label="Close cart drawer"
                        title="Close Cart"
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body / Items */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <Loader2 className="animate-spin mb-4 text-yellow-500" size={32} />
                            <p>Syncing your secure cart...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <AlertCircle className="mb-4 text-red-500" size={32} />
                            <p className="text-center">{error}</p>
                            <button onClick={fetchCart} className="mt-4 text-yellow-500 hover:underline">Try Again</button>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                            <div className="w-24 h-24 bg-slate-950 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-700">
                                <ShoppingCart size={40} className="text-slate-600" />
                            </div>
                            <h3 className="text-white font-bold text-lg">Your cart is empty</h3>
                            <p className="text-slate-400 text-sm mt-2 max-w-[250px]">Explore the marketplace to find top-tier engineering equipment.</p>
                            <button onClick={onClose} className="mt-6 text-yellow-500 font-bold hover:underline">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => {
                            // SAFE FALLBACKS: Ensure we don't crash if data is missing
                            const price = item.price || 0;
                            const brand = item.brand || 'Unknown Brand';
                            const model = item.model || 'Unknown Model';
                            const currency = item.currency || 'KES';
                            
                            return (
                                <div key={item.listing_id} className="flex gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 group hover:border-slate-700 transition-colors">
                                    {/* Image */}
                                    <div className="h-20 w-24 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800">
                                        <img src={item.image} alt={model} className="w-full h-full object-cover" />
                                    </div>
                                    
                                    {/* Details */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{brand}</div>
                                                <div className="text-white font-bold text-sm line-clamp-1">{model}</div>
                                            </div>
                                            {/* ACCESSIBILITY FIX: Added aria-label alongside title */}
                                            <button 
                                                onClick={() => handleRemove(item.listing_id)}
                                                className="text-slate-500 hover:text-red-500 p-1"
                                                aria-label={`Remove ${brand} ${model} from cart`}
                                                title="Remove Item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="mt-auto flex justify-between items-end">
                                            <div className="text-xs text-slate-400">Qty: {item.quantity}</div>
                                            <div className="text-yellow-500 font-black text-sm">
                                                {currency} {price.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer / Checkout Action */}
                {items.length > 0 && !loading && !error && (
                    <div className="p-6 bg-slate-950 border-t border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400 font-bold">Subtotal</span>
                            <span className="text-2xl font-black text-white">
                                <span className="text-sm text-slate-500 mr-2">{summary.currency || 'KES'}</span>
                                {/* SAFE FALLBACK: Ensure total_value is a number */}
                                {(summary.total_value || 0).toLocaleString()}
                            </span>
                        </div>
                        <button 
                            className="w-full bg-yellow-500 text-slate-900 font-black py-4 rounded-xl hover:bg-yellow-400 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg shadow-yellow-500/20"
                            onClick={() => {
                                onClose();
                                navigate('/checkout'); // <-- Route to our new page
                            }}
                        >
                            PROCEED TO SECURE CHECKOUT <ArrowRight className="ml-2" size={20} />
                        </button>
                        <p className="text-center text-[10px] text-slate-500 mt-4 flex items-center justify-center">
                            <Lock size={12} className="mr-1"/> Payments processed securely in Escrow
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};