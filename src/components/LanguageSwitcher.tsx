import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';

// Tell TypeScript that these Google variables will exist on the window object
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export const LanguageSwitcher = () => {
    useEffect(() => {
        // 1. Prevent double injection of the script
        if (document.getElementById('google-translate-script')) {
            return;
        }

        // 2. Define the initialization function for Google
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                { 
                    pageLanguage: 'en', // Your default website language
                    autoDisplay: false,
                    // Optional: You can restrict languages by uncommenting the line below
                    // includedLanguages: 'en,sw,fr,es,ar,zh-CN', 
                },
                'dagiv_translate_element'
            );
        };

        // 3. Create and append the script dynamically
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <>
            {/* INJECTED CSS OVERRIDES TO FIX GOOGLE'S UGLY UI */}
            <style>
                {`
                /* Hide the iframe that contains the banner */
                iframe.goog-te-banner-frame,
                .goog-te-banner-frame {
                    display: none !important;
                }

                /* Hide newer versions of the Google banner */
                .VIpgJd-ZVi9od-ORHb-OEVmcd {
                    display: none !important;
                }

                /* * Prevent Google from pushing the body down! */
                body, html {
                    position: static !important;
                    top: 0px !important;
                    margin-top: 0px !important;
                    padding-top: 0px !important;
                }

                /* Hide the Google logo inside the widget */
                .goog-te-gadget img {
                    display: none !important;
                }

                /* Hide the "Powered by" text link that sometimes leaks out */
                .goog-te-gadget > span > a {
                    display: none !important;
                }

                /* Style the text and container to match the DAGIV Dark Theme */
                .goog-te-gadget {
                    color: transparent !important;
                    font-family: inherit !important;
                }

                .goog-te-gadget .goog-te-combo {
    background-color: #0f172a !important; /* slate-950 */
    color: #f8fafc !important; /* slate-50 */
    border: 1px solid #1e293b !important; /* slate-800 */
    border-radius: 0.375rem !important; 
    
    padding: 0.25rem 1.5rem 0.25rem 0.5rem !important; 
    font-size: 0.75rem !important; /* text-xs */
    font-weight: 700 !important;
    outline: none !important;
    cursor: pointer !important;
    
    /* --- FIXED WIDTH: Increased to 150px so text isn't cut off --- */
    width: auto !important;
    max-width: 150px !important; 
    
    /* HIDE DEFAULT ARROW */
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    
    /* INJECT CUSTOM YELLOW ARROW SVG */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23eab308' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 0.35rem center !important;
    background-size: 0.8em !important;
}

                .goog-te-gadget .goog-te-combo:focus {
                    border-color: #eab308 !important; /* yellow-500 */
                    box-shadow: 0 0 0 1px #eab308 !important;
                }

                /* Hide the annoying Google Translate tooltip that appears on hover */
                #goog-gt-tt, .goog-te-balloon-frame {
                    display: none !important;
                }

                .goog-text-highlight {
                    background-color: transparent !important;
                    box-shadow: none !important;
                }

                /* Fix for Firefox to hide the native dropdown arrow */
                @-moz-document url-prefix() {
                    .goog-te-gadget .goog-te-combo {
                        text-indent: 0.01px;
                        text-overflow: '';
                    }
                }
                `}
            </style>

            {/* UI COMPONENT: Reduced padding, gap, and icon size */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 shadow-sm transition-colors hover:border-slate-700 w-fit">
                <Globe className="text-yellow-500 shrink-0" size={14} />
                <div id="dagiv_translate_element" className="overflow-hidden flex items-center"></div>
            </div>
        </>
    );
};