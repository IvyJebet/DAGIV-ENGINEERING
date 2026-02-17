import React, { useState } from 'react';
import { 
  ChevronLeft, Video, ChevronRight, MapPin, 
  Tag, ShieldCheck, FileText, Truck, Lock 
} from 'lucide-react';
import { MarketItem } from '@/types';

interface ProductDetailOverlayProps {
  item: MarketItem;
  onClose: () => void;
  onCheckout: () => void;
}

export const ProductDetailOverlay: React.FC<ProductDetailOverlayProps> = ({ item, onClose, onCheckout }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SPECS' | 'SELLER'>('OVERVIEW');

    return (
        <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col lg:flex-row overflow-hidden animate-in slide-in-from-right-10">
            {/* LEFT: Visual Command Center */}
            <div className="w-full lg:w-3/5 bg-black relative flex flex-col h-[40vh] lg:h-full">
                <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-slate-800"><ChevronLeft/></button>
                
                {/* Main Stage */}
                <div className="flex-1 relative flex items-center justify-center bg-slate-900">
                    <img src={item.images[0]} className="max-w-full max-h-full object-contain" alt={item.title}/>
                    {item.promoted && <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded">FEATURED</div>}
                </div>

                {/* Thumbnails */}
                <div className="h-24 bg-slate-950 border-t border-slate-800 p-4 flex gap-4 overflow-x-auto">
                    {item.images.map((img, i) => (
                        <div key={i} className="h-full aspect-video bg-slate-900 rounded border border-slate-800 cursor-pointer hover:border-yellow-500 overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" alt={`thumbnail-${i}`}/>
                        </div>
                    ))}
                    <div className="h-full aspect-video bg-slate-900 rounded border border-slate-800 cursor-pointer hover:border-yellow-500 flex items-center justify-center text-slate-500">
                        <Video size={20}/>
                    </div>
                </div>
            </div>

            {/* RIGHT: Deal Center */}
            <div className="w-full lg:w-2/5 bg-slate-900 border-l border-slate-800 flex flex-col h-[60vh] lg:h-full">
                
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span className="text-yellow-500">{item.category}</span> <ChevronRight size={12}/> <span>{item.subCategory}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{item.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center"><MapPin size={14} className="mr-1"/> {item.location}</span>
                        <span className="flex items-center"><Tag size={14} className="mr-1"/> {item.condition}</span>
                        {item.verifiedByDagiv && <span className="flex items-center text-green-500 font-bold"><ShieldCheck size={14} className="mr-1"/> Verified</span>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-950">
                    {['OVERVIEW', 'SPECS', 'SELLER'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-4 text-xs font-bold tracking-wider ${activeTab === tab ? 'text-yellow-500 border-b-2 border-yellow-500 bg-slate-900' : 'text-slate-500 hover:text-white'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-8">
                            {/* Price Card */}
                            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Price</div>
                                    <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                                        <span className="text-sm text-yellow-500">{item.currency}</span>
                                        {item.price.toLocaleString()}
                                        {item.priceUnit && <span className="text-sm text-slate-400 font-normal">/{item.priceUnit.replace('per ', '')}</span>}
                                    </div>
                                    {item.negotiable && <div className="text-[10px] text-green-500 mt-1 font-bold bg-green-900/20 inline-block px-2 rounded">NEGOTIABLE</div>}
                                </div>
                                {item.financeAvailable && (
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-400 uppercase">Est. Monthly</div>
                                        <div className="text-lg font-bold text-slate-200">KES {item.estMonthlyPayment?.toLocaleString()}</div>
                                        <div className="text-[10px] text-blue-400 underline cursor-pointer">Finance Options</div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-white font-bold mb-3 flex items-center"><FileText size={18} className="mr-2 text-yellow-500"/> Description</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                            </div>

                            {/* Logistics */}
                            <div className="bg-slate-800/30 p-4 rounded border border-slate-800">
                                <h4 className="text-white font-bold text-sm mb-3 flex items-center"><Truck size={16} className="mr-2 text-blue-500"/> Logistics & Delivery</h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div><span className="text-slate-500 block">Method</span><span className="text-slate-300 font-bold">{item.deliveryOptions}</span></div>
                                    <div><span className="text-slate-500 block">Lead Time</span><span className="text-slate-300 font-bold">{item.estimatedMobTime}</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SPECS' && (
                        <div className="space-y-6">
                            {item.specifications.map((group, idx) => (
                                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 font-bold text-white text-sm">{group.groupName}</div>
                                    <div className="divide-y divide-slate-800">
                                        {group.items.map((spec, sIdx) => (
                                            <div key={sIdx} className="flex justify-between px-4 py-3 text-sm">
                                                <span className="text-slate-500">{spec.label}</span>
                                                <span className="text-slate-200 font-medium">{spec.value} {spec.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'SELLER' && (
                        <div className="space-y-6">
                            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-500 border-2 border-slate-700">
                                    {item.seller.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-white">{item.seller.name}</h3>
                                <div className="text-yellow-500 text-xs font-bold uppercase mt-1 mb-4">{item.seller.type} • {item.location}</div>
                                
                                <div className="flex justify-center gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-white">{item.seller.rating}</div>
                                        <div className="text-[10px] text-slate-500 uppercase">Rating</div>
                                    </div>
                                    <div className="w-px bg-slate-800"></div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-white">{item.seller.joinedDate}</div>
                                        <div className="text-[10px] text-slate-500 uppercase">Since</div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap justify-center gap-2">
                                    {item.seller.badges.map(b => (
                                        <span key={b} className="bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded text-slate-400">{b}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Action Bar */}
                <div className="p-6 bg-slate-950 border-t border-slate-800">
                    <button onClick={onCheckout} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-500 shadow-lg flex items-center justify-center transition-all hover:scale-[1.02]">
                        <Lock className="mr-2" size={20}/>
                        {item.listingType === 'Sale' ? 'SECURE CHECKOUT & INSPECTION' : 'BOOK FOR RENTAL'}
                    </button>
                    <p className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center">
                        <ShieldCheck size={12} className="mr-1 text-yellow-500"/>
                        Funds held in Escrow until verification.
                    </p>
                </div>
            </div>
        </div>
    );
};