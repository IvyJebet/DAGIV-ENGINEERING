import React, { useState } from 'react';
import { Filter, PlusCircle, MapPin } from 'lucide-react';
import { MarketItem, PageView } from '@/types';
import { MARKETPLACE_ITEMS, CATEGORY_STRUCTURE } from '@/config/constants';
import { SecureCheckoutModal } from '@/features/marketplace/components/SecureCheckoutModal';
import { ProductDetailOverlay } from '@/features/marketplace/components/ProductDetailOverlay';

interface MarketplaceProps {
  mode: 'BUY' | 'RENT';
  setPage: (p: any) => void;
  onSellClick: () => void;
  isSpareParts?: boolean;
}

const MarketplaceLayout: React.FC<MarketplaceProps> = ({ mode, setPage, onSellClick, isSpareParts = false }) => {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('All');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const [viewItem, setViewItem] = useState<MarketItem | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<MarketItem | null>(null);

  const filteredItems = MARKETPLACE_ITEMS.filter(item => {
    const typeMatch = isSpareParts ? item.type === 'Part' : item.type === 'Equipment';
    const modeMatch = mode === 'BUY' ? item.listingType === 'Sale' : item.listingType === 'Rent';
    const catMatch = selectedMainCat === 'All' || item.category === selectedMainCat;
    const subCatMatch = selectedSubCat === 'All' || item.subCategory.includes(selectedSubCat); 
    const searchMatch = item.title.toLowerCase().includes(search.toLowerCase()) || item.brand.toLowerCase().includes(search.toLowerCase());
    return typeMatch && modeMatch && catMatch && subCatMatch && searchMatch;
  });

  // @ts-ignore
  const activeSubCategories = selectedMainCat !== 'All' 
    // @ts-ignore
    ? (isSpareParts ? CATEGORY_STRUCTURE[selectedMainCat]?.parts || [] : CATEGORY_STRUCTURE[selectedMainCat]?.equipment || [])
    : [];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full flex relative">
               <input 
                  type="text" 
                  placeholder={isSpareParts ? "Search Parts..." : "Search Machines..."}
                  className="w-full bg-slate-950 border-y border-l border-slate-700 rounded-l text-white pl-4 pr-10 py-3 focus:outline-none focus:border-yellow-500"
                  onChange={(e) => setSearch(e.target.value)}
               />
               <button className="bg-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-r hover:bg-yellow-400">SEARCH</button>
            </div>
            <button onClick={onSellClick} className="hidden md:flex bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded font-bold items-center shadow-lg">
                <PlusCircle className="mr-2" size={18}/> {isSpareParts ? 'SELL PART' : 'LIST MACHINE'}
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-950 font-bold text-white flex items-center">
                    <Filter size={16} className="mr-2 text-yellow-500"/> Categories
                </div>
                <div className="p-2">
                    <button onClick={() => { setSelectedMainCat('All'); setSelectedSubCat('All'); }} className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${selectedMainCat === 'All' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'}`}>All</button>
                    {Object.keys(CATEGORY_STRUCTURE).map(cat => (
                        <button key={cat} onClick={() => { setSelectedMainCat(cat); setSelectedSubCat('All'); }} className={`w-full text-left px-3 py-2 rounded text-sm mb-1 truncate ${selectedMainCat === cat ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}>{cat}</button>
                    ))}
                </div>
                {selectedMainCat !== 'All' && (
                    <div className="border-t border-slate-800 p-2 bg-slate-950/50">
                        <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1">Sub-Categories</div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                           {activeSubCategories.map((sub: string) => (
                               <button key={sub} onClick={() => setSelectedSubCat(sub)} className={`w-full text-left px-3 py-1.5 rounded text-xs mb-1 truncate ${selectedSubCat === sub ? 'text-yellow-500 font-bold' : 'text-slate-400'}`}>{sub}</button>
                           ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-4">{selectedSubCat !== 'All' ? selectedSubCat : selectedMainCat} <span className="text-slate-500 text-sm font-normal">({filteredItems.length})</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                    <div key={item.id} onClick={() => setViewItem(item)} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:shadow-xl hover:border-yellow-500/50 transition-all cursor-pointer group flex flex-col">
                        <div className="h-48 bg-slate-950 relative">
                            <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            {item.promoted && <span className="absolute top-2 left-2 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">AD</span>}
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <div className="text-xs text-slate-500 truncate mb-1">{item.brand} {item.model}</div>
                            <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-tight">{item.title}</h3>
                            <div className="mt-auto">
                                <div className="text-lg font-bold text-white">{item.currency} {item.price.toLocaleString()}</div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 mt-2">
                                    <div className="flex items-center text-[10px] text-slate-400"><MapPin size={10} className="mr-1"/> {item.location}</div>
                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{item.condition}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {viewItem && (
          <ProductDetailOverlay item={viewItem} onClose={() => setViewItem(null)} onCheckout={() => { setViewItem(null); setCheckoutItem(viewItem); }} />
      )}
      {checkoutItem && (
          <SecureCheckoutModal item={checkoutItem} onClose={() => setCheckoutItem(null)} />
      )}
    </div>
  );
};

export default MarketplaceLayout;