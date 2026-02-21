import React, { useState, useEffect } from 'react';
import { Filter, PlusCircle, RefreshCw, MapPin, AlertCircle } from 'lucide-react';
import { MarketItem, PageView, SpecificationGroup, SellerProfile } from '@/types';
import { CATEGORY_STRUCTURE } from '@/config/constants';
import { ProductDetailOverlay } from '@/features/marketplace/components/ProductDetailOverlay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface MarketplaceProps {
  mode: 'BUY' | 'RENT';
  setPage: (p: PageView) => void;
  onSellClick: () => void;
  isSpareParts?: boolean;
}

// --- ADAPTER: Transforms Raw API Data into Rich UI Model ---
const transformApiListing = (apiItem: any): MarketItem => {
  const specs = apiItem.specs || {};
  
  // 1. Build Structured Specifications from ALL possible SellItemModal fields
  const specifications: SpecificationGroup[] = [];

  // Group 1: Engine & Performance
  const engineItems = [
    { label: 'Engine Make', value: specs.engineBrand },
    { label: 'Power Output', value: specs.enginePower },
    { label: 'Fuel Type', value: specs.fuelType },
    { label: 'Emission Std', value: specs.emissionStandard },
    { label: 'Transmission', value: specs.transmissionType },
    { label: 'Max Speed', value: specs.maxSpeed },
  ].filter(i => i.value && i.value !== '');
  
  if (engineItems.length > 0) specifications.push({ groupName: 'Engine & Performance', items: engineItems });

  // Group 2: Dimensions & Chassis
  const dimItems = [
    { label: 'Dimensions (LxWxH)', value: `${specs.dimLength || ''} ${specs.dimWidth ? 'x '+specs.dimWidth : ''} ${specs.dimHeight ? 'x '+specs.dimHeight : ''}`.trim() },
    { label: 'Operating Weight', value: specs.netWeight ? `${specs.netWeight} kg` : '' },
    { label: 'Axles/Config', value: specs.axles },
    { label: 'Tire/Track Size', value: specs.tireSize },
    { label: 'Track Width', value: specs.trackWidth },
    { label: 'Residual Tread', value: specs.residualTread },
  ].filter(i => i.value && i.value.trim() !== '');

  if (dimItems.length > 0) specifications.push({ groupName: 'Dimensions & Chassis', items: dimItems });

  // Group 3: Hydraulics & Attachments
  const hydItems = [
    { label: 'Aux Hydraulics', value: specs.auxHydraulics },
    { label: 'Hammer Lines', value: specs.hammerProtection }, // "Hammer Protection" usually refers to lines
    { label: 'Performance Specs', value: specs.performanceSpecs },
  ].filter(i => i.value && i.value !== 'No' && i.value !== '');

  if (hydItems.length > 0) specifications.push({ groupName: 'Hydraulics & Attachments', items: hydItems });

  // Group 4: Part Specifics (Only if it's a part)
  if (apiItem.listingType === 'PART') {
    const partItems = [
      { label: 'Part Type', value: specs.partType || 'Replacement' },
      { label: 'Part Number', value: specs.partNumber },
      { label: 'OEM Number', value: specs.oemNumber },
      { label: 'Weight', value: specs.partWeight ? `${specs.partWeight} kg` : '' },
      { label: 'Compatible Models', value: specs.applicableModels },
      { label: 'Packaging', value: specs.shippingInfo },
    ].filter(i => i.value && i.value !== '');
    if (partItems.length > 0) specifications.push({ groupName: 'Part Details', items: partItems });
  }

  // Group 5: History & Usage
  const historyItems = [
    { label: 'YOM', value: specs.yom },
    { label: 'Usage', value: `${specs.usage || 0} ${specs.usageUnit || ''}` },
    { label: 'Condition', value: specs.condition },
    { label: 'Original Paint', value: specs.originalPaint },
    { label: 'Warranty', value: specs.warrantyDetails || specs.warranty },
  ].filter(i => i.value && i.value !== '');

  if (historyItems.length > 0) specifications.push({ groupName: 'History & Condition', items: historyItems });

  // Group 6: Terms & Location (Seller entered details)
  const termsItems = [
      { label: 'Availability', value: specs.availabilityDate ? `Available from ${specs.availabilityDate}` : 'Immediate' },
      { label: 'Location', value: `${specs.city || ''}, ${specs.region || ''}, ${specs.country || ''}` },
      { label: 'Seller Terms', value: specs.sellerTerms },
  ].filter(i => i.value && i.value !== '' && i.value !== ', , ');

  if (termsItems.length > 0) specifications.push({ groupName: 'Terms & Location', items: termsItems });


  // 2. Synthesize Seller Profile
  const sellerName = apiItem.sellerName || "Verified Seller";
  const sellerProfile: SellerProfile = {
    id: apiItem.phone,
    name: sellerName,
    type: 'Dealer',
    verified: true,
    rating: 4.8,
    joinedDate: '2024',
    location: apiItem.location,
    badges: ['Identity Verified', 'Fast Responder']
  };

  // 3. Condition Normalization
  let condition: MarketItem['condition'] = 'Used - Good';
  const rawCondition = (specs.condition || '').toLowerCase();
  if (rawCondition.includes('new') && !rawCondition.includes('like')) condition = 'New';
  else if (rawCondition.includes('like new')) condition = 'Used - Like New';
  else if (rawCondition.includes('refurbished')) condition = 'Refurbished';
  else if (rawCondition.includes('parts')) condition = 'For Parts';

  return {
    id: apiItem.id,
    title: specs.listingTitle || `${apiItem.brand} ${apiItem.model}`,
    category: apiItem.category,
    subCategory: apiItem.subCategory,
    type: apiItem.listingType === 'PART' ? 'Part' : 'Equipment',
    listingType: apiItem.listingType === 'RENT' ? 'Rent' : 'Sale',
    
    price: apiItem.price,
    currency: apiItem.currency || 'KES',
    priceUnit: apiItem.listingType === 'RENT' ? 'per day' : undefined,
    negotiable: true,
    financeAvailable: apiItem.price > 1000000,
    estMonthlyPayment: apiItem.price > 1000000 ? Math.floor(apiItem.price * 0.032) : undefined,

    brand: apiItem.brand,
    model: apiItem.model,
    yom: parseInt(specs.yom) || undefined,
    hours: parseInt(specs.usage) || 0,
    condition: condition,
    
    description: specs.description || `Premium ${apiItem.brand} ${apiItem.model} available for immediate delivery.`,
    specifications: specifications, // <--- NOW CONTAINS ALL DATA

    images: (specs.images && specs.images.length > 0) 
      ? specs.images 
      : ["https://via.placeholder.com/800x600?text=No+Image+Available"],
    
    location: apiItem.location,
    deliveryOptions: specs.shippingInfo || 'Nationwide Delivery',
    estimatedMobTime: 'Available Immediately',

    sellerName: sellerName,
    sellerId: apiItem.phone,
    seller: sellerProfile,
    promoted: false,
    verifiedByDagiv: true
  };
};

