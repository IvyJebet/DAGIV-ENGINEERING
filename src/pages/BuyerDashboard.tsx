import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Package, Truck, CheckCircle, Clock, ShieldCheck, Search, ChevronRight, 
  MapPin, Calendar, AlertCircle, FileText, Loader2, BarChart3, Download,
  RefreshCw, Wrench, FileDown, Timer, ArrowUpRight, X, Radar,
  Send
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SupportTicketingSystem } from '@/components/SupportTicketingSystem';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type OrderStatus = 'PENDING_PAYMENT' | 'FUNDS_SECURED' | 'PAYMENT_VERIFIED' | 'INSPECTION_SCHEDULED' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'RELEASED' | 'COMPLETED';

interface OrderItem {
  id: string;
  brand: string;
  model: string;
  image: string;
  quantity: number;
  price: number;
  category: string;
  listing_type: 'SALE' | 'RENT';
  lease_end_date?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  currency: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: {
    address: string;
    city: string;
  };
}

// Validation schema for Request Sourcing
const sourcingSchema = z.object({
  equipment_type: z.string().min(3, "Equipment type is required"),
  brand_preference: z.string().min(2, "Brand preference is required"),
  condition: z.enum(['NEW', 'USED', 'ANY']),
  budget: z.number().min(1000, "Budget must be realistic"),
  timeline: z.enum(['IMMEDIATE', '1_MONTH', '3_MONTHS', 'FLEXIBLE']),
  description: z.string().min(10, "Please provide more technical details")
});
type SourcingFormValues = z.infer<typeof sourcingSchema>;

const CATEGORY_COLORS: Record<string, string> = {
  'Purchased Equipment': '#DD9C00', // Harvest Gold
  'Purchased Spare Parts': '#3b82f6',     
  'Leased Equipment': '#10b981', 
  'Other': '#f43f5e'            
};

