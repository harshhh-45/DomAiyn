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
                        <div className="flex items-center gap-3 sm:gap-4 ml-2 sm:ml-4 border-l border-white/20 pl-2 sm:pl-4">
                            {window.user?.isAuthenticated ? (
                                <div className="relative group flex flex-col items-center">
                                    {/* Initials Circle */}
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-nebula-purple to-nebula-blue flex items-center justify-center shadow-lg shadow-purple-500/20 border border-white/20 cursor-pointer">
                                        <span className="text-white text-xs sm:text-sm font-space font-bold uppercase">
                                            {window.user.username.substring(0, 2)}
                                        </span>
                                    </div>

                                    {/* Username Label */}
                                    <span className="text-[8px] sm:text-[10px] uppercase font-space font-bold tracking-tighter mt-1 text-white/80">
                                        {window.user.username}
                                    </span>

                                    {/* Dropdown Menu */}
                                    <div className="absolute top-[120%] right-0 w-36 sm:w-44 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto shadow-2xl z-50">
                                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                                            <p className="text-[10px] sm:text-xs text-white font-space font-bold truncate">{window.user.username}</p>
                                            <p className="text-[8px] sm:text-[10px] text-white/40 font-inter">{window.user.isStaff ? 'Admin' : 'User'}</p>
                                        </div>

                                        {window.user.isStaff && (
                                            <a href="/panel/" className="block w-full px-3 py-2 text-[10px] sm:text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200 font-space flex items-center gap-2">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" /></svg>
                                                Admin Panel
                                            </a>
                                        )}

                                        <form action="/logout/" method="post" className="m-0">
                                            <button type="submit" className="w-full text-left px-3 py-2 text-[10px] sm:text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-200 font-space flex items-center gap-2">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Logout
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="relative group flex flex-col items-center">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/50 group-hover:bg-white/80 transition-all duration-300" />
                                        <a href="/login/" className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors duration-300 font-space mt-1">
                                            Login
                                        </a>
                                    </div>
                                    <div className="relative group flex flex-col items-center">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-nebula-pink/50 group-hover:bg-nebula-pink transition-all duration-300" />
                                        <a href="/register/" className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider text-nebula-pink group-hover:text-nebula-pink transition-colors duration-300 font-space mt-1">
                                            Sign Up
                                        </a>
                                    </div>
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
