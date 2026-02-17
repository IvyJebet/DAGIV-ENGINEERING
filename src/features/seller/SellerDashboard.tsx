import React, { useState, useEffect } from 'react';
import { 
  Wallet, Package, TrendingUp, PlusCircle, 
  ArrowRight, DollarSign, RefreshCw 
} from 'lucide-react';
import { PageView } from '@/types';
import { SellItemModal } from '@/features/seller/components/SellItemModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface DashboardData {
  wallet: { balance_available: number; balance_pending: number; currency: string };
  inventory: { total_listings: number; active_listings: number };
  listings: any[];
  performance: { rating: number };
}

export const SellerDashboard = ({ 
  token, 
  onLogout, 
  setPage 
}: { 
  token: string; 
  onLogout: () => void; 
  setPage: (p: PageView) => void;
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // STATE TO CONTROL THE MODAL VISIBILITY
  const [showListingModal, setShowListingModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/seller/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <div className="p-20 text-center text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white">Seller Command Center</h1>
            <p className="text-slate-400 text-sm">Manage your fleet, wallet, and orders.</p>
          </div>
          <div className="flex gap-4">
            {/* Opens the modal in WIZARD mode */}
            <button 
              onClick={() => setShowListingModal(true)} 
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded font-bold flex items-center shadow-lg"
            >
              <PlusCircle size={18} className="mr-2"/> New Listing
            </button>
            <button onClick={onLogout} className="border border-slate-700 text-slate-400 px-4 py-2 rounded hover:text-white hover:bg-slate-800">
              Log Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
     
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 bg-green-500/10 rounded-bl-2xl">
              <Wallet className="text-green-500" size={24} />
            </div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Available for Payout</div>
            <div className="text-3xl font-black text-white mb-1">
              {data?.wallet?.currency} {data?.wallet?.balance_available?.toLocaleString()}
            </div>
            <button className="text-xs font-bold text-green-500 flex items-center mt-2 hover:underline">
              Request Withdrawal <ArrowRight size={12} className="ml-1"/>
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-yellow-500/10 rounded-bl-2xl">
              <DollarSign className="text-yellow-500" size={24} />
            </div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pending (Escrow)</div>
            <div className="text-3xl font-black text-white mb-1">
              {data?.wallet?.currency} {data?.wallet?.balance_pending?.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-2">Locked until buyer confirms delivery.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-blue-500/10 rounded-bl-2xl">
              <Package className="text-blue-500" size={24} />
            </div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Inventory</div>
            <div className="text-3xl font-black text-white mb-1">
              {data?.inventory?.active_listings} <span className="text-lg text-slate-500 font-normal">/ {data?.inventory?.total_listings} Total</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center">
              <TrendingUp size={12} className="mr-1 text-green-500"/> Performance Rating: {data?.performance?.rating}/5.0
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center"><RefreshCw size={18} className="mr-2 text-slate-500"/> Recent Uploads</h3>
            <button className="text-sm text-yellow-500 font-bold hover:underline">View All Inventory</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-400">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950">
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Date Added</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.listings?.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center">No listings yet. Start selling!</td></tr>
                ) : (
                  data?.listings?.map((item: any) => (
                    <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-bold text-white">{item.brand} {item.model}</td>
                      <td className="px-6 py-4">{item.currency} {item.price.toLocaleString()}</td>
                      <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-400 hover:text-white font-bold">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL TRIGGERED FROM DASHBOARD */}
        {showListingModal && (
            <SellItemModal 
                onClose={() => setShowListingModal(false)} 
                initialStage="WIZARD" 
                onLoginSuccess={() => {}} // No-op because we are already logged in
            />
        )}

      </div>
    </div>
  );
};