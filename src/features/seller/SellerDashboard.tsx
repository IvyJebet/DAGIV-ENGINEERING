import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, 
  LogOut, PlusCircle, TrendingUp, DollarSign, Users 
} from 'lucide-react';
import { MarketItem } from '@/types';
import { MARKETPLACE_ITEMS } from '@/config/constants';
import { CostChart } from '@/features/fleet/Widgets'; 

interface SellerDashboardProps {
  token: string;
  onLogout: () => void;
  setPage: (page: any) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ token, onLogout, setPage }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data for the dashboard (In a real app, fetch this from API using the token)
  const myListings = MARKETPLACE_ITEMS.slice(0, 3); 

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="text-yellow-500 font-bold text-xs uppercase tracking-widest mb-1">Seller Central</div>
          <div className="text-white font-black text-xl">DASHBOARD</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} className="mr-3"/> Overview
          </button>
          <button onClick={() => setActiveTab('listings')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'listings' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} className="mr-3"/> My Inventory
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ShoppingCart size={20} className="mr-3"/> Orders
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-yellow-500 text-slate-900 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings size={20} className="mr-3"/> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors">
            <LogOut size={20} className="mr-3"/> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white capitalize">{activeTab}</h1>
          {/* This button triggers the modal logic in the parent App.tsx */}
          <button onClick={() => setPage('marketplace-sell')} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center shadow-lg">
            <PlusCircle className="mr-2" size={18}/> New Listing
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Revenue</div>
            <div className="text-2xl font-bold text-white flex items-center"><DollarSign size={20} className="text-yellow-500 mr-1"/> 4.2M</div>
            <div className="text-green-500 text-xs mt-2 flex items-center"><TrendingUp size={12} className="mr-1"/> +12% this month</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2">Active Listings</div>
            <div className="text-2xl font-bold text-white flex items-center"><Package size={20} className="text-blue-500 mr-1"/> 12</div>
            <div className="text-slate-400 text-xs mt-2">4 Pending Review</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2">Profile Views</div>
            <div className="text-2xl font-bold text-white flex items-center"><Users size={20} className="text-purple-500 mr-1"/> 1,240</div>
            <div className="text-green-500 text-xs mt-2 flex items-center"><TrendingUp size={12} className="mr-1"/> +5% this week</div>
          </div>
        </div>

        {/* Inventory Table Preview */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white">Recent Inventory</h3>
            <button className="text-yellow-500 text-sm">View All</button>
          </div>
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {myListings.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                  <td className="px-6 py-4"><span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs border border-green-900">Active</span></td>
                  <td className="px-6 py-4">{item.currency} {item.price.toLocaleString()}</td>
                  <td className="px-6 py-4">342</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Analytics Chart */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="font-bold text-white mb-6">Sales Performance</h3>
          <CostChart />
        </div>
      </main>
    </div>
  );
};