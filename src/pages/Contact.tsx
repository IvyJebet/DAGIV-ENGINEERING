import React from 'react';
import { MapPin, Phone, User, Clock } from 'lucide-react';

export const ContactPage = () => (
    <div className="min-h-screen bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800 shadow-2xl">
            {/* Left Column: Contact Info */}
            <div className="p-10 md:w-1/2 bg-yellow-500 text-slate-900 flex flex-col justify-center">
                <h2 className="text-3xl font-black mb-6">Get in Touch</h2>
                <p className="font-medium mb-8 opacity-90 leading-relaxed">
                    Visit our HQ or send us a message regarding equipment sales, leasing, or technical support.
                </p>
                
                <div className="space-y-6 font-bold text-sm">
                    <div className="flex items-center">
                        <MapPin className="mr-4 w-6 h-6 opacity-75" /> 
                        <span>Industrial Area, Enterprise Rd, Nairobi</span>
                    </div>
                    
                    <a href="tel:+254704385809" className="flex items-center hover:opacity-75 transition-opacity">
                        <Phone className="mr-4 w-6 h-6 opacity-75" /> 
                        <span>+254 704 385 809</span>
                    </a>
                    
                    <a href="mailto:dagivengineering@gmail.com" className="flex items-center hover:opacity-75 transition-opacity">
                        <User className="mr-4 w-6 h-6 opacity-75" /> 
                        <span>dagivengineering@gmail.com</span>
                    </a>

                    {/* --- THIS IS THE SECTION THAT WAS MISSING --- */}
                    <div className="flex items-center border-t border-slate-900/10 pt-6 mt-2">
                        <Clock className="mr-4 w-6 h-6 opacity-75" />
                        <div>
                            <span className="block">Mon - Sat: 8:00 - 17:00</span>
                            <span className="block text-xs opacity-75 font-normal mt-1">Sundays: Closed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="p-10 md:w-1/2 bg-slate-900">
                <form className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email Address</label>
                        <input type="email" className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white focus:border-yellow-500 outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Message</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white h-32 focus:border-yellow-500 outline-none transition-colors resize-none"></textarea>
                    </div>
                    <button className="w-full bg-white text-slate-900 font-bold py-4 rounded hover:bg-slate-200 transition-colors shadow-lg">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
);

export default ContactPage;