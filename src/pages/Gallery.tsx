import React, { useState } from 'react';
import { Maximize2, X, Camera } from 'lucide-react';

const PROJECTS = [
  { id: 1, title: 'Heavy Haulage Logistics', category: 'Logistics', image: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Excavator Overhaul', category: 'Maintenance', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Bridge Construction Site', category: 'Construction', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Fleet Servicing', category: 'Maintenance', image: 'https://images.unsplash.com/photo-1487803876022-d779b5c5e88d?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Mining Equipment Supply', category: 'Procurement', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'Industrial Plant Assembly', category: 'Construction', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80' },
];

const CATEGORIES = ['All', 'Construction', 'Maintenance', 'Logistics', 'Procurement'];

export const GalleryPage = () => {
    const [filter, setFilter] = useState('All');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const filteredProjects = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-slate-950 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500 shadow-inner border border-slate-800">
                        <Camera size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4">Project Gallery</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Explore our portfolio of engineering excellence, showcasing our capabilities across various industrial sectors.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filter === cat ? 'bg-yellow-500 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-yellow-500/50 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div 
                            key={project.id} 
                            className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-square cursor-pointer border border-slate-800 hover:border-yellow-500/50 transition-all animate-in fade-in zoom-in duration-500"
                            onClick={() => setSelectedImage(project.image)}
                        >
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-2 block">{project.category}</span>
                                    <h3 className="text-xl font-bold text-white mb-4">{project.title}</h3>
                                    <div className="w-10 h-10 rounded-full bg-yellow-500 text-slate-900 flex items-center justify-center hover:bg-white transition-colors">
                                        <Maximize2 size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 text-slate-500">No projects found in this category.</div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedImage(null)}>
                    <button 
                        aria-label="Close"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 text-slate-400 bg-slate-900 hover:bg-slate-800 hover:text-white p-3 rounded-full transition-all border border-slate-700 z-10"
                    >
                        <X size={24} />
                    </button>
                    <img 
                        src={selectedImage} 
                        alt="Expanded View" 
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-slate-800 animate-in zoom-in-95" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}
        </div>
    );
};

export default GalleryPage;