import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  MapPin, 
  Calendar,
  AlertCircle,
  FileText,
  Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type OrderStatus = 'AWAITING_PAYMENT' | 'PAYMENT_VERIFIED' | 'INSPECTION_SCHEDULED' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED';

interface Order {
  id: string;
  date: string;
  total: number;
  currency: string;
  status: OrderStatus;
  items: {
    brand: string;
    model: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  shipping: {
    address: string;
    city: string;
  };
}

export const BuyerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ONGOING' | 'HISTORY' | 'SAVED'>('ONGOING');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from /api/buyer/orders
      // Mocking the response for the UI demonstration
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-8492',
            date: '2023-11-15T10:30:00Z',
            total: 12500000,
            currency: 'KES',
            status: 'IN_TRANSIT',
            items: [
              {
                brand: 'Caterpillar',
                model: '320D Excavator',
                image: 'https://images.unsplash.com/photo-1582035293672-025406d2d537?auto=format&fit=crop&w=800&q=80',
                quantity: 1,
                price: 12500000
              }
            ],
            shipping: {
              address: 'Mombasa Road, Industrial Area',
              city: 'Nairobi'
            }
          },
          {
            id: 'ORD-7103',
            date: '2023-11-18T14:15:00Z',
            total: 450000,
            currency: 'KES',
            status: 'PAYMENT_VERIFIED',
            items: [
              {
                brand: 'Komatsu',
                model: 'Hydraulic Pump Assembly',
                image: 'https://images.unsplash.com/photo-1518306065525-451631745428?auto=format&fit=crop&w=800&q=80',
                quantity: 2,
                price: 225000
              }
            ],
            shipping: {
              address: 'Kikuyu Town',
              city: 'Kiambu'
            }
          }
        ]);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.warn("Backend not reachable, using preview fallback for orders");
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  const getStatusIndex = (status: OrderStatus) => {
    const statuses: OrderStatus[] = ['AWAITING_PAYMENT', 'PAYMENT_VERIFIED', 'INSPECTION_SCHEDULED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];
    return statuses.indexOf(status);
  };

  const renderPipeline = (currentStatus: OrderStatus) => {
    const steps = [
      { id: 'AWAITING_PAYMENT', label: 'Payment', icon: Clock },
      { id: 'PAYMENT_VERIFIED', label: 'Verified', icon: ShieldCheck },
      { id: 'INSPECTION_SCHEDULED', label: 'Inspection', icon: Search },
      { id: 'DISPATCHED', label: 'Dispatched', icon: Package },
      { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
      { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
    ];

    const currentIndex = getStatusIndex(currentStatus);
    
    // 🛠️ FIX: Mapping indices directly to Tailwind fractional width classes
    const widthClasses = ['w-0', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];
    const progressWidth = widthClasses[currentIndex] || 'w-0';

    return (
      <div className="relative pt-8 pb-4">
        {/* Connecting Line */}
        <div className="absolute top-12 left-0 w-full h-1 bg-slate-800 rounded-full -z-10"></div>
        <div 
          className={`absolute top-12 left-0 h-1 bg-yellow-500 rounded-full -z-10 transition-all duration-1000 ${progressWidth}`}
        ></div>

        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-900 transition-colors duration-500 ${
                    isCompleted ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-500'
                  } ${isCurrent ? 'ring-4 ring-yellow-500/20' : ''}`}
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Dashboard Header */}
      <div className="bg-slate-900 border-b border-slate-800 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Buyer Dashboard</h1>
              <p className="text-slate-400">Welcome back, <span className="text-white font-bold">{user?.username}</span>. Track your orders and manage your fleet.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate('/marketplace')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors border border-slate-700">
                Browse Marketplace
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg">
                Request Sourcing
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-10 border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('ONGOING')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'ONGOING' ? 'text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Ongoing Orders
              {activeTab === 'ONGOING' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('HISTORY')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'HISTORY' ? 'text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Order History
              {activeTab === 'HISTORY' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('SAVED')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'SAVED' ? 'text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Saved Items
              {activeTab === 'SAVED' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-t-full"></div>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'ONGOING' && (
              <div className="space-y-8">
                {orders.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                    <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Ongoing Orders</h3>
                    <p className="text-slate-400 mb-6">You don't have any active orders in the pipeline right now.</p>
                    <button onClick={() => navigate('/marketplace')} className="text-yellow-500 font-bold hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                      {/* Order Header */}
                      <div className="bg-slate-800/50 border-b border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-black text-lg">{order.id}</span>
                            <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(order.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin size={14}/> {order.shipping.city}</span>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-sm text-slate-400 mb-1">Total Amount</div>
                          <div className="text-xl font-black text-white">{order.currency} {order.total.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Pipeline Status */}
                      <div className="p-6 md:px-12 border-b border-slate-800 bg-slate-900/50">
                        {renderPipeline(order.status)}
                        
                        {/* Status Context Message */}
                        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-start gap-4">
                          <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
                          <div>
                            <h4 className="text-white font-bold text-sm mb-1">Current Status Update</h4>
                            <p className="text-slate-400 text-sm">
                              {order.status === 'PAYMENT_VERIFIED' && "Your payment is secured in Escrow. We are currently scheduling a certified inspector to verify the equipment condition before dispatch."}
                              {order.status === 'IN_TRANSIT' && "Your equipment is on the move! Our logistics partner has picked up the item and is heading to your delivery address. Ensure site access is clear."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Items in Order</h4>
                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                              <img src={item.image} alt={item.model} className="w-20 h-20 object-cover rounded-lg border border-slate-800" />
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-500 uppercase">{item.brand}</div>
                                <div className="text-white font-bold text-lg">{item.model}</div>
                                <div className="text-sm text-slate-400">Qty: {item.quantity}</div>
                              </div>
                              <div className="text-right hidden sm:block">
                                <div className="text-white font-bold">{order.currency} {item.price.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end gap-4">
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors px-4 py-2">
                          <FileText size={16} /> View Invoice
                        </button>
                        <button className="flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors px-4 py-2 bg-yellow-500/10 rounded-lg">
                          Contact Support <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'HISTORY' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Past Orders</h3>
                <p className="text-slate-400">Your completed orders will appear here.</p>
              </div>
            )}

            {activeTab === 'SAVED' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Saved Items</h3>
                <p className="text-slate-400">Items you save for later will appear here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};