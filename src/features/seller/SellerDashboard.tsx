import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, Package, TrendingUp, PlusCircle, AlertCircle, 
  ArrowRight, DollarSign, RefreshCw, X, BadgeCheck, 
  Truck, Clock, Settings, MapPin, Camera, FileText, 
  UploadCloud, List, Check, ChevronRight, ShoppingBag
} from 'lucide-react';
import { PageView } from '@/types';
import { SellItemModal } from './components/SellItemModal'; // Ensure this path is correct

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface DashboardData {
  wallet: { balance_available: number; balance_pending: number; currency: string };
  inventory: { total_listings: number; active_listings: number };
  listings: any[];
  performance: { rating: number };
}

interface Order {
  id: string;
  brand: string;
  model: string;
  amount: number;
  currency: string;
  status: string;
  buyer_contact: string;
  created_at: string;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS'>('OVERVIEW');
  
  // STATE TO CONTROL THE MODAL VISIBILITY
  const [showListingModal, setShowListingModal] = useState(false);

  // FETCH DASHBOARD DATA
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
    }
  };

  // FETCH ORDERS DATA
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/seller/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setOrders(json);
      }
    } catch (err) {
      console.error("Orders Load Error", err);
    }
  };

  // ORDER ACTION HANDLER
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if(!confirm(`Mark order as ${newStatus}?`)) return;
    try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}/update-status`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });
        if(res.ok) {
            alert("Order Status Updated!");
            fetchOrders(); // Refresh list
            fetchDashboard(); // Refresh wallet (if Completed)
        }
    } catch(err) {
        alert("Action failed");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDashboard(), fetchOrders()]).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Seller Command Center</h1>
            <p className="text-slate-400 text-sm">Manage fleet, fulfillment, and escrow wallet.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowListingModal(true)} 
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded-lg font-bold flex items-center shadow-lg transition-all"
            >
              <PlusCircle size={18} className="mr-2"/> New Listing
            </button>
            <button onClick={onLogout} className="border border-slate-700 text-slate-400 px-4 py-2 rounded-lg hover:text-white hover:bg-slate-800 transition-all">
              Log Out
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-6 mb-8">
            <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'OVERVIEW' ? 'text-white border-yellow-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
                Overview & Listings
            </button>
            <button 
                onClick={() => setActiveTab('ORDERS')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center ${activeTab === 'ORDERS' ? 'text-white border-yellow-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
                Incoming Orders
                {orders.length > 0 && <span className="ml-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{orders.length}</span>}
            </button>
        </div>

        {activeTab === 'OVERVIEW' ? (
        <>
            {/* STATS CARDS */}
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
                    <p className="text-xs text-slate-400 mt-2">Locked until delivery confirmed.</p>
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

            {/* LISTINGS TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center"><RefreshCw size={18} className="mr-2 text-slate-500"/> Recent Listings</h3>
                <button className="text-sm text-yellow-500 font-bold hover:underline">View All</button>
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
                        <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
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
        </>
        ) : (
        /* ORDERS TABLE (NEW) */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-800">
                <h3 className="text-white font-bold flex items-center"><ShoppingBag size={18} className="mr-2 text-yellow-500"/> Incoming Orders</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-950">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Item Details</th>
                            <th className="px-6 py-3">Buyer</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No active orders found.</td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{order.brand} {order.model}</div>
                                        <div className="text-xs">{order.listing_type}</div>
                                    </td>
                                    <td className="px-6 py-4">{order.buyer_contact}</td>
                                    <td className="px-6 py-4 font-bold text-yellow-500">{order.currency} {order.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                            order.status === 'COMPLETED' ? 'bg-green-900/20 border-green-500 text-green-500' :
                                            order.status === 'PENDING_PAYMENT' ? 'bg-yellow-900/20 border-yellow-500 text-yellow-500' :
                                            'bg-blue-900/20 border-blue-500 text-blue-500'
                                        }`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        {order.status === 'PAID_ESCROW' && (
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-500"
                                            >
                                                Ship Item
                                            </button>
                                        )}
                                        {order.status === 'SHIPPED' && (
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-500"
                                            >
                                                Complete
                                            </button>
                                        )}
                                        {order.status === 'PENDING_PAYMENT' && (
                                            <span className="text-xs text-slate-500 italic">Awaiting Payment</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        )}

        {/* MODAL TRIGGERED FROM DASHBOARD */}
        {showListingModal && (
            <SellItemModal 
                onClose={() => setShowListingModal(false)} 
                initialStage="WIZARD" 
                onLoginSuccess={() => {}} 
                onListingComplete={() => {
                    // 1. Refresh Data immediately
                    fetchDashboard(); 
                }}
            />
        )}

      </div>
    </div>
  );
};