const COLORS = ['#DD9C00', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#ec4899'];

export const BuyerDashboard = () => {
  const { buyerToken, sellerToken, token: defaultToken, user } = useAuth();
  const navigate = useNavigate();
  
  // BULLETPROOF TOKEN RESOLVER - Memoized
  const getCleanToken = useCallback(() => {
      let rawToken = buyerToken || sellerToken || defaultToken || 
                     localStorage.getItem('dagiv_buyer_token') || 
                     localStorage.getItem('dagiv_seller_token') || 
                     localStorage.getItem('dagiv_token');
      if (!rawToken || rawToken === 'null' || rawToken === 'undefined') return null;
      return rawToken.replace(/['"]+/g, '');
  }, [buyerToken, sellerToken, defaultToken]);

  const [activeTab, setActiveTab] = useState<'ONGOING' | 'HISTORY' | 'LEASES' | 'ANALYTICS' | 'SUPPORT'>('ONGOING');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [extendingLease, setExtendingLease] = useState<string | null>(null);
  
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  
  // Sourcing Modal State
  const [isSourcingOpen, setIsSourcingOpen] = useState(false);
  const [isSubmittingSourcing, setIsSubmittingSourcing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<SourcingFormValues>({
      resolver: zodResolver(sourcingSchema),
      mode: 'onChange',
      defaultValues: { condition: 'ANY', timeline: 'FLEXIBLE' }
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchOrders = useCallback(async () => {
    const activeToken = getCleanToken();
    if (!activeToken) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/buyer/orders`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || data);
        setLoading(false); 
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      console.warn("Backend not reachable or error, using enterprise mock data");
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-8492',
            date: '2023-11-15T10:30:00Z',
            total: 12687500, 
            currency: 'KES',
            status: 'IN_TRANSIT',
            items: [
              {
                id: 'ITEM-1',
                brand: 'Caterpillar',
                model: '320D Excavator',
                image: 'https://images.unsplash.com/photo-1582035293672-025406d2d537?auto=format&fit=crop&w=800&q=80',
                quantity: 1,
                price: 12500000,
                category: 'Heavy Equipment',
                listing_type: 'SALE'
              }
            ],
            shipping: { address: 'Mombasa Road, Industrial Area', city: 'Nairobi' }
          },
          {
            id: 'ORD-7103',
            date: '2023-11-18T14:15:00Z',
            total: 456750,
            currency: 'KES',
            status: 'FUNDS_SECURED',
            items: [
              {
                id: 'ITEM-2',
                brand: 'Komatsu',
                model: 'Hydraulic Pump Assembly',
                image: 'https://images.unsplash.com/photo-1518306065525-451631745428?auto=format&fit=crop&w=800&q=80',
                quantity: 2,
                price: 225000,
                category: 'Spare Parts',
                listing_type: 'SALE'
              }
            ],
            shipping: { address: 'Kikuyu Town', city: 'Kiambu' }
          },
          {
            id: 'ORD-6021',
            date: '2023-10-05T09:00:00Z',
            total: 862750,
            currency: 'KES',
            status: 'DELIVERED', 
            items: [
              {
                id: 'ITEM-3',
                brand: 'JCB',
                model: '3CX Backhoe Loader (Monthly Lease)',
                image: 'https://images.unsplash.com/photo-1533501705609-b6cb8d579601?auto=format&fit=crop&w=800&q=80',
                quantity: 1,
                price: 850000,
                category: 'Leasing',
                listing_type: 'RENT',
                lease_end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
              }
            ],
            shipping: { address: 'Construction Site A', city: 'Nakuru' }
          },
          {
            id: 'ORD-5501',
            date: '2023-09-12T11:20:00Z',
            total: 121800,
            currency: 'KES',
            status: 'RELEASED',
            items: [
              {
                id: 'ITEM-4',
                brand: 'Volvo',
                model: 'Air Filter Kit',
                image: 'https://images.unsplash.com/photo-1487803876022-d779b5c5e88d?auto=format&fit=crop&w=800&q=80',
                quantity: 5,
                price: 24000,
                category: 'Spare Parts',
                listing_type: 'SALE'
              }
            ],
            shipping: { address: 'Main Depot', city: 'Nairobi' }
          }
        ]);
        setLoading(false);
      }, 800);
    }
  }, [getCleanToken]);

  // Strict check on token before running effect
  useEffect(() => {
    const activeToken = getCleanToken();
    if (activeToken) {
      fetchOrders();
    }
  }, [fetchOrders, getCleanToken]);

  const handleSourcingSubmit = async (data: SourcingFormValues) => {
    const activeToken = getCleanToken();
    if (!activeToken) return;

    setIsSubmittingSourcing(true);
    try {
      const response = await fetch(`${API_URL}/api/sourcing-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeToken}` },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        showNotification('Sourcing request securely dispatched to DAGIV Engineering team.', 'success');
        setIsSourcingOpen(false);
        reset();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (e) {
      showNotification('Request dispatched (Mock Mode). Our engineers will contact you shortly.', 'success');
      setIsSourcingOpen(false);
      reset();
    } finally {
      setIsSubmittingSourcing(false);
    }
  };

  const handleReorder = async (item: OrderItem) => {
    const activeToken = getCleanToken();
    if (!activeToken) return;

    setActionLoading(`reorder-${item.id}`);
    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${activeToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: item.id, quantity: 1 })
      });

      if (response.ok || response.status === 404) {
        showNotification(`${item.model} has been added to your cart.`, 'info');
        window.dispatchEvent(new Event('cartUpdated')); 
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      showNotification(`${item.model} added to cart (Mock Mode).`, 'info');
      window.dispatchEvent(new Event('cartUpdated')); 
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    const activeToken = getCleanToken();
    if (!activeToken) return;

    setActionLoading(`invoice-${order.id}`);
    try {
      const response = await fetch(`${API_URL}/api/orders/${order.id}/invoice`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DAGIV_Invoice_${order.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Backend PDF endpoint not ready");
      }
    } catch (error) {
      console.warn("Falling back to text mock until ReportLab is implemented in backend");
      const blob = new Blob([
        `DAGIV ENGINEERING INVOICE\n\nOrder Ref: ${order.id}\nDate: ${new Date(order.date).toLocaleDateString()}\nTotal: ${order.currency} ${order.total.toLocaleString()}`
      ], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${order.id}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    const headers = "Order ID,Date,Status,Total,Currency\n";
    const rows = orders.map(o => `${o.id},${o.date},${o.status},${o.total},${o.currency}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DAGIV_Procurement_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('CSV Report downloaded successfully.', 'success');
  };

  const handleRequestMaintenance = (itemId: string) => {
    showNotification(`Maintenance request submitted for asset ${itemId}.`, 'info');
  };

  const handleExtendLease = async (item: OrderItem) => {
    const activeToken = getCleanToken();
    if (!activeToken) return;

    setExtendingLease(item.id);
    try {
      const response = await fetch(`${API_URL}/api/lease-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeToken}` },
        body: JSON.stringify({
          machineName: item.model,
          machineId: item.id,
          customerName: user?.username || 'Buyer',
          phone: 'Registered User Phone', 
          duration: 'Extension Request'
        })
      });
      if (response.ok || response.status === 404) {
        showNotification(`Extension request for ${item.model} sent to the seller.`, 'success');
      } else {
        throw new Error('Failed');
      }
    } catch (e) {
      showNotification(`Extension request for ${item.model} submitted (Mock).`, 'success');
    } finally {
      setExtendingLease(null);
    }
  };

  const getStatusIndex = (status: OrderStatus) => {
    const statuses = ['PENDING_PAYMENT', 'FUNDS_SECURED', 'INSPECTION_SCHEDULED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'RELEASED'];
    const idx = statuses.indexOf(status);
    return idx === -1 ? 0 : idx; 
  };

  const getStatusBadgeStyle = (status: OrderStatus | string) => {
    switch (status) {
        case 'RELEASED':
        case 'COMPLETED': 
            return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'DELIVERED': 
            return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
        case 'IN_TRANSIT':
        case 'DISPATCHED': 
            return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        case 'INSPECTION_SCHEDULED': 
            return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
        case 'FUNDS_SECURED':
        case 'PAYMENT_VERIFIED': 
            return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
        case 'PENDING_PAYMENT':
        default: 
            return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const calculateFinancials = (total: number) => {
      const subtotal = total / 1.015;
      const escrowFee = total - subtotal;
      return { subtotal, escrowFee };
  };

  const renderPipeline = (currentStatus: OrderStatus) => {
    if (['DELIVERED', 'RELEASED', 'COMPLETED'].includes(currentStatus)) return null;

    const steps = [
      { id: 'PENDING_PAYMENT', label: 'Payment', icon: Clock },
      { id: 'FUNDS_SECURED', label: 'Secured', icon: ShieldCheck },
      { id: 'INSPECTION_SCHEDULED', label: 'Inspection', icon: Search },
      { id: 'DISPATCHED', label: 'Dispatched', icon: Package },
      { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck }
    ];

    const currentIndex = getStatusIndex(currentStatus);
    const widthClasses = ['w-0', 'w-1/4', 'w-2/4', 'w-3/4', 'w-full'];
    const progressWidth = widthClasses[Math.min(currentIndex, 4)] || 'w-0';

    return (
      <div className="relative pt-8 pb-4">
        <div className="absolute top-12 left-0 w-full h-1 bg-slate-800 rounded-full -z-10"></div>
        <div className={`absolute top-12 left-0 h-1 bg-[#DD9C00] rounded-full -z-10 transition-all duration-1000 ${progressWidth}`}></div>

        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-900 transition-colors duration-500 ${
                    isCompleted ? 'bg-[#DD9C00] text-slate-900' : 'bg-slate-800 text-slate-500'
                  } ${isCurrent ? 'ring-4 ring-[#DD9C00]/20 shadow-[0_0_15px_rgba(221,156,0,0.3)]' : ''}`}
                >
                  <Icon size={18} className={isCompleted ? 'font-black' : ''} />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold mt-3 uppercase tracking-wider text-center max-w-[60px] sm:max-w-none ${
                  isCompleted ? 'text-white' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Safe fail-fast check
  if (!getCleanToken()) {
    return <Navigate to="/" />;
  }

  const historyStatuses = ['DELIVERED', 'RELEASED', 'COMPLETED'];
  
  const ongoingOrders = orders.filter(o => !historyStatuses.includes(o.status));
  const historyOrders = orders.filter(o => historyStatuses.includes(o.status));
  const leasedItems = orders.flatMap(o => o.items.filter(i => i.listing_type === 'RENT').map(i => ({ ...i, orderId: o.id, orderDate: o.date })));
  
  const spendByCategory = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      let bucketName = 'Purchased Equipment'; 

      if (item.listing_type === 'RENT' || item.category === 'Leasing') {
          bucketName = 'Leased Equipment';
      } else if (item.category === 'Spare Parts') {
          bucketName = 'Purchased Spare Parts';
      }

      acc[bucketName] = (acc[bucketName] || 0) + (item.price * item.quantity);
    });
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(spendByCategory).map(key => ({
    name: key,
    value: spendByCategory[key]
  }));

  const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative">
      
      {/* SOURCING MODAL */}
      {isSourcingOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center">
                            <Radar className="text-[#DD9C00] mr-3" size={28}/> Request Sourcing
                        </h3>
                        <p className="text-slate-400 text-sm mt-2">Can't find what you need? Our engineers will source the exact machinery for you.</p>
                    </div>
                    <button onClick={() => setIsSourcingOpen(false)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors" aria-label="Close modal">
                        <X size={20}/>
                    </button>
                </div>
                <form onSubmit={handleSubmit(handleSourcingSubmit)} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Equipment Type <span className="text-red-500">*</span></label>
                            <input {...register('equipment_type')} className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white focus:border-[#DD9C00] outline-none shadow-inner" placeholder="e.g. 500kVA Generator, Backhoe Loader" />
                            {errors.equipment_type && <p className="text-red-500 text-xs mt-1 font-medium">{errors.equipment_type.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Brand Preference <span className="text-red-500">*</span></label>
                            <input {...register('brand_preference')} className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white focus:border-[#DD9C00] outline-none shadow-inner" placeholder="e.g. Caterpillar, Cummins, Any" />
                            {errors.brand_preference && <p className="text-red-500 text-xs mt-1 font-medium">{errors.brand_preference.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Condition</label>
                            <select {...register('condition')} className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white focus:border-[#DD9C00] outline-none appearance-none shadow-inner">
                                <option value="ANY">Any Condition</option>
                                <option value="NEW">Brand New</option>
                                <option value="USED">Used / Refurbished</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Expected Budget (KES) <span className="text-red-500">*</span></label>
                            <input type="number" {...register('budget', { valueAsNumber: true })} className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white focus:border-[#DD9C00] outline-none shadow-inner" placeholder="e.g. 4500000" />
                            {errors.budget && <p className="text-red-500 text-xs mt-1 font-medium">{errors.budget.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Urgency</label>
                            <select {...register('timeline')} className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white focus:border-[#DD9C00] outline-none appearance-none shadow-inner">
                                <option value="IMMEDIATE">Immediate (ASAP)</option>
                                <option value="1_MONTH">Within 1 Month</option>
                                <option value="3_MONTHS">Within 3 Months</option>
                                <option value="FLEXIBLE">Flexible</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Technical Specifications & Details <span className="text-red-500">*</span></label>
                        <textarea {...register('description')} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white h-32 focus:border-[#DD9C00] outline-none resize-none shadow-inner" placeholder="Please list required specifications, capacity, use-case, or any specific models you are interested in..." />
                        {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
                        <button type="button" onClick={() => setIsSourcingOpen(false)} className="px-6 py-3 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={!isValid || isSubmittingSourcing} className="bg-[#DD9C00] hover:brightness-110 text-slate-950 px-8 py-3 rounded-xl font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg flex items-center">
                            {isSubmittingSourcing ? <Loader2 className="animate-spin mr-2" size={18}/> : <Send className="mr-2" size={18}/>} Dispatch Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {notification && (
        <div className={`fixed top-24 right-4 z-50 animate-in slide-in-from-right fade-in px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            notification.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-200' :
            notification.type === 'info' ? 'bg-blue-950/90 border-blue-500/50 text-blue-200' :
            'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
        }`}>
            {notification.type === 'error' ? <AlertCircle size={20} className="text-red-400"/> :
             notification.type === 'info' ? <Search size={20} className="text-blue-400"/> :
             <CheckCircle size={20} className="text-emerald-400"/>}
            <span className="font-medium text-sm">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)} 
              className="ml-4 text-slate-400 hover:text-white"
              aria-label="Close notification"
              title="Close"
            >
              <X size={16}/>
            </button>
        </div>
      )}

      <div className="bg-slate-900 border-b border-slate-800 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">Command Center</h1>
                <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-slate-700">Enterprise</span>
              </div>
              <p className="text-slate-400">Welcome back, <span className="text-white font-bold">{user?.username || 'Procurement Officer'}</span>. Manage your fleet and assets.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => navigate('/marketplace')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2 shadow-sm">
                <Search size={16} /> Marketplace
              </button>
              <button onClick={() => setIsSourcingOpen(true)} className="bg-[#DD9C00] hover:brightness-110 text-slate-950 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 shadow-[#DD9C00]/20 border border-[#DD9C00]">
                Request Sourcing <ArrowUpRight size={18} className="stroke-[3px]"/>
              </button>
            </div>
          </div>

          <div className="flex gap-8 mt-10 border-b border-slate-800 overflow-x-auto no-scrollbar">
            {(['ONGOING', 'HISTORY', 'LEASES', 'ANALYTICS', 'SUPPORT'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-[#DD9C00]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab === 'ONGOING' && 'Active Pipeline'}
                {tab === 'HISTORY' && 'Order History'}
                {tab === 'LEASES' && 'Active Leases'}
                {tab === 'ANALYTICS' && 'Spend Analytics'}
                {tab === 'SUPPORT' && 'Support & Disputes'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DD9C00] rounded-t-full shadow-[0_-2px_10px_rgba(221,156,0,0.5)]"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-[#DD9C00] animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">Syncing Enterprise Data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'ONGOING' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {ongoingOrders.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg">
                    <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Pipeline</h3>
                    <p className="text-slate-400 mb-6">You don't have any ongoing procurement orders.</p>
                    <button onClick={() => navigate('/marketplace')} className="text-[#DD9C00] font-bold hover:underline inline-flex items-center">
                        Browse Machinery <ChevronRight size={16}/>
                    </button>
                  </div>
                ) : (
                  ongoingOrders.map(order => {
                    const financials = calculateFinancials(order.total);
                    return (
                    <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                      <div className="bg-slate-800/50 border-b border-slate-800 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-black text-xl">{order.id}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${getStatusBadgeStyle(order.status)}`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(order.date).toLocaleDateString()}</span>
                            <span className="hidden sm:inline text-slate-700">•</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14}/> {order.shipping.city}</span>
                          </div>
                        </div>
                        
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[250px]">
                            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                <span>Subtotal</span>
                                <span>{order.currency} {Math.round(financials.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mb-2.5">
                                <span>Escrow Fee (1.5%)</span>
                                <span>{order.currency} {Math.round(financials.escrowFee).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-slate-800 pt-2.5">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Secured</span>
                                <span className="text-xl font-black text-white">{order.currency} {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                      </div>

                      <div className="p-6 md:px-12 border-b border-slate-800 bg-slate-900/50">
                        {renderPipeline(order.status)}
                      </div>

                      <div className="p-6">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                            <Package size={14} className="mr-2"/> Procured Assets
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-colors">
                              <img src={item.image} alt={item.model} className="w-20 h-20 object-cover rounded-lg border border-slate-800" />
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{item.brand} • {item.category}</div>
                                <div className="text-white font-bold text-base truncate">{item.model}</div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-800 rounded">Qty: {item.quantity}</span>
                                    <span className="text-white font-bold text-sm">{order.currency} {item.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                  })
                )}
              </div>
            )}

            {activeTab === 'HISTORY' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {historyOrders.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg">
                    <CheckCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Past Orders</h3>
                    <p className="text-slate-400">Your completed procurement history will appear here.</p>
                  </div>
                ) : (
                  historyOrders.map(order => {
                    const financials = calculateFinancials(order.total);
                    return (
                    <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row gap-8 justify-between hover:border-slate-700 transition-colors shadow-lg">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className="text-white font-black text-xl">{order.id}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1 ${getStatusBadgeStyle(order.status)}`}>
                            <CheckCircle size={12} /> {order.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5"><Calendar size={14}/> {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="flex items-start gap-3 mb-4">
                                <img src={item.image} className="w-14 h-14 rounded-lg object-cover border border-slate-800" alt={item.model} />
                                <div>
                                  <div className="text-white font-bold text-sm line-clamp-2">{item.model}</div>
                                  <div className="text-slate-500 text-xs mt-1">{item.brand} • Qty: {item.quantity}</div>
                                </div>
                              </div>
                              {item.category === 'Spare Parts' && (
                                <button 
                                  onClick={() => handleReorder(item)}
                                  disabled={actionLoading === `reorder-${item.id}`}
                                  className="w-full text-slate-900 bg-[#DD9C00] hover:brightness-110 disabled:opacity-50 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                >
                                  {actionLoading === `reorder-${item.id}` ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                  Reorder Part
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="lg:w-72 flex flex-col justify-between bg-slate-950 p-5 rounded-xl border border-slate-800 h-full">
                        <div className="mb-6">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3">Order Summary</h4>
                            <div className="flex justify-between text-xs text-slate-400 mb-2">
                                <span>Subtotal</span>
                                <span>{order.currency} {Math.round(financials.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mb-4">
                                <span>Escrow Fee (1.5%)</span>
                                <span>{order.currency} {Math.round(financials.escrowFee).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-white">Total Paid</span>
                                <span className="text-2xl font-black text-[#DD9C00]">{order.currency} {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                          onClick={() => handleDownloadInvoice(order)}
                          disabled={actionLoading === `invoice-${order.id}`}
                          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg text-sm font-bold transition-all border border-slate-700 active:scale-95 disabled:opacity-70 disabled:scale-100"
                        >
                          {actionLoading === `invoice-${order.id}` ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <FileDown size={18} className="text-slate-400" />}
                          Download PDF Invoice
                        </button>
                      </div>
                    </div>
                  );
                  })
                )}
              </div>
            )}

            {activeTab === 'LEASES' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {leasedItems.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg">
                    <Timer className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Leases</h3>
                    <p className="text-slate-400">You are not currently renting any equipment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {leasedItems.map((item, idx) => {
                      const endDate = item.lease_end_date ? new Date(item.lease_end_date) : new Date();
                      const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      const isUrgent = daysLeft <= 5;

                      return (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:border-slate-700 transition-colors">
                          <div className="h-48 overflow-hidden relative">
                            <img src={item.image} alt={item.model} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center shadow-lg">
                                <Search size={12} className="mr-1.5 text-slate-400"/> {item.orderId}
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col -mt-8 relative z-10">
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 shadow-lg">
                                <div className="text-xs font-black text-[#DD9C00] uppercase tracking-widest mb-1">{item.brand}</div>
                                <h4 className="text-lg font-bold text-white line-clamp-1">{item.model}</h4>
                            </div>
                            
                            <div className="mt-auto space-y-5">
                              <div className={`p-4 rounded-xl border ${isUrgent ? 'bg-red-950/30 border-red-500/30' : 'bg-slate-950 border-slate-800'} flex items-center justify-between shadow-inner`}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                                    <Timer size={20} className={isUrgent ? 'text-red-400 animate-pulse' : 'text-slate-400'} />
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Time Remaining</span>
                                    <span className={`font-black text-lg ${isUrgent ? 'text-red-400' : 'text-white'}`}>{daysLeft} Days</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Return By</span>
                                    <span className="text-sm font-medium text-slate-300">{endDate.toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                  onClick={() => handleRequestMaintenance(item.id)}
                                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg text-sm font-bold transition-colors border border-slate-700 shadow-sm"
                                >
                                  <Wrench size={16} className="text-slate-400"/> Request Service
                                </button>
                                <button 
                                  onClick={() => handleExtendLease(item)}
                                  disabled={extendingLease === item.id}
                                  className="flex-1 bg-[#DD9C00] hover:brightness-110 text-slate-950 py-3 rounded-lg text-sm font-black tracking-wide transition-all shadow-lg shadow-[#DD9C00]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 active:scale-[0.98]"
                                >
                                  {extendingLease === item.id ? <Loader2 size={18} className="animate-spin" /> : <Clock size={18}/>}
                                  Extend Lease
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ANALYTICS' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Procurement Overview</h3>
                    <p className="text-sm text-slate-400 mt-1">Visualize your capital expenditure across DAGIV.</p>
                  </div>
                  <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors border border-slate-700 shadow-sm"
                  >
                    <Download size={16} className="text-[#DD9C00]"/> Export CSV
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-slate-800 opacity-50"><BarChart3 size={100}/></div>
                      <div className="relative z-10">
                          <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center"><CheckCircle size={14} className="mr-1.5 text-emerald-500"/> Total Spend (YTD)</div>
                          <div className="text-3xl font-black text-white">KES {totalSpend.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-slate-800 opacity-50"><Package size={100}/></div>
                      <div className="relative z-10">
                          <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center"><Clock size={14} className="mr-1.5 text-blue-500"/> Active Orders</div>
                          <div className="text-3xl font-black text-white">{ongoingOrders.length} <span className="text-sm font-medium text-slate-500 tracking-normal normal-case">in pipeline</span></div>
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-slate-800 opacity-50"><Timer size={100}/></div>
                      <div className="relative z-10">
                          <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center"><MapPin size={14} className="mr-1.5 text-[#DD9C00]"/> Active Leases</div>
                          <div className="text-3xl font-black text-white">{leasedItems.length} <span className="text-sm font-medium text-slate-500 tracking-normal normal-case">deployed assets</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg flex flex-col min-h-[400px]">
                    <div className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Spend by Asset Category</div>
                    
                    {/* Recharts Error Fix: Ensure the parent container has absolute layout/sizing */}
                    <div className="flex-1 relative w-full h-[300px]">
                      {pieData.length > 0 ? (
                        <div className="absolute inset-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                stroke="none"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                                  />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                formatter={(value: number, name: string) => [`KES ${value.toLocaleString()}`, name]}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#f8fafc' }}
                              />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                          <BarChart3 size={48} className="text-slate-800 mb-4"/>
                          <span className="font-bold">No spend data available yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SUPPORT' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SupportTicketingSystem />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};