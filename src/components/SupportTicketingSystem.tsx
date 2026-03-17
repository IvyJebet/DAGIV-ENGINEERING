import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    MessageSquare, PlusCircle, CheckCircle, X, Send, 
    ShieldCheck, ChevronLeft, Loader2, Lock, EyeOff, UserPlus, 
    Check, CheckCheck, Paperclip, FileText, Maximize2
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

// Time Formatters
const formatLocalTime = (dateString: string) => {
    if (!dateString) return '';
    const safeString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const utcString = safeString.endsWith('Z') ? safeString : `${safeString}Z`;
    return new Date(utcString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatLocalDate = (dateString: string) => {
    if (!dateString) return '';
    const safeString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const utcString = safeString.endsWith('Z') ? safeString : `${safeString}Z`;
    const d = new Date(utcString);
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const isImageUrl = (url: string) => {
    return /\.(jpeg|jpg|gif|png|webp|bmp|svg)(\?.*)?$/i.test(url.toLowerCase());
};

export const SupportTicketingSystem = () => {
    const { token, user } = useAuth();
    const isStaff = user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'SUPPORT';
    
    const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    
    // Full Screen Image Viewer State
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

    // Chat State
    const [replyMessage, setReplyMessage] = useState('');
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createFileInputRef = useRef<HTMLInputElement>(null);
    const ws = useRef<WebSocket | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<TicketFormValues>({
        resolver: zodResolver(ticketSchema),
        defaultValues: { priority: 'MEDIUM', category: '' }
    });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/support/tickets?limit=50`, { headers: { 'Authorization': `Bearer ${token}` }});
            if (res.ok) setTickets((await res.json()).tickets);
        } finally { setLoading(false); }
    };

    const fetchTicketDetail = async (id: string, silent: boolean = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/support/tickets/${id}`, { headers: { 'Authorization': `Bearer ${token}` }});
            if (res.ok) {
                setSelectedTicket(await res.json());
                if (!silent) {
                    setView('DETAIL');
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }), 50);
                }
            }
        } finally { if (!silent) setLoading(false); }
    };

    useEffect(() => { if (token && view === 'LIST') fetchTickets(); }, [token, view]);

    // WebSocket Setup & Read Receipts
    useEffect(() => {
        if (view === 'DETAIL' && selectedTicket) {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const wsUrl = `${wsProtocol}://${API_URL.replace(/^https?:\/\//, '')}`;
            
            ws.current = new WebSocket(`${wsUrl}/api/support/tickets/${selectedTicket.id}/ws?token=${token}`);
            
            ws.current.onopen = () => {
                // Instantly notify the other party we have opened the chat
                ws.current?.send(JSON.stringify({ type: 'MARK_READ' }));
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                if (data.type === 'NEW_MESSAGE') {
                    setSelectedTicket((prev: any) => {
                        if (!prev || prev.messages.some((m: any) => m.id === data.message.id)) return prev;
                        return { ...prev, messages: [...prev.messages, data.message] };
                    });
                    setTypingUser(null);
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                    
                    // If we receive a message while actively looking, instantly mark it read!
                    if (data.message.sender_id !== user?.id) {
                        ws.current?.send(JSON.stringify({ type: 'MARK_READ' }));
                    }
                } 
                else if (data.type === 'TYPING' && data.user_id !== user?.id) {
                    setTypingUser(data.is_typing ? data.sender_name : null);
                }
                else if (data.type === 'READ_RECEIPT' && data.user_id !== user?.id) {
                    // Turn local ticks blue without fetching from the DB
                    setSelectedTicket((prev: any) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            messages: prev.messages.map((m: any) => 
                                m.sender_id === user?.id ? { ...m, is_read: true } : m
                            )
                        };
                    });
                }
            };
            return () => {
                ws.current?.close();
                ws.current = null;
            };
        }
    }, [view, selectedTicket?.id, token, user?.id]);

    useEffect(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'TYPING', is_typing: replyMessage.trim().length > 0 }));
        }
    }, [replyMessage]);

    const groupedMessages: any[] = [];
    let lastDateStr = '';
    selectedTicket?.messages?.forEach((msg: any) => {
        const msgDateStr = new Date(msg.created_at.endsWith('Z') ? msg.created_at : msg.created_at + 'Z').toDateString();
        if (msgDateStr !== lastDateStr) {
            groupedMessages.push({ type: 'date_separator', id: `date-${msg.id}`, dateLabel: formatLocalDate(msg.created_at) });
            lastDateStr = msgDateStr;
        }
        groupedMessages.push({ type: 'chat_bubble', ...msg });
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const newFiles = Array.from(files);
        setAttachments(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const uploadFilesToS3 = async (files: File[]) => {
        const uploadedUrls = [];
        for (const file of files) {
            const presignRes = await fetch(`${API_URL}/api/support/upload-url?file_name=${encodeURIComponent(file.name)}&file_type=${encodeURIComponent(file.type)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!presignRes.ok) throw new Error("Failed to get upload URL");
            const { upload_url, file_url } = await presignRes.json();
            const uploadResponse = await fetch(upload_url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type }});
            if (!uploadResponse.ok) throw new Error("Failed to upload file to storage.");
            uploadedUrls.push(file_url);
        }
        return uploadedUrls;
    };

    const onCreateTicket = async (data: TicketFormValues) => {
        setSubmitting(true);
        setUploadingFiles(attachments.length > 0);
        try {
            let uploadedUrls: string[] = [];
            if (attachments.length > 0) {
                uploadedUrls = await uploadFilesToS3(attachments);
            }

            const res = await fetch(`${API_URL}/api/support/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...data, attachments: uploadedUrls })
            });
            if (res.ok) {
                setIsCreateOpen(false);
                reset();
                setAttachments([]);
                fetchTickets();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create ticket. Check attachments.");
        } finally {
            setSubmitting(false);
            setUploadingFiles(false);
        }
    };

    const onReply = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalMessage = replyMessage.trim() || (attachments.length > 0 ? "Attached files" : "");
        if (finalMessage.length === 0) return;
        
        setSubmitting(true);
        setUploadingFiles(attachments.length > 0);
        
        try {
            let uploadedUrls: string[] = [];
            if (attachments.length > 0) {
                uploadedUrls = await uploadFilesToS3(attachments);
            }

            const res = await fetch(`${API_URL}/api/support/tickets/${selectedTicket.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ message: finalMessage, is_internal_note: isInternalNote, attachments: uploadedUrls })
            });
            
            if (res.ok) {
                setReplyMessage('');
                setAttachments([]);
                setIsInternalNote(false);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert("File upload failed. Please try again.");
        } finally {
            setSubmitting(false);
            setUploadingFiles(false);
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
            if (res.ok) fetchTicketDetail(selectedTicket.id, true);
        } finally { setSubmitting(false); }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'OPEN': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'WAITING_ON_CUSTOMER': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'ESCALATED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'CLOSED': return 'bg-slate-800 text-slate-400 border-slate-700';
            default: return 'bg-slate-800 text-slate-300 border-slate-700';
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[600px] max-h-[800px] flex flex-col">
            
            {/* FULL SCREEN IMAGE VIEWER */}
            {enlargedImage && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in" onClick={() => setEnlargedImage(null)}>
                    <button aria-label="Close full screen image" onClick={() => setEnlargedImage(null)} className="absolute top-6 right-6 p-2 bg-slate-800/50 hover:bg-slate-800 text-white rounded-full transition-colors"><X size={24} /></button>
                    <img src={enlargedImage} alt="Enlarged Attachment" className="max-w-[95%] max-h-[90%] object-contain rounded-xl shadow-2xl border border-slate-800" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            {/* VIEW: LIST */}
            {view === 'LIST' && (
                <div className="flex flex-col h-full animate-in fade-in">
                    <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center">
                                <MessageSquare className="mr-3 text-[#DD9C00]" /> 
                                {isStaff ? 'Agent Support Workspace' : 'Support Tickets'}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Manage inquiries, technical issues, and disputes.</p>
                        </div>
                        {!isStaff && (
                            <button onClick={() => { setIsCreateOpen(true); setAttachments([]); }} className="bg-[#DD9C00] hover:brightness-110 text-slate-950 px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg">
                                <PlusCircle size={16} className="inline mr-2"/> New Ticket
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-auto p-4 custom-scrollbar space-y-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500"><Loader2 className="animate-spin mb-4" size={32} /></div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
                                <CheckCircle className="mx-auto text-slate-600 mb-3" size={40}/>
                                <h3 className="text-white font-bold text-lg">No active issues</h3>
                                <p className="text-slate-500 text-sm">The queue is clean.</p>
                            </div>
                        ) : (
                            tickets.map(ticket => (
                                <div key={ticket.id} onClick={() => fetchTicketDetail(ticket.id)} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl hover:bg-slate-900 cursor-pointer transition-colors flex items-center justify-between gap-4 relative">
                                    <div className="flex-1">
                                        {/* Category & Priority UI in List */}
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(ticket.status)}`}>{ticket.status.replace(/_/g, ' ')}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 uppercase tracking-wider">{ticket.category}</span>
                                            {ticket.priority && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                                    ticket.priority === 'CRITICAL' ? 'border-red-500/20 bg-red-500/10 text-red-500' :
                                                    ticket.priority === 'HIGH' ? 'border-orange-500/20 bg-orange-500/10 text-orange-500' :
                                                    'border-blue-500/20 bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {ticket.priority}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-white font-bold text-[15px] group-hover:text-[#DD9C00] transition-colors">{ticket.subject}</h4>
                                        <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
                                            {isStaff ? <span className="text-white font-medium">Buyer: {ticket.buyer_name}</span> : <span className="font-mono text-[10px]">{ticket.id}</span>}
                                            <span className="opacity-50">•</span>
                                            <span>Updated {formatLocalDate(ticket.updated_at)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {ticket.unread_count > 0 && (
                                            <div className="bg-red-500 text-white text-[11px] font-bold h-6 min-w-[24px] px-2 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                                                {ticket.unread_count}
                                            </div>
                                        )}
                                        <div className="text-slate-600 group-hover:text-[#DD9C00] transition-colors">
                                            <ChevronLeft size={20} className="rotate-180" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* VIEW: DETAIL THREAD (Messaging Interface) */}
            {view === 'DETAIL' && selectedTicket && (
                <div className="flex flex-col h-full animate-in slide-in-from-right-8 absolute inset-0 bg-slate-950 z-10">
                    
                    <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-start justify-between shadow-md z-20">
                        <div className="flex items-start gap-4">
                            <button onClick={() => { setView('LIST'); setAttachments([]); }} className="text-slate-400 hover:text-white bg-slate-800 p-2 mt-1 rounded-full transition-colors" aria-label="Back"><ChevronLeft size={18}/></button>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-slate-500">{selectedTicket.id}</span>
                                    {isStaff && <span className="text-xs text-slate-400 border-l border-slate-700 pl-2">User: <span className="text-white font-bold">{selectedTicket.buyer_name}</span></span>}
                                </div>
                                <h3 className="text-white font-bold text-lg leading-tight pr-4">{selectedTicket.subject}</h3>
                                
                                {/* Category & Priority UI in Detail Header */}
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status.replace(/_/g, ' ')}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 uppercase tracking-wider">{selectedTicket.category}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                        selectedTicket.priority === 'CRITICAL' ? 'border-red-500/20 bg-red-500/10 text-red-500' :
                                        selectedTicket.priority === 'HIGH' ? 'border-orange-500/20 bg-orange-500/10 text-orange-500' :
                                        'border-blue-500/20 bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {selectedTicket.priority} Priority
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {isStaff && selectedTicket.status !== 'CLOSED' && selectedTicket.status !== 'RESOLVED' && (
                                <>
                                    {!selectedTicket.assigned_agent_id && (
                                        <button onClick={() => updateTicketStatus('', true)} className="text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-lg flex items-center hover:bg-blue-500 hover:text-white transition-colors">
                                            <UserPlus size={14} className="mr-1.5"/> Assign
                                        </button>
                                    )}
                                    <button onClick={() => updateTicketStatus('RESOLVED')} className="text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center hover:bg-emerald-500 hover:text-white transition-colors">
                                        <CheckCircle size={14} className="mr-1.5"/> Resolve
                                    </button>
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
                        {groupedMessages.map((item: any) => {
                            
                            if (item.type === 'date_separator') {
                                return (
                                    <div key={item.id} className="flex justify-center my-6">
                                        <span className="bg-slate-800/80 text-slate-400 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                                            {item.dateLabel}
                                        </span>
                                    </div>
                                );
                            }

                            const msg = item;
                            const isMe = msg.sender_id === user?.id;
                            
                            let bubbleClass = 'bg-[#283B0A] text-slate-200 border border-[#3a5212]'; 
                            if (msg.is_internal_note) {
                                bubbleClass = 'bg-purple-900/50 border border-purple-500/40 text-purple-100';
                            } else if (isMe) {
                                bubbleClass = 'bg-[#DD9C00] text-slate-950 font-medium'; 
                            }

                            const radiusClass = isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm';
                            const hasCaption = msg.message && msg.message !== "Attached files";

                            return (
                                <div key={msg.id} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold ${msg.is_internal_note ? 'text-purple-400' : 'text-slate-500'}`}>
                                            {isMe ? 'You' : msg.sender_name} 
                                            {!isMe && !msg.is_internal_note && <ShieldCheck size={10} className="inline text-emerald-500 ml-1"/>}
                                        </span>
                                    </div>
                                    
                                    <div className={`relative p-2 shadow-md ${bubbleClass} ${radiusClass} max-w-[85%] sm:max-w-[70%]`}>
                                        
                                        {msg.attachments?.length > 0 && (
                                            <div className={`flex flex-col gap-1 ${hasCaption ? 'mb-2' : 'mb-3'}`}>
                                                {msg.attachments.map((url: string, i: number) => {
                                                    const fileName = url.split('/').pop()?.split('?')[0] || `File ${i + 1}`;
                                                    const isImg = isImageUrl(url);
                                                    
                                                    if (isImg) {
                                                        return (
                                                            <div key={i} onClick={() => setEnlargedImage(url)} className="block relative rounded-xl overflow-hidden border border-black/10 shadow-sm cursor-pointer group">
                                                                <img src={url} alt="Attachment" className="max-w-full sm:max-w-[280px] max-h-[300px] object-cover transition-all group-hover:brightness-75" loading="lazy" />
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Maximize2 className="text-white drop-shadow-md" size={32} />
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    
                                                    return (
                                                        <a key={i} href={url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-[11px] px-3 py-2.5 rounded-xl shadow-sm hover:opacity-80 transition-all ${isMe ? 'bg-slate-950/20 text-slate-950' : 'bg-black/30 text-slate-200'}`}>
                                                            <div className={`p-1.5 rounded-lg ${isMe ? 'bg-slate-950/20' : 'bg-white/20'}`}>
                                                                <FileText size={16} />
                                                            </div>
                                                            <span className="truncate max-w-[160px] font-bold">Open {decodeURIComponent(fileName)}</span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {hasCaption && (
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed inline break-words px-1.5 pb-2">
                                                {msg.message}
                                            </p>
                                        )}
                                        
                                        {(hasCaption || msg.attachments?.length === 0) && (
                                            <span className="inline-block w-14 h-3 ml-2" aria-hidden="true" />
                                        )}

                                        <div className={`absolute bottom-1.5 right-2.5 flex items-center gap-1 text-[10px] ${isMe ? 'text-slate-950/70' : 'text-slate-200/60'} ${!hasCaption && msg.attachments?.length > 0 && isImageUrl(msg.attachments[0]) ? 'bg-black/40 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm' : ''}`}>
                                            <span>{formatLocalTime(msg.created_at)}</span>
                                            {isMe && !msg.is_internal_note && (
                                                <span className="ml-0.5">
                                                    {msg.is_read ? <CheckCheck size={14} className="text-blue-600" /> : <Check size={14} />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {typingUser && (
                            <div className="flex flex-col items-start w-full animate-in fade-in zoom-in-95 duration-200 mt-2">
                                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 px-1">
                                    {typingUser} is typing...
                                </div>
                                <div className="flex items-start w-fit bg-[#283B0A] border border-[#3a5212] p-3.5 rounded-2xl rounded-tl-sm shadow-sm gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Chat Input Box */}
                    {selectedTicket.status !== 'CLOSED' && (
                        <div className="p-4 bg-slate-900 border-t border-slate-800 z-20">
                            <form onSubmit={onReply} className="flex flex-col gap-2">
                                
                                {isStaff && (
                                    <div className="mb-1 flex items-center gap-2 px-2">
                                        <input type="checkbox" id="internalNote" checked={isInternalNote} onChange={(e) => setIsInternalNote(e.target.checked)} className="accent-purple-500 w-4 h-4 cursor-pointer" />
                                        <label htmlFor="internalNote" className="text-xs font-bold text-slate-400 cursor-pointer flex items-center"><EyeOff size={14} className="mr-1.5"/> Add as Internal Note (Hidden from Buyer)</label>
                                    </div>
                                )}
                                
                                {/* Visible Attachment Previews Before Sending */}
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 px-1 pb-1">
                                        {attachments.map((file, i) => {
                                            const isImg = file.type.startsWith('image/') || /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(file.name);
                                            const previewUrl = isImg ? URL.createObjectURL(file) : null;
                                            
                                            return (
                                                <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-700 shadow-sm animate-in slide-in-from-bottom-2 bg-slate-800 flex items-center">
                                                    {isImg ? (
                                                        <img src={previewUrl!} alt="preview" className="h-12 w-12 object-cover" />
                                                    ) : (
                                                        <div className="h-12 w-12 flex items-center justify-center bg-slate-700">
                                                            <FileText size={20} className="text-slate-400" />
                                                        </div>
                                                    )}
                                                    <div className="px-2 max-w-[120px]">
                                                        <span className="text-[10px] text-slate-300 truncate block font-medium">{file.name}</span>
                                                    </div>
                                                    <button type="button" onClick={(e) => { e.preventDefault(); setAttachments(p => p.filter((_, idx) => idx !== i)); }} className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors" aria-label="Remove attachment"><X size={12} /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="relative flex items-end gap-2">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-white transition-colors bg-slate-950 border border-slate-700 rounded-xl h-[56px] flex items-center justify-center shadow-inner hover:border-slate-500 flex-shrink-0" aria-label="Attach files">
                                        <Paperclip size={20} />
                                    </button>
                                    <input 
                                        type="file" 
                                        multiple 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        onChange={handleFileSelect} 
                                        aria-label="File upload" 
                                    />
                                    
                                    <textarea 
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder={isInternalNote ? "Type an internal note..." : "Type your message..."}
                                        className={`w-full border rounded-2xl text-white p-3.5 pr-16 text-sm outline-none resize-none h-[56px] shadow-inner transition-colors ${isInternalNote ? 'bg-purple-900/20 border-purple-500/50 focus:border-purple-400' : 'bg-slate-950 border-slate-700 focus:border-[#DD9C00]'}`}
                                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onReply(e); } }}
                                    />
                                    <button type="submit" aria-label="Send message" disabled={(!replyMessage.trim() && attachments.length === 0) || submitting || uploadingFiles} className={`absolute right-2 bottom-1.5 p-2.5 rounded-xl shadow-md disabled:opacity-50 transition-colors flex items-center justify-center h-11 w-11 ${isInternalNote ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-[#DD9C00] hover:brightness-110 text-slate-950'}`}>
                                        {uploadingFiles || submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={replyMessage.trim() || attachments.length ? 'translate-x-[1px] -translate-y-[1px]' : ''} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* CREATE MODAL OVERLAY */}
            {isCreateOpen && !isStaff && (
                <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90%]">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                            <h3 className="text-lg font-bold text-white">Create Support Request</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-white p-1" aria-label="Close modal"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit(onCreateTicket)} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Subject / Issue Title <span className="text-red-500">*</span></label>
                                <input {...register('subject')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-[#DD9C00] outline-none" placeholder="e.g. Missing Parts in Delivery" />
                                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Category <span className="text-red-500">*</span></label>
                                    <select {...register('category')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-[#DD9C00] outline-none appearance-none">
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
                                    <select {...register('priority')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-[#DD9C00] outline-none appearance-none">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Detailed Description <span className="text-red-500">*</span></label>
                                <textarea {...register('initial_message')} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white h-32 focus:border-[#DD9C00] outline-none resize-none" placeholder="Please provide order numbers, specifics of the issue, and steps to reproduce..." />
                                {errors.initial_message && <p className="text-red-500 text-xs mt-1">{errors.initial_message.message}</p>}
                            </div>
                            
                            {/* ATTACHMENTS FOR NEW TICKET */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Attachments (Optional)</label>
                                <button type="button" onClick={() => createFileInputRef.current?.click()} className="flex items-center gap-2 text-sm text-[#DD9C00] hover:text-yellow-400 bg-[#DD9C00]/10 hover:bg-[#DD9C00]/20 px-4 py-2 rounded-lg transition-colors border border-[#DD9C00]/20">
                                    <Paperclip size={16} /> Add Photos or Documents
                                </button>
                                <input 
                                    type="file" 
                                    multiple 
                                    className="hidden" 
                                    ref={createFileInputRef} 
                                    aria-label="Upload attachments" 
                                    onChange={handleFileSelect} 
                                />
                                
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {attachments.map((file, i) => {
                                            const isImg = file.type.startsWith('image/') || /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(file.name);
                                            const previewUrl = isImg ? URL.createObjectURL(file) : null;
                                            return (
                                                <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-700 shadow-sm bg-slate-800 flex items-center">
                                                    {isImg ? <img src={previewUrl!} alt="preview" className="h-10 w-10 object-cover" /> : <div className="h-10 w-10 flex items-center justify-center bg-slate-700"><FileText size={16} className="text-slate-400" /></div>}
                                                    <div className="px-2 max-w-[120px]"><span className="text-[10px] text-slate-300 truncate block font-medium">{file.name}</span></div>
                                                    <button type="button" onClick={() => setAttachments(p => p.filter((_, idx) => idx !== i))} aria-label="Remove attachment" className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full hover:bg-red-500"><X size={10} /></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                                <button type="submit" disabled={!isValid || submitting || uploadingFiles} className="bg-[#DD9C00] hover:brightness-110 text-slate-950 px-6 py-2.5 rounded-xl font-bold flex items-center transition-all disabled:opacity-50 shadow-lg">
                                    {submitting || uploadingFiles ? <Loader2 className="animate-spin mr-2" size={18}/> : <Send className="mr-2" size={18}/>} Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};