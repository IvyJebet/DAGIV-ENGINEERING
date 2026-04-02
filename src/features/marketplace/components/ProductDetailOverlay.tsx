import React, { useState } from 'react';
import { 
    ChevronLeft, ChevronRight, MapPin, 
    Tag, ShieldCheck, FileText, Truck, Lock, Download, ShoppingCart, RefreshCw, CheckCircle, Star
} from 'lucide-react';
import { MarketItem } from '@/types';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/context/AuthContext'; 

interface ProductDetailOverlayProps {
    item: MarketItem;
    onClose: () => void;
}

export const ProductDetailOverlay: React.FC<ProductDetailOverlayProps> = ({ item, onClose }) => {
    const navigate = useNavigate(); 
    const { buyerToken, sellerToken, logout } = useAuth(); 
    
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SPECS' | 'SELLER'>('SPECS'); 
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    
    const [addingToCart, setAddingToCart] = useState(false);
    const [added, setAdded] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false); 
    const [isDownloadingQuote, setIsDownloadingQuote] = useState(false);

    const hasImages = item.images && item.images.length > 0;
    const safeImages = hasImages ? item.images : ["https://via.placeholder.com/600?text=No+Image+Available"];

    const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % safeImages.length);
    const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + safeImages.length) % safeImages.length);

    const getCleanToken = () => {
        let rawToken = buyerToken || sellerToken || 
                       localStorage.getItem('dagiv_buyer_token') || 
                       localStorage.getItem('dagiv_seller_token') || 
                       localStorage.getItem('dagiv_token');
        
        if (!rawToken || rawToken === 'null' || rawToken === 'undefined') return null;
        return rawToken.replace(/['"]+/g, '');
    };

    const handleDownloadQuotation = async () => {
        const activeToken = getCleanToken();
        
        if (!activeToken) {
            alert("Please log in to generate an official pre-purchase quotation.");
            return;
        }

        setIsDownloadingQuote(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/listings/${item.id}/quotation`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${activeToken}`
                }
            });

            if (res.status === 401) {
                logout('ALL');
                alert("Your session has expired or is invalid. Please log in again.");
                return;
            }

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to generate quotation");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DAGIV_Quotation_${item.brand}_${item.model}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            alert(error.message || "Connection error. Could not reach server.");
        } finally {
            setIsDownloadingQuote(false);
        }
    };

    const handleAddToCart = async () => {
        const activeToken = getCleanToken();
        
        if (!activeToken) {
            alert("Please log in to add items to your cart.");
            return;
        }

        setAddingToCart(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}`
                },
                body: JSON.stringify({ listing_id: item.id, quantity: 1 })
            });

            if (res.status === 401) {
                logout('ALL');
                alert("Your session has expired or is invalid. Please log in again.");
                setAddingToCart(false);
                return;
            }

            if (res.ok) {
                setAdded(true);
                window.dispatchEvent(new Event('cartUpdated')); 
                setTimeout(() => setAdded(false), 3000); 
            } else {
                const err = await res.json();
                alert(err.detail || "Failed to add to cart");
            }
        } catch (error) {
            alert("Connection error. Could not reach server.");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        const activeToken = getCleanToken();
        
        if (!activeToken) {
            alert("Please log in to proceed to checkout.");
            return;
        }

        setBuyingNow(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}`
                },
                body: JSON.stringify({ listing_id: item.id, quantity: 1 })
            });

            if (res.status === 401) {
                logout('ALL');
                alert("Your session has expired or is invalid. Please log in again.");
                setBuyingNow(false);
                return;
            }

            if (res.ok) {
                window.dispatchEvent(new Event('cartUpdated')); 
                onClose();
                navigate('/checkout');
            } else {
                const err = await res.json();
                alert(err.detail || "Failed to initiate checkout");
                setBuyingNow(false);
            }
        } catch (error) {
            alert("Connection error. Could not reach server.");
            setBuyingNow(false);
        } 
    };

    const formatLabel = (key: string) => {
        if (key.toLowerCase() === 'yom') return 'Year of Manufacture';
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    const formatValue = (val: any) => {
        if (Array.isArray(val)) return val.join(", ");
        if (typeof val === 'boolean') return val ? "Yes" : "No";
        return String(val);
    };

    const EXCLUDED_KEYS = [
        'images', 'videos', 'complianceDocs', 'financials', 'description', 
        'listingTitle', 'listingStatus', 'category', 'subCategory', 'brand', 
        'model', 'price', 'currency', 'lat', 'lng', 'address', 'rentDry', 
        'dailyRate', 'shippingInfo', 'sellerTerms', 'availabilityDate'
    ];

    const PRIORITIZED_KEYS = ['country', 'region', 'city', 'yom', 'usageUnit', 'usage'];
    const orderedSpecs: { label: string, value: string }[] = [];
    const specsObj = item.specs || {};

    PRIORITIZED_KEYS.forEach(key => {
        const val = specsObj[key];
        if (val !== '' && val !== null && val !== undefined) {
            orderedSpecs.push({ label: formatLabel(key), value: formatValue(val) });
        }
    });

    Object.entries(specsObj).forEach(([k, v]) => {
        if (!PRIORITIZED_KEYS.includes(k) && !EXCLUDED_KEYS.includes(k) && v !== '' && v !== null && v !== undefined) {
            orderedSpecs.push({ label: formatLabel(k), value: formatValue(v) });
        }
    });

    return (
        <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col lg:flex-row overflow-hidden animate-in slide-in-from-right-10">
            
            <div className="w-full lg:w-3/5 bg-slate-950 relative flex flex-col h-[40vh] lg:h-full p-4 lg:p-8">
                <button 
                    onClick={onClose} 
                    aria-label="Close Modal" 
                    title="Close" 
                    className="absolute top-8 left-8 z-30 bg-slate-900/80 p-2.5 rounded-full text-slate-300 hover:text-black hover:bg-yellow-500 transition-all backdrop-blur-md shadow-lg border border-slate-700"
                >
                    <ChevronLeft size={20}/>
                </button>
                
                <div className="flex-1 relative flex items-center justify-center bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6 group/stage">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img 
                            src={safeImages[currentImageIdx]}
                            alt="Background blur effect"
                            className="w-full h-full object-cover opacity-30 blur-3xl scale-125" 
                        />
                    </div>
                    <img 
                        src={safeImages[currentImageIdx]} 
                        className="w-full h-full object-contain relative z-10 transition-transform duration-500" 
                        alt={item.title}
                    />
                    {safeImages.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage} 
                                aria-label="Previous Image"
                                title="Previous Image"
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-slate-950/60 hover:bg-yellow-500 hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover/stage:opacity-100 border border-slate-700 hover:border-yellow-500 shadow-lg"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextImage} 
                                aria-label="Next Image"
                                title="Next Image"
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-slate-950/60 hover:bg-yellow-500 hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover/stage:opacity-100 border border-slate-700 hover:border-yellow-500 shadow-lg"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                    {item.promoted && <div className="absolute top-6 right-6 z-20 bg-yellow-500 text-slate-900 text-[10px] font-black tracking-wider px-4 py-1.5 rounded-full shadow-lg">FEATURED</div>}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-950/80 px-4 py-1.5 rounded-full text-white text-xs font-mono backdrop-blur-md border border-slate-700 shadow-lg">
                        {currentImageIdx + 1} / {safeImages.length}
                    </div>
                </div>

                <div className="h-24 bg-slate-900 rounded-2xl border border-slate-800 p-2 flex gap-2 overflow-x-auto custom-scrollbar shadow-lg shrink-0">
                    {safeImages.map((img, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentImageIdx(i)}
                            aria-label={`Select thumbnail ${i + 1}`}
                            title={`View Image ${i + 1}`}
                            className={`h-full aspect-video rounded-xl overflow-hidden transition-all duration-300 relative ${currentImageIdx === i ? 'border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] scale-100' : 'border border-slate-800 opacity-50 hover:opacity-100 hover:scale-105'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`thumb-${i}`}/>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full lg:w-2/5 bg-slate-900 border-l border-slate-800 flex flex-col h-[60vh] lg:h-full">
                
                <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span className="text-yellow-500">{item.brand || item.category}</span> <ChevronRight size={12}/> <span>{item.model || item.subCategory}</span>
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2 leading-tight">{item.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center"><MapPin size={14} className="mr-1 text-slate-500"/> {item.location}</span>
                        <span className="flex items-center"><Tag size={14} className="mr-1 text-slate-500"/> {item.condition}</span>
                        {item.verifiedByDagiv && <span className="flex items-center text-green-500 font-bold bg-green-900/20 px-2 py-0.5 rounded text-xs"><ShieldCheck size={12} className="mr-1"/> VERIFIED</span>}
                    </div>
                </div>

                <div className="flex border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
                    {(['SPECS', 'OVERVIEW', 'SELLER'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`flex-1 py-4 text-xs font-bold tracking-wider transition-colors ${activeTab === tab ? 'text-yellow-500 border-b-2 border-yellow-500 bg-slate-900' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    
                    {activeTab === 'SPECS' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-end border-b border-slate-800 pb-6 mb-6">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Final Display Price</div>
                                    <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                                        <span className="text-sm text-yellow-500">{item.currency}</span>
                                        {item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </div>
                                    {item.listingType === 'RENT' && <span className="text-xs text-slate-500 block mt-1">(Calculated Daily Rate)</span>}
                                </div>
                                {item.specs?.priceOnRequest && <div className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 py-1 rounded">Negotiable / POR</div>}
                            </div>

                            <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                                <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 font-bold text-white text-xs uppercase tracking-wider text-yellow-500/80">
                                    Technical Specifications
                                </div>
                                <div className="divide-y divide-slate-800/50">
                                    {orderedSpecs.map((spec, idx) => (
                                        <div key={idx} className="flex justify-between px-4 py-3 text-sm hover:bg-slate-900 transition-colors">
                                            <span className="text-slate-500">{spec.label}</span>
                                            <span className="text-slate-200 font-medium text-right max-w-[60%] leading-tight break-words">
                                                {spec.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-6 space-y-3">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-2 border-b border-slate-800 pb-2">Available Documentation</div>
                                
                                <button 
                                    onClick={handleDownloadQuotation}
                                    disabled={isDownloadingQuote}
                                    className="w-full py-3 border border-yellow-500/50 bg-yellow-500/10 rounded-lg text-yellow-500 text-sm hover:bg-yellow-500/20 transition-all flex items-center justify-center cursor-pointer font-bold shadow-sm"
                                >
                                    {isDownloadingQuote ? <RefreshCw size={16} className="mr-2 animate-spin"/> : <FileText size={16} className="mr-2"/>} 
                                    {isDownloadingQuote ? "Generating Official Quote..." : "Download Pre-Purchase Quotation"}
                                </button>

                                {item.specs?.complianceDocs && item.specs.complianceDocs.length > 0 && (
                                    item.specs.complianceDocs.map((docUrl: string, idx: number) => (
                                        <a 
                                            key={idx} 
                                            href={docUrl} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 text-sm hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center cursor-pointer bg-slate-950"
                                        >
                                            <Download size={16} className="mr-2"/> Download Compliance Doc {idx + 1}
                                        </a>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div>
                                <h3 className="text-white font-bold mb-3 flex items-center"><FileText size={18} className="mr-2 text-yellow-500"/> Seller Description</h3>
                                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 rounded border border-slate-800">
                                    {item.specs?.description || "No additional description provided by the seller."}
                                </p>
                            </div>

                            {(item.specs?.shippingInfo || item.specs?.sellerTerms || item.specs?.availabilityDate) && (
                                <div className="bg-slate-800/30 p-4 rounded border border-slate-800">
                                    <h4 className="text-white font-bold text-sm mb-3 flex items-center"><Truck size={16} className="mr-2 text-blue-500"/> Logistics & Seller Terms</h4>
                                    <div className="grid grid-cols-1 gap-4 text-sm">
                                        {item.specs.shippingInfo && <div><span className="text-slate-500 block text-xs">Shipping / Pickup</span><span className="text-slate-300 font-bold">{item.specs.shippingInfo}</span></div>}
                                        {item.specs.sellerTerms && <div><span className="text-slate-500 block text-xs">Terms & Conditions</span><span className="text-slate-300 font-bold">{item.specs.sellerTerms}</span></div>}
                                        {item.specs.availabilityDate && <div><span className="text-slate-500 block text-xs">Availability Date</span><span className="text-slate-300 font-bold">{item.specs.availabilityDate}</span></div>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'SELLER' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                                <div className="bg-slate-950 p-6 flex items-center gap-5 border-b border-slate-800 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-black text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.3)] shrink-0 z-10">
                                        {(item.seller?.name || 'S').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="z-10">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            {item.seller?.name} 
                                            {item.seller?.verified && <CheckCircle size={18} className="text-green-500 fill-green-500/20" title="Verified Seller" />}
                                        </h3>
                                        <div className="text-slate-400 text-sm mt-1 flex items-center gap-3">
                                            <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-500"/> {item.seller?.location || item.location}</span>
                                            <span className="flex items-center gap-1"><Tag size={14} className="text-slate-500"/> {item.seller?.type || 'Business'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-px bg-slate-800">
                                    <div className="bg-slate-950 p-4 text-center hover:bg-slate-900 transition-colors">
                                        <div className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                                            {item.seller?.rating ? item.seller.rating.toFixed(1) : '0.0'} <Star size={16} className="text-yellow-500 fill-yellow-500"/>
                                        </div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">User Rating</div>
                                    </div>
                                    <div className="bg-slate-950 p-4 text-center hover:bg-slate-900 transition-colors">
                                        <div className="text-[15px] sm:text-lg font-bold text-white mb-1 truncate px-1">
                                            {item.seller?.joinedDate ? item.seller.joinedDate.split('T')[0] : '2026'}
                                        </div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Member Since</div>
                                    </div>
                                </div>

                                {item.seller?.badges && item.seller.badges.length > 0 && (
                                    <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-3 tracking-wider">Seller Achievements</div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.seller.badges.map((badge, idx) => (
                                                <span key={idx} className="bg-slate-900 border border-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                                    <ShieldCheck size={14} className="text-yellow-500"/> {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 bg-slate-950/80">
                                    <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-white text-sm font-bold rounded-lg transition-all border border-slate-700 flex items-center justify-center gap-2 shadow-sm">
                                        <FileText size={16}/> View Full Seller Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-950 border-t border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-20">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={handleAddToCart} 
                            disabled={addingToCart || buyingNow}
                            className={`flex-1 font-bold py-4 rounded-lg shadow-lg flex items-center justify-center transition-all ${added ? 'bg-blue-600 text-white' : 'bg-slate-800 text-yellow-500 hover:bg-slate-700 hover:text-white border border-slate-700'}`}
                        >
                            {addingToCart ? <RefreshCw className="animate-spin mr-2" size={20}/> : (added ? <CheckCircle className="mr-2" size={20}/> : <ShoppingCart className="mr-2" size={20}/>)}
                            {added ? 'ADDED TO CART' : 'ADD TO CART'}
                        </button>
                        
                        <button 
                            onClick={handleBuyNow} 
                            disabled={buyingNow || addingToCart}
                            className="flex-1 bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-500 shadow-lg flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {buyingNow ? <RefreshCw className="animate-spin mr-2" size={20}/> : <Lock className="mr-2" size={20}/>}
                            {buyingNow ? 'REDIRECTING...' : (item.listingType === 'Sale' ? 'BUY NOW' : 'RENT NOW')}
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center">
                        <ShieldCheck size={12} className="mr-1 text-yellow-500"/>
                        Funds held in Escrow until you verify the item.
                    </p>
                </div>
            </div>
        </div>
    );
};