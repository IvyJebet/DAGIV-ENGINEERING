import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, MapPin, 
  Tag, ShieldCheck, FileText, Truck, Lock, Video, Download 
} from 'lucide-react';
import { MarketItem } from '@/types';

interface ProductDetailOverlayProps {
  item: MarketItem;
  onClose: () => void;
  onCheckout: () => void;
}

export const ProductDetailOverlay: React.FC<ProductDetailOverlayProps> = ({ item, onClose, onCheckout }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SPECS' | 'SELLER'>('SPECS'); // Default to SPECS to show all details
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % item.images.length);
    const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + item.images.length) % item.images.length);

    return (
        <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col lg:flex-row overflow-hidden animate-in slide-in-from-right-10">
            {/* LEFT: VISUAL COMMAND CENTER */}
            <div className="w-full lg:w-3/5 bg-black relative flex flex-col h-[40vh] lg:h-full group">
                <button 
                    onClick={onClose} 
                    aria-label="Close" 
                    title="Close"
                    className="absolute top-4 left-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-slate-800"
                >
                    <ChevronLeft/>
                </button>
                
                {/* Main Stage */}
                <div className="flex-1 relative flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <img 
                        src={item.images[currentImageIdx]} 
                        className="max-w-full max-h-full object-contain transition-opacity duration-300" 
                        alt={item.title}
                    />
                    
                    {/* Navigation Arrows */}
                    {item.images.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage} 
                                aria-label="Previous image" 
                                title="Previous image"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-yellow-500 hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextImage} 
                                aria-label="Next image" 
                                title="Next image"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-yellow-500 hover:text-black text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {item.promoted && <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded">FEATURED</div>}
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-xs font-mono">
                        {currentImageIdx + 1} / {item.images.length}
                    </div>
                </div>

                {/* Thumbnails Strip */}
                <div className="h-20 bg-slate-950 border-t border-slate-800 p-2 flex gap-2 overflow-x-auto custom-scrollbar">
                    {item.images.map((img, i) => (
                        <button 
                            key={i} 
                            aria-label={`View image ${i + 1}`}
                            title={`View image ${i + 1}`}
                            onClick={() => setCurrentImageIdx(i)}
                            className={`h-full aspect-video bg-slate-900 rounded border overflow-hidden transition-all ${currentImageIdx === i ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`thumb-${i}`}/>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT: DETAILS & DEAL CENTER */}
            <div className="w-full lg:w-2/5 bg-slate-900 border-l border-slate-800 flex flex-col h-[60vh] lg:h-full">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span className="text-yellow-500">{item.category}</span> <ChevronRight size={12}/> <span>{item.subCategory}</span>
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2 leading-tight">{item.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center"><MapPin size={14} className="mr-1 text-slate-500"/> {item.location}</span>
                        <span className="flex items-center"><Tag size={14} className="mr-1 text-slate-500"/> {item.condition}</span>
                        {item.verifiedByDagiv && <span className="flex items-center text-green-500 font-bold bg-green-900/20 px-2 py-0.5 rounded text-xs"><ShieldCheck size={12} className="mr-1"/> VERIFIED</span>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
                    {['SPECS', 'OVERVIEW', 'SELLER'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-4 text-xs font-bold tracking-wider transition-colors ${activeTab === tab ? 'text-yellow-500 border-b-2 border-yellow-500 bg-slate-900' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    
                    {/* TAB: SPECS (Default - Shows All Details) */}
                    {activeTab === 'SPECS' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            {/* Price Summary */}
                            <div className="flex justify-between items-end border-b border-slate-800 pb-6 mb-6">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Asking Price</div>
                                    <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                                        <span className="text-sm text-yellow-500">{item.currency}</span>
                                        {item.price.toLocaleString()}
                                    </div>
                                </div>
                                {item.negotiable && <div className="text-xs font-bold text-green-500 border border-green-900 bg-green-900/10 px-2 py-1 rounded">Negotiable</div>}
                            </div>

                            {/* Dynamic Spec Groups from Marketplace.tsx */}
                            {item.specifications.map((group, idx) => (
                                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                                    <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 font-bold text-white text-xs uppercase tracking-wider text-yellow-500/80">
                                        {group.groupName}
                                    </div>
                                    <div className="divide-y divide-slate-800/50">
                                        {group.items.map((spec, sIdx) => (
                                            <div key={sIdx} className="flex justify-between px-4 py-3 text-sm hover:bg-slate-900 transition-colors">
                                                <span className="text-slate-500">{spec.label}</span>
                                                <span className="text-slate-200 font-medium text-right">{spec.value} {spec.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Download Button for Documents */}
                            <button className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 text-sm hover:border-yellow-500 hover:text-yellow-500 transition-colors flex items-center justify-center">
                                <Download size={16} className="mr-2"/> Download Compliance Docs
                            </button>
                        </div>
                    )}

                    {/* TAB: OVERVIEW (Description) */}
                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div>
                                <h3 className="text-white font-bold mb-3 flex items-center"><FileText size={18} className="mr-2 text-yellow-500"/> Seller Description</h3>
                                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 rounded border border-slate-800">
                                    {item.description}
                                </p>
                            </div>

                            <div className="bg-slate-800/30 p-4 rounded border border-slate-800">
                                <h4 className="text-white font-bold text-sm mb-3 flex items-center"><Truck size={16} className="mr-2 text-blue-500"/> Logistics & Delivery</h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div><span className="text-slate-500 block">Method</span><span className="text-slate-300 font-bold">{item.deliveryOptions}</span></div>
                                    <div><span className="text-slate-500 block">Availability</span><span className="text-slate-300 font-bold">{item.estimatedMobTime}</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: SELLER */}
                    {activeTab === 'SELLER' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-slate-500 border-4 border-slate-800 shadow-xl">
                                    {item.sellerName ? item.sellerName.charAt(0) : "S"}
                                </div>
                                <h3 className="text-xl font-bold text-white">{item.sellerName}</h3>
                                <div className="text-yellow-500 text-xs font-bold uppercase mt-1 mb-6 flex justify-center items-center gap-2">
                                    <ShieldCheck size={14}/> Verified Dealer
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">4.8</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Rating</div>
                                    </div>
                                    <div className="text-center border-l border-slate-800">
                                        <div className="text-2xl font-bold text-white">98%</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Response Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action Bar */}
                <div className="p-6 bg-slate-950 border-t border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-20">
                    <button onClick={onCheckout} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-500 shadow-lg flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Lock className="mr-2" size={20}/>
                        {item.listingType === 'Sale' ? 'SECURE CHECKOUT & INSPECTION' : 'BOOK FOR RENTAL'}
                    </button>
                    <p className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center">
                        <ShieldCheck size={12} className="mr-1 text-yellow-500"/>
                        Funds held in Escrow until you verify the item.
                    </p>
                </div>
            </div>
        </div>
    );
};