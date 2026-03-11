import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    MessageSquare, PlusCircle, CheckCircle, X, Send, 
    ShieldCheck, ChevronLeft, Loader2, Lock, EyeOff, UserPlus, 
    Check, CheckCheck 
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
    const prevMessagesLength = useRef(0);

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

    const fetchTicketDetail = async (id: string, silent: boolean = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/support/tickets/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedTicket(data);
                if (!silent) {
                    setView('DETAIL');
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }), 50);
                }
            }
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // Main fetch on mount
    useEffect(() => {
        if (token && view === 'LIST') fetchTickets();
    }, [token, view]);

    // Short-polling mechanism for real-time messages & typing updates
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (view === 'DETAIL' && selectedTicket) {
            interval = setInterval(() => {
                fetchTicketDetail(selectedTicket.id, true);
            }, 3000); // Polling every 3 seconds silently
        }
        return () => clearInterval(interval);
    }, [view, selectedTicket?.id]);

    // Send typing indicators
    useEffect(() => {
        if (!selectedTicket || view !== 'DETAIL') return;
        const isTyping = replyMessage.trim().length > 0;
        
        const timer = setTimeout(() => {
            fetch(`${API_URL}/api/support/tickets/${selectedTicket.id}/typing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ is_typing: isTyping })
            }).catch(() => {});
        }, 300); // Debounce to prevent API spam

        return () => clearTimeout(timer);
    }, [replyMessage, selectedTicket?.id, view, token]);

    // Gracefully handle auto-scrolling only when a new message actually arrives
    useEffect(() => {
        if (selectedTicket?.messages?.length > prevMessagesLength.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessagesLength.current = selectedTicket?.messages?.length || 0;
    }, [selectedTicket?.messages]);

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
                fetchTicketDetail(selectedTicket.id, true); // Silent update to pull in the new bubble instantly
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
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
                fetchTicketDetail(selectedTicket.id, true);
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
                    
                    <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500"><Loader2 className="animate-spin mb-4" size={32} /> Loading queue...</div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
                                <CheckCircle className="mx-auto text-slate-600 mb-3" size={40}/>
                                <h3 className="text-white font-bold text-lg">No active issues</h3>
                                <p className="text-slate-500 text-sm">The queue is clean.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {tickets.map(ticket => (
                                    <div 
                                        key={ticket.id} 
                                        onClick={() => fetchTicketDetail(ticket.id)}
                                        className="bg-slate-950 border border-slate-800 p-4 rounded-2xl hover:bg-slate-900 cursor-pointer transition-colors group flex items-center justify-between gap-4 relative"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(ticket.status)}`}>{ticket.status.replace(/_/g, ' ')}</span>
                                                <span className="text-xs font-mono text-slate-500">{ticket.id}</span>
                                            </div>
                                            <h4 className="text-white font-bold text-[15px] group-hover:text-yellow-500 transition-colors mt-1">{ticket.subject}</h4>
                                            <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
                                                {isStaff ? <span className="text-white font-medium">Buyer: {ticket.buyer_name}</span> : null}
                                                <span className="opacity-50">•</span>
                                                <span>Updated {new Date(ticket.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Unread Notifications Badge */}
                                        <div className="flex items-center gap-4">
                                            {ticket.unread_count > 0 && (
                                                <div className="bg-red-500 text-white text-[11px] font-bold h-6 min-w-[24px] px-2 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                                                    {ticket.unread_count}
                                                </div>
                                            )}
                                            <div className="text-slate-600 group-hover:text-yellow-500 transition-colors">
                                                <ChevronLeft size={20} className="rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* VIEW: DETAIL THREAD (Messaging Interface) */}
            {view === 'DETAIL' && selectedTicket && (
                <div className="flex flex-col h-full animate-in slide-in-from-right-8 absolute inset-0 bg-slate-950 z-10">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap gap-4 items-center justify-between shadow-md z-20">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => { setView('LIST'); prevMessagesLength.current = 0; }} 
                                className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
                                aria-label="Back to ticket list"
                                title="Back to list"
                            >
                                <ChevronLeft size={18}/>
                            </button>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">{selectedTicket.subject}</h3>
                                <div className="flex items-center gap-3 text-xs mt-1">
                                    <span className={`font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status.replace(/_/g, ' ')}</span>
                                    {isStaff && <span className="text-slate-400">User: <span className="text-white">{selectedTicket.buyer_name}</span></span>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {isStaff && selectedTicket.status !== 'CLOSED' && (
                                <>
                                    {!selectedTicket.assigned_agent_id && (
                                        <button onClick={() => updateTicketStatus('', true)} className="text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-lg flex items-center hover:bg-blue-500 hover:text-white transition-colors">
                                            <UserPlus size={14} className="mr-1.5"/> Assign
                                        </button>
                                    )}
                                    {selectedTicket.status !== 'RESOLVED' && (
                                        <button onClick={() => updateTicketStatus('RESOLVED')} className="text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center hover:bg-emerald-500 hover:text-white transition-colors">
                                            <CheckCircle size={14} className="mr-1.5"/> Resolve
                                        </button>
                                    )}
                                </>
                            )}
                            {!isStaff && selectedTicket.status !== 'CLOSED' && (
                                <button onClick={() => updateTicketStatus('CLOSED')} className="text-xs font-bold text-slate-400 hover:text-red-400 transition-colors">
                                    Close Ticket
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Chat Thread */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950 custom-scrollbar">
                        {selectedTicket.messages.map((msg: any) => {
                            const isMe = msg.sender_id === user?.id;
                            const isSupportRole = msg.sender_role === 'ADMIN' || msg.sender_role === 'SUPPORT';
                            
                            // Role-based styling overrides per instructions
                            let bubbleClass = '';
                            if (msg.is_internal_note) {
                                bubbleClass = 'bg-purple-900/40 border border-purple-500/30 text-purple-100';
                            } else if (isSupportRole) {
                                bubbleClass = 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500';
                            } else {
                                bubbleClass = 'bg-slate-800 border border-slate-700 text-slate-300';
                            }

                            // Dynamic shaping
                            const radiusClass = isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm';

                            return (
                                <div key={msg.id} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold ${msg.is_internal_note ? 'text-purple-400' : 'text-slate-500'}`}>
                                            {isMe ? 'You' : (isSupportRole ? 'Support Agent' : msg.sender_name)} 
                                            {!isMe && isSupportRole && <ShieldCheck size={10} className="inline text-yellow-500 ml-1"/>}
                                            {msg.is_internal_note && <span className="ml-2 bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-400 flex items-center inline-flex"><EyeOff size={10} className="mr-1"/> Internal Note</span>}
                                        </span>
                                    </div>
                                    <div className={`relative p-4 shadow-md ${bubbleClass} ${radiusClass} max-w-[85%] sm:max-w-[70%]`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed pb-4">{msg.message}</p>
                                        
                                        {/* Timestamp and Read Receipts */}
                                        <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] opacity-70">
                                            <span>{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            {isMe && !msg.is_internal_note && (
                                                <span className="ml-0.5">
                                                    {msg.is_read ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} className="text-slate-400" />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Real-time Typing Indicator Bubble */}
                        {selectedTicket.other_party_typing && (
                            <div className="flex flex-col items-start w-full animate-in fade-in zoom-in-95 duration-200">
                                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 px-1">
                                    {isStaff ? 'Buyer is typing...' : 'Support Agent is typing...'}
                                </div>
                                <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-sm w-fit flex items-center gap-1.5 shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Chat Input Box */}
                    {selectedTicket.status !== 'CLOSED' ? (
                        <div className="p-4 bg-slate-900 border-t border-slate-800 z-20 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
                            {isStaff && (
                                <div className="mb-3 flex items-center gap-2 px-2">
                                    <input type="checkbox" id="internalNote" checked={isInternalNote} onChange={(e) => setIsInternalNote(e.target.checked)} className="accent-purple-500 w-4 h-4" />
                                    <label htmlFor="internalNote" className="text-xs font-bold text-slate-400 cursor-pointer flex items-center"><EyeOff size={14} className="mr-1.5"/> Add as Internal Note (Hidden from Buyer)</label>
                                </div>
                            )}
                            <form onSubmit={onReply} className="relative flex items-end gap-2">
                                <textarea 
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder={isInternalNote ? "Type an internal note..." : "Message..."}
                                    className={`w-full border rounded-2xl text-white p-4 pr-16 text-sm outline-none resize-none h-[60px] transition-colors shadow-inner ${
                                        isInternalNote ? 'bg-purple-900/20 border-purple-500/50 focus:border-purple-400' : 'bg-slate-950 border-slate-700 focus:border-yellow-500'
                                    }`}
                                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onReply(e); } }}
                                />
                                <button 
                                    type="submit" 
                                    aria-label="Send reply"
                                    title="Send message"
                                    disabled={!replyMessage.trim() || submitting} 
                                    className={`absolute right-2 bottom-2 p-2.5 rounded-xl shadow-md disabled:opacity-50 transition-colors ${
                                        isInternalNote ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900'
                                    }`}
                                >
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={replyMessage.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''} />}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-5 bg-slate-900 border-t border-slate-800 text-center text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center">
                            <Lock size={16} className="mr-2"/> Ticket Closed
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
                                className="text-slate-500 hover:text-white p-1"
                                aria-label="Close modal"
                                title="Close dialog"
                            >
                                <X size={20}/>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onCreateTicket)} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Subject / Issue Title <span className="text-red-500">*</span></label>
                                <input {...register('subject')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none" placeholder="e.g. Missing Parts in Delivery" />
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Category <span className="text-red-500">*</span></label>
                                    <select {...register('category')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none appearance-none">
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
                                    <select {...register('priority')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none appearance-none">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Detailed Description <span className="text-red-500">*</span></label>
                                <textarea {...register('initial_message')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white h-32 focus:border-yellow-500 outline-none resize-none" placeholder="Please provide order numbers, specifics of the issue, and steps to reproduce..." />
                                {errors.initial_message && <p className="text-red-500 text-xs mt-1">{errors.initial_message.message}</p>}
                            </div>
                            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                                <button type="submit" disabled={!isValid || submitting} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-xl font-bold flex items-center transition-colors disabled:opacity-50 shadow-lg">
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