const MarketplaceLayout: React.FC<MarketplaceProps> = ({ mode, setPage, onSellClick, isSpareParts = false }) => {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('All');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewItem, setViewItem] = useState<MarketItem | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_URL}/api/marketplace/listings`);
            if (res.ok) {
                const rawData = await res.json();
                const transformedItems = rawData.map(transformApiListing);
                setItems(transformedItems);
            } else {
                setError("Could not load listings.");
            }
        } catch (err) {
            console.error(err);
            setError("Connection failed.");
        } finally {
            setLoading(false);
        }
    };
    fetchListings();
  }, []); 

  const filteredItems = items.filter(item => {
    const isPart = item.type === 'Part';
    if (isSpareParts && !isPart) return false;
    if (!isSpareParts && isPart) return false;

    if (!isSpareParts) {
        const itemMode = item.listingType?.toUpperCase();
        if (mode === 'RENT' && itemMode !== 'RENT') return false;
        if (mode === 'BUY' && itemMode !== 'SALE' && itemMode !== 'BUY') return false;
    }
    
    if (selectedMainCat !== 'All' && item.category !== selectedMainCat) return false;
    if (selectedSubCat !== 'All' && item.subCategory !== selectedSubCat) return false;
    
    const q = search.toLowerCase();
    return (
        item.title.toLowerCase().includes(q) || 
        item.brand.toLowerCase().includes(q) || 
        item.model.toLowerCase().includes(q)
    );
  });

  const activeSubCategories = selectedMainCat !== 'All' 
    // @ts-ignore
    ? (isSpareParts ? CATEGORY_STRUCTURE[selectedMainCat]?.parts || [] : CATEGORY_STRUCTURE[selectedMainCat]?.equipment || [])
    : [];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full flex relative">
               <input 
                  type="text" 
                  placeholder={isSpareParts ? "Search Parts (e.g. Filter, Pump)..." : "Search Machines (e.g. Excavator)..."}
                  className="w-full bg-slate-950 border-y border-l border-slate-700 rounded-l text-white pl-4 pr-10 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                  onChange={(e) => setSearch(e.target.value)}
               />
               <button className="bg-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-r hover:bg-yellow-400 transition-colors">SEARCH</button>
            </div>
            <button onClick={onSellClick} className="hidden md:flex bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded font-bold items-center shadow-lg transition-transform hover:scale-105">
                <PlusCircle className="mr-2" size={18}/> {isSpareParts ? 'SELL PART' : 'LIST MACHINE'}
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950 font-bold text-white flex items-center">
                    <Filter size={16} className="mr-2 text-yellow-500"/> Categories
                </div>
                <div className="p-2">
                    <button onClick={() => { setSelectedMainCat('All'); setSelectedSubCat('All'); }} className={`w-full text-left px-3 py-2 rounded text-sm mb-1 transition-colors ${selectedMainCat === 'All' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'}`}>All</button>
                    {Object.keys(CATEGORY_STRUCTURE).map(cat => (
                        <button key={cat} onClick={() => { setSelectedMainCat(cat); setSelectedSubCat('All'); }} className={`w-full text-left px-3 py-2 rounded text-sm mb-1 truncate transition-colors ${selectedMainCat === cat ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>{cat}</button>
                    ))}
                </div>
                {selectedMainCat !== 'All' && (
                    <div className="border-t border-slate-800 p-2 bg-slate-950/50">
                        <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1">Sub-Categories</div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                           {activeSubCategories.map((sub: string) => (
                               <button key={sub} onClick={() => setSelectedSubCat(sub)} className={`w-full text-left px-3 py-1.5 rounded text-xs mb-1 truncate transition-colors ${selectedSubCat === sub ? 'text-yellow-500 font-bold' : 'text-slate-400 hover:text-white'}`}>{sub}</button>
                           ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                    {selectedSubCat !== 'All' ? selectedSubCat : (selectedMainCat === 'All' ? (isSpareParts ? 'All Parts' : 'All Equipment') : selectedMainCat)} 
                    <span className="text-slate-500 text-sm font-normal ml-2">({filteredItems.length} live)</span>
                </h2>
                {loading && <div className="flex items-center text-yellow-500 text-sm"><RefreshCw className="mr-2 animate-spin" size={14}/> Syncing Listings...</div>}
            </div>
            
            {error && (
                <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-center text-red-400 mb-6">
                    <AlertCircle className="mx-auto mb-2" size={32}/>
                    <p>{error}</p>
                </div>
            )}

            {filteredItems.length === 0 && !loading && !error ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                    <p className="text-slate-500 text-lg mb-2">No active listings found.</p>
                    <p className="text-slate-600 text-sm">Be the first to list in this category.</p>
                    <button onClick={onSellClick} className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full font-bold transition-colors">
                        Post a Listing
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
                    {filteredItems.map(item => (
                        <div key={item.id} onClick={() => setViewItem(item)} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:shadow-xl hover:border-yellow-500/50 transition-all cursor-pointer group flex flex-col h-full relative">
                            <div className="h-48 bg-slate-950 relative overflow-hidden">
                                <img 
                                    src={item.images[0]} 
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {item.promoted && <span className="absolute top-2 left-2 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">FEATURED</span>}
                                {item.listingType === 'Rent' && <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-tl-lg shadow-sm">FOR RENT</span>}
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <div className="text-xs text-slate-500 truncate mb-1 uppercase tracking-wider">{item.brand} {item.model}</div>
                                <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-yellow-500 transition-colors">{item.title}</h3>
                                <div className="mt-auto">
                                    <div className="text-lg font-bold text-white">
                                        <span className="text-xs text-yellow-500 mr-1">{item.currency}</span>
                                        {item.price?.toLocaleString()}
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/50 mt-3">
                                        <div className="flex items-center text-[10px] text-slate-400 truncate max-w-[65%]">
                                            <MapPin size={10} className="mr-1 flex-shrink-0 text-slate-500"/> {item.location}
                                        </div>
                                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{item.condition}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
      {viewItem && (
          <ProductDetailOverlay 
            item={viewItem} 
            onClose={() => setViewItem(null)} 
          />
      )}
    </div>
  );
};

export default MarketplaceLayout;