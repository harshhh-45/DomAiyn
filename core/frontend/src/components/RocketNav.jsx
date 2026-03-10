import React, { useState, useEffect } from 'react';

const sections = ['Home', 'About', 'Bayora', 'Contact'];

export default function RocketNav({ activeSection, onSectionChange }) {
    const [isLandingPage, setIsLandingPage] = useState(true);

    useEffect(() => {
        setIsLandingPage(activeSection === 'Home');
    }, [activeSection]);

    const auth = window.djangoAuth || {};

    if (isLandingPage) {
        return (
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                <div className="relative w-[450px] h-20 flex items-center px-6 py-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center w-full">
                        {/* Logo added here */}
                        <div className="flex items-center gap-1 mr-4 hidden sm:flex">
                            <span className="text-[12px] font-bold text-white tracking-widest font-space">
                                Dom<span className="bg-gradient-to-r from-[#3AAFFF] to-[#A22DFF] bg-clip-text text-transparent">A</span><span className="bg-gradient-to-r from-[#FF4DB6] to-[#A22DFF] bg-clip-text text-transparent">I</span>yn
                            </span>
                        </div>
                        {sections.map((section) => (
                            <button
                                key={section}
                                onClick={() => onSectionChange(section)}
                                className="group flex flex-col items-center gap-2"
                            >
                                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === section ? 'bg-white scale-125 shadow-[0_0_10px_white]' : 'bg-white/30 hover:bg-white/50'}`} />
                                <span className={`text-[10px] uppercase tracking-widest font-space transition-all duration-300 ${activeSection === section ? 'text-white font-bold' : 'text-white/40 group-hover:text-white/60'}`}>
                                    {section}
                                </span>
                            </button>
                        ))}

                        <div className="h-8 w-px bg-white/10 mx-2" />

                        {auth.isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-white font-bold uppercase font-space">{auth.username}</span>
                                    {auth.isStaff && (
                                        <a href="/panel/" className="text-[8px] text-nebula-blue uppercase hover:underline font-inter">Admin</a>
                                    )}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-purple to-nebula-pink flex items-center justify-center border border-white/20 shadow-lg">
                                    <span className="text-white text-xs font-bold uppercase font-space">
                                        {(auth.username || "U").substring(0, 2)}
                                    </span>
                                </div>
                                <a href="/logout/" className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                                    <svg className="w-5 h-5 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </a>
                            </div>
                        ) : (
                            <div className="flex gap-6 items-center">
                                <a href="/login/" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest font-space transition-colors">Login</a>
                                <a href="/register/" className="text-[10px] px-4 py-1.5 bg-nebula-pink/20 border border-nebula-pink/30 text-nebula-pink hover:bg-nebula-pink hover:text-white rounded-full uppercase tracking-widest font-space transition-all">Sign Up</a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-8 hidden lg:flex">
            {sections.map((section) => (
                <button
                    key={section}
                    onClick={() => onSectionChange(section)}
                    className="group flex items-center justify-end gap-4"
                >
                    <span className={`text-[10px] uppercase font-bold tracking-widest font-space transition-all duration-300 ${activeSection === section ? 'opacity-100 text-white translate-x-0' : 'opacity-0 group-hover:opacity-100 text-white/40 translate-x-2'}`}>
                        {section}
                    </span>
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === section ? 'bg-white scale-125 shadow-[0_0_10px_white]' : 'bg-white/20 group-hover:bg-white/40'}`} />
                </button>
            ))}
        </nav>
    );
}
