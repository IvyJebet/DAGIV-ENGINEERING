import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    MessageSquare, PlusCircle, Clock, 
    CheckCircle, X, Send, ShieldCheck, ChevronLeft, Loader2, Lock, EyeOff, UserPlus
} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ticketSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters").max(150),
    category: z.string().min(1, "Category is required"),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    initial_message: z.string().min(10, "Please provide more details (min 10 chars)")
});
type TicketFormValues = z.infer<typeof ticketSchema>;

export const SupportTicketingSystem = () => {
    const { token, user } = useAuth();
    const isStaff = user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'SUPPORT';
    
    const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Reply State
    const [replyMessage, setReplyMessage] = useState('');
    const [isInternalNote, setIsInternalNote] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<TicketFormValues>({
        resolver: zodResolver(ticketSchema),
        mode: 'onChange',
        defaultValues: { priority: 'MEDIUM', category: '' }
    });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/support/tickets?limit=50`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTickets(data.tickets);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTicketDetail = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/support/tickets/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedTicket(data);
                setView('DETAIL');
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTickets();
    }, [token]);

    const onCreateTicket = async (data: TicketFormValues) => {
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/support/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setIsCreateOpen(false);
                reset();
                fetchTickets();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const onReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;
        
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/support/tickets/${selectedTicket.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ message: replyMessage, is_internal_note: isInternalNote })
            });
            if (res.ok) {
                setReplyMessage('');
                setIsInternalNote(false);
                fetchTicketDetail(selectedTicket.id);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const updateTicketStatus = async (status: string, assignToMe: boolean = false) => {
        setSubmitting(true);
        try {
            const payload: any = {};
            if (status) payload.status = status;
            if (assignToMe) payload.assigned_agent_id = user?.id;

            const res = await fetch(`${API_URL}/api/support/tickets/${selectedTicket.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchTicketDetail(selectedTicket.id);
                fetchTickets(); // update list in background
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'OPEN': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'WAITING_ON_CUSTOMER': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'CLOSED': return 'bg-slate-800 text-slate-400 border-slate-700';
            default: return 'bg-slate-800 text-slate-300 border-slate-700';
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[600px] max-h-[800px] flex flex-col">
            
            {/* VIEW: LIST */}
            {view === 'LIST' && (
                <div className="flex flex-col h-full animate-in fade-in">
                    <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center">
                                <MessageSquare className="mr-3 text-yellow-500" /> 
                                {isStaff ? 'Agent Support Workspace' : 'Support Tickets'}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                {isStaff ? 'Triage and resolve customer inquiries.' : 'Manage inquiries, technical issues, and disputes.'}
                            </p>
                        </div>
                        {!isStaff && (
                            <button onClick={() => setIsCreateOpen(true)} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center shadow-lg">
                                <PlusCircle size={16} className="mr-2"/> New Ticket
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500"><Loader2 className="animate-spin mb-4" size={32} /> Loading queue...</div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
                                <CheckCircle className="mx-auto text-slate-600 mb-3" size={40}/>
                                <h3 className="text-white font-bold text-lg">No active issues</h3>
                                <p className="text-slate-500 text-sm">The queue is clean.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map(ticket => (
                                    <div 
                                        key={ticket.id} 
                                        onClick={() => fetchTicketDetail(ticket.id)}
                                        className="bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-yellow-500/50 cursor-pointer transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs font-mono text-slate-500">{ticket.id}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(ticket.status)}`}>{ticket.status.replace(/_/g, ' ')}</span>
                                                {isStaff && <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">PRIORITY: {ticket.priority}</span>}
                                            </div>
                                            <h4 className="text-white font-bold group-hover:text-yellow-500 transition-colors">{ticket.subject}</h4>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {isStaff ? <span className="text-white font-medium mr-2">Buyer: {ticket.buyer_name}</span> : null}
                                                Category: {ticket.category} • Updated {new Date(ticket.updated_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-slate-500 group-hover:text-yellow-500 transition-colors"><ChevronLeft size={20} className="rotate-180" /></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* VIEW: DETAIL THREAD */}
            {view === 'DETAIL' && selectedTicket && (
                <div className="flex flex-col h-full animate-in slide-in-from-right-8 absolute inset-0 bg-slate-900 z-10">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap gap-4 items-center justify-between shadow-md z-20">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setView('LIST')} 
                                aria-label="Back to ticket list" 
                                className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
                            >
                                <ChevronLeft size={18}/>
                            </button>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">{selectedTicket.subject}</h3>
                                <div className="flex items-center gap-3 text-xs mt-1">
                                    <span className="text-slate-500 font-mono">{selectedTicket.id}</span>
                                    <span className={`font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status.replace(/_/g, ' ')}</span>
                                    {isStaff && <span className="text-slate-400">User: <span className="text-white">{selectedTicket.buyer_name}</span></span>}
                                </div>
                            </div>
                        </div>
                        
                        {/* Agent/Admin Triage Controls */}
                        {isStaff && selectedTicket.status !== 'CLOSED' && (
                            <div className="flex items-center gap-2">
                                {!selectedTicket.assigned_agent_id && (
                                    <button onClick={() => updateTicketStatus('', true)} className="text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded flex items-center hover:bg-blue-500 hover:text-white transition-colors">
                                        <UserPlus size={14} className="mr-1.5"/> Assign to Me
                                    </button>
                                )}
                                {selectedTicket.status !== 'RESOLVED' && (
                                    <button onClick={() => updateTicketStatus('RESOLVED')} className="text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded flex items-center hover:bg-emerald-500 hover:text-white transition-colors">
                                        <CheckCircle size={14} className="mr-1.5"/> Mark Resolved
                                    </button>
                                )}
                            </div>
                        )}
                        {/* Buyer Close Control */}
                        {!isStaff && selectedTicket.status !== 'CLOSED' && (
                            <button onClick={() => updateTicketStatus('CLOSED')} className="text-xs font-bold text-slate-400 hover:text-red-400 transition-colors">
                                Close Ticket
                            </button>
                        )}
                    </div>

                    {/* Message Thread */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900 custom-scrollbar">
                        {selectedTicket.messages.map((msg: any) => {
                            const isMe = msg.sender_id === user?.id;
                            const isStaffMsg = msg.sender_role === 'ADMIN' || msg.sender_role === 'SUPPORT';
                            
                            return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold ${msg.is_internal_note ? 'text-purple-400' : 'text-slate-500'}`}>
                                            {isMe ? 'You' : msg.sender_name} 
                                            {isStaffMsg && !isMe && <ShieldCheck size={10} className="inline text-yellow-500 ml-1"/>}
                                            {msg.is_internal_note && <span className="ml-2 bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-400 flex items-center inline-flex"><EyeOff size={10} className="mr-1"/> Internal Note</span>}
                                        </span>
                                        <span className="text-[10px] text-slate-600">{new Date(msg.created_at).toLocaleString([], {hour: '2-digit', minute:'2-digit', month:'short', day:'numeric'})}</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[70%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                                        msg.is_internal_note ? 'bg-purple-900/40 border border-purple-500/30 text-purple-100 rounded-tl-sm' :
                                        isMe ? 'bg-yellow-500 text-slate-950 rounded-tr-sm' : 
                                        isStaffMsg ? 'bg-slate-800 border border-slate-700 text-white rounded-tl-sm' : 
                                        'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-sm'
                                    }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Input Box */}
                    {selectedTicket.status !== 'CLOSED' ? (
                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            {isStaff && (
                                <div className="mb-3 flex items-center gap-2 px-1">
                                    <input type="checkbox" id="internalNote" checked={isInternalNote} onChange={(e) => setIsInternalNote(e.target.checked)} className="accent-purple-500" />
                                    <label htmlFor="internalNote" className="text-xs font-bold text-slate-400 cursor-pointer flex items-center"><EyeOff size={12} className="mr-1.5"/> Add as Internal Note (Hidden from Buyer)</label>
                                </div>
                            )}
                            <form onSubmit={onReply} className="relative flex items-end gap-2">
                                <textarea 
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder={isInternalNote ? "Type an internal note to your team..." : "Type your reply to the customer..."}
                                    className={`w-full border rounded-xl text-white p-3 pr-14 text-sm outline-none resize-none h-14 transition-colors ${
                                        isInternalNote ? 'bg-purple-900/20 border-purple-500/50 focus:border-purple-400' : 'bg-slate-900 border-slate-700 focus:border-yellow-500'
                                    }`}
                                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onReply(e); } }}
                                />
                                <button 
                                    type="submit" 
                                    aria-label="Send reply"
                                    disabled={!replyMessage.trim() || submitting} 
                                    className={`absolute right-2 bottom-2 p-2 rounded-lg shadow-md disabled:opacity-50 transition-colors ${
                                        isInternalNote ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900'
                                    }`}
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center">
                            <Lock size={14} className="mr-2"/> Ticket Closed
                        </div>
                    )}
                </div>
            )}

            {/* CREATE MODAL OVERLAY (Buyers Only) */}
            {isCreateOpen && !isStaff && (
                <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90%]">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                            <h3 className="text-lg font-bold text-white">Create Support Request</h3>
                            <button 
                                onClick={() => setIsCreateOpen(false)} 
                                aria-label="Close modal"
                                className="text-slate-500 hover:text-white p-1"
                            >
                                <X size={20}/>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onCreateTicket)} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Subject / Issue Title <span className="text-red-500">*</span></label>
                                <input {...register('subject')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-yellow-500 outline-none" placeholder="e.g. Missing Parts in Delivery" />
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Category <span className="text-red-500">*</span></label>
                                    <select {...register('category')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-yellow-500 outline-none appearance-none">
                                        <option value="">Select...</option>
                                        <option value="Order Issue">Order Issue</option>
                                        <option value="Technical Support">Technical Support</option>
                                        <option value="Billing & Escrow">Billing & Escrow</option>
                                        <option value="Logistics">Logistics & Delivery</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Priority</label>
                                    <select {...register('priority')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-yellow-500 outline-none appearance-none">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Detailed Description <span className="text-red-500">*</span></label>
                                <textarea {...register('initial_message')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white h-32 focus:border-yellow-500 outline-none resize-none" placeholder="Please provide order numbers, specifics of the issue, and steps to reproduce..." />
                                {errors.initial_message && <p className="text-red-500 text-xs mt-1">{errors.initial_message.message}</p>}
                            </div>
                            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-lg text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                                <button type="submit" disabled={!isValid || submitting} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-lg font-bold flex items-center transition-colors disabled:opacity-50">
                                    {submitting ? <Loader2 className="animate-spin mr-2" size={18}/> : <Send className="mr-2" size={18}/>} Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};