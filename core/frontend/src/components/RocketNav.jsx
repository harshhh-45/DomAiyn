import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = ['Home', 'About', 'Bayora', 'Contact'];

export default function RocketNav({ activeSection, onSectionChange }) {
    const [isLandingPage, setIsLandingPage] = useState(true);

    // Check if we're on landing page
    useEffect(() => {
        setIsLandingPage(activeSection === 'Home');
    }, [activeSection]);

    // Horizontal navigation for landing page
    if (isLandingPage) {
        return (
            <nav className="fixed top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 z-50">
                <div className="relative w-[280px] sm:w-[350px] md:w-[420px] h-16 sm:h-20 md:h-24 flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                    {/* Track */}
                    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent left-0" />

                    {/* Section markers and labels */}
                    <div className="absolute w-full flex justify-between items-center px-1 sm:px-2 md:px-4 lg:px-6">
                        {sections.map((section, index) => (
                            <button
                                key={section}
                                onClick={() => onSectionChange(section)}
                                className="relative group flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4"
                            >
                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${activeSection === section
                                    ? 'bg-white scale-150 shadow-lg shadow-white/50'
                                    : 'bg-white/50 group-hover:bg-white/80 group-hover:scale-125'
                                    }`} />
                                <span className={`text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap transition-all duration-300 font-space ${activeSection === section
                                    ? 'text-white font-semibold'
                                    : 'text-white/40 group-hover:text-white/60'
                                    }`}>
                                    {section}
                                </span>
                            </button>
                        ))}

                        {/* Auth Links */}
                        <div className="flex gap-2 sm:gap-4 ml-2 sm:ml-4 border-l border-white/20 pl-2 sm:pl-4">
                            {window.user?.isAuthenticated ? (
                                <>
                                    {window.user.isStaff && (
                                        <a href="/panel/" className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider text-nebula-blue hover:text-white transition-colors duration-300 font-space">
                                            Admin
                                        </a>
                                    )}
                                    <form action="/logout/" method="post" className="inline">
                                        <button type="submit" className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors duration-300 font-space">
                                            Logout
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <a href="/login/" className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors duration-300 font-space">
                                        Login
                                    </a>
                                    <a href="/register/" className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white px-2 py-0.5 rounded border border-white/30 hover:bg-white/10 transition-all duration-300 font-space">
                                        Join
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // Vertical navigation for other pages
    return (
        <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-10">
                {sections.map((section, index) => (
                    <button
                        key={section}
                        onClick={() => onSectionChange(section)}
                        className="relative group flex items-center justify-end gap-4"
                    >
                        <span className={`text-xs uppercase tracking-widest font-space whitespace-nowrap transition-all duration-300 ${activeSection === section
                            ? (section === 'Bayora' ? 'text-white/80 font-semibold opacity-0 group-hover:opacity-100' : 'text-white/80 font-semibold opacity-100')
                            : 'text-white/20 group-hover:text-white/40 opacity-0 group-hover:opacity-100'
                            }`}>
                            {section}
                        </span>
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSection === section
                            ? 'bg-white/80 scale-150 shadow-lg shadow-white/30'
                            : 'bg-white/30 group-hover:bg-white/50 group-hover:scale-125'
                            }`} />
                    </button>
                ))}
            </div>
        </nav>
    );
}
