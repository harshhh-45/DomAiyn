import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('domayl_cookie_consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('domayl_cookie_consent', 'accepted');
        setShowBanner(false);
    };

    const handleReject = () => {
        localStorage.setItem('domayl_cookie_consent', 'rejected');
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="fixed bottom-0 left-0 w-full z-[9999] p-4 sm:p-6 pointer-events-none"
                >
                    <div className="container mx-auto max-w-4xl pointer-events-auto">
                        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-nebula-purple/20 flex flex-col md:flex-row items-center justify-between gap-6">
                            
                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-space font-bold bg-gradient-to-r from-nebula-purple to-nebula-pink bg-clip-text text-transparent mb-2">
                                    We value your privacy
                                </h3>
                                <p className="text-sm text-white/70 font-inter leading-relaxed max-w-2xl">
                                    We use cookies and similar technologies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row items-center gap-3 w-full md:w-auto shrink-0">
                                <button
                                    onClick={handleReject}
                                    className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-white/20 text-white/80 font-space font-semibold text-sm hover:bg-white/5 hover:text-white transition-all duration-300"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-nebula-purple to-nebula-pink text-white font-space font-semibold text-sm shadow-lg shadow-nebula-purple/30 hover:shadow-nebula-purple/50 hover:scale-[1.02] transition-all duration-300"
                                >
                                    Accept All
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
