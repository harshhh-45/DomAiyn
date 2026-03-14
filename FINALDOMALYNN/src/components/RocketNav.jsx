import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_SECTIONS = ['Home', 'About', 'Bayora', 'Contact'];
const DJANGO_BASE = 'http://localhost:8000';

export default function RocketNav({ activeSection, onSectionChange }) {
    const [isLandingPage, setIsLandingPage] = useState(true);
    // null = loading, false = not logged in, object = user data
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Auth: read from URL params (Django redirect) or localStorage (same session)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlUser = params.get('user');
        const urlStaff = params.get('staff');

        if (urlUser) {
            // Fresh login redirect from Django — save to localStorage and set user
            const userData = { logged_in: true, username: decodeURIComponent(urlUser), is_staff: urlStaff === '1' };
            localStorage.setItem('domayl_user', JSON.stringify(userData));
            setUser(userData);
            // Clean URL params without page reload
            const url = new URL(window.location);
            url.searchParams.delete('user');
            url.searchParams.delete('staff');
            window.history.replaceState({}, '', url);
        } else {
            // Normal load — check localStorage (persists within browser session)
            const stored = localStorage.getItem('domayl_user');
            if (stored) {
                try {
                    setUser(JSON.parse(stored));
                } catch {
                    localStorage.removeItem('domayl_user');
                    setUser(false);
                }
            } else {
                setUser(false);
            }
        }
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        setIsLandingPage(activeSection === 'Home');
    }, [activeSection]);

    const getInitials = (username) => (username || '??').slice(0, 2).toUpperCase();

    const handleLogout = () => {
        localStorage.removeItem('domayl_user');
        window.location.href = `${DJANGO_BASE}/logout/`;
    };

    // ── Profile avatar + dropdown ──────────────────────────────────────────
    const ProfileDot = ({ compact = false }) => (
        <div className="relative flex flex-col items-center" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="relative group flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3"
            >
                {/* Avatar as the "dot" */}
                <div className={`${compact ? 'w-5 h-5 text-[8px]' : 'w-6 h-6 sm:w-7 sm:h-7 text-[9px] sm:text-[10px]'} rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-space font-bold ring-2 ring-white/30 group-hover:ring-white/70 shadow-lg shadow-purple-500/40 transition-all duration-300`}>
                    {getInitials(user.username)}
                </div>
                <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap font-space text-white/70 group-hover:text-white transition-colors duration-300">
                    {user.username}
                </span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {dropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-52 bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-[200]"
                    >
                        {/* User header */}
                        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-space font-bold text-sm flex-shrink-0">
                                {getInitials(user.username)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white font-space font-semibold text-sm truncate">{user.username}</p>
                                <p className="text-white/40 font-inter text-xs">{user.is_staff ? 'Admin' : 'Member'}</p>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                            {user.is_staff && (
                                <a
                                    href={`${DJANGO_BASE}/panel/`}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-inter text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Admin Panel
                                </a>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-inter text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // ── Login / Sign Up as two nav dots ───────────────────────────────────
    const AuthDots = () => (
        <>
            <a
                href={`${DJANGO_BASE}/login/`}
                className="relative group flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3"
            >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/50 group-hover:bg-white/80 group-hover:scale-125 transition-all duration-300" />
                <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap font-space text-white/40 group-hover:text-white/60 transition-all duration-300">
                    Login
                </span>
            </a>
            <a
                href={`${DJANGO_BASE}/register/`}
                className="relative group flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3"
            >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 group-hover:scale-125 shadow-sm shadow-purple-500/50 transition-all duration-300" />
                <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap font-space text-white/40 group-hover:text-white/60 transition-all duration-300">
                    Sign Up
                </span>
            </a>
        </>
    );

    // ── HORIZONTAL NAV (landing page) ─────────────────────────────────────
    if (isLandingPage) {
        return (
            <nav className="fixed top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 z-50">
                <div className="relative flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 h-16 sm:h-20 md:h-24">
                    {/* Track line */}
                    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent left-0" />

                    {/* All dots in one row: sections + auth/profile */}
                    <div className="relative flex items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14">
                        {/* Section dots */}
                        {NAV_SECTIONS.map((section) => (
                            <button
                                key={section}
                                onClick={() => onSectionChange(section)}
                                className="relative group flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3"
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

                        {/* Divider */}
                        <div className="w-px h-6 bg-white/20 self-center" />

                        {/* Auth: profile dot OR login/signup dots */}
                        {user === null ? null : user ? (
                            <ProfileDot />
                        ) : (
                            <AuthDots />
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    // ── VERTICAL NAV (scrolled pages) ─────────────────────────────────────
    return (
        <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-10 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {NAV_SECTIONS.map((section) => (
                <button
                    key={section}
                    onClick={() => onSectionChange(section)}
                    className="relative group flex items-center justify-end gap-4"
                >
                    <span className={`text-xs uppercase tracking-widest font-space whitespace-nowrap transition-all duration-300 ${activeSection === section
                        ? 'text-white/80 font-semibold opacity-100'
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

            {/* Auth section at bottom of vertical nav */}
            <div className="flex flex-col items-end gap-3 mt-2 border-t border-white/10 pt-4">
                {user === null ? null : user ? (
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setDropdownOpen(p => !p)}
                            className="flex items-center gap-2 group"
                        >
                            <span className="text-xs font-space text-white/50 group-hover:text-white/80 transition-colors">{user.username}</span>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold ring-1 ring-white/20 group-hover:ring-white/50 transition-all">
                                {getInitials(user.username)}
                            </div>
                        </button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="absolute right-full top-0 mr-3 w-44 bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                >
                                    {user.is_staff && (
                                        <a href={`${DJANGO_BASE}/panel/`} className="flex items-center gap-2 px-3 py-2.5 text-xs font-inter text-white/70 hover:text-white hover:bg-white/5 transition-all">
                                            ⚡ Admin Panel
                                        </a>
                                    )}
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-inter text-red-400 hover:bg-red-500/10 transition-all">
                                        → Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <>
                        <a href={`${DJANGO_BASE}/login/`} className="text-[10px] uppercase tracking-widest font-space text-white/50 hover:text-white transition-colors flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            Login
                        </a>
                        <a href={`${DJANGO_BASE}/register/`} className="text-[10px] uppercase tracking-widest font-space text-white/50 hover:text-white transition-colors flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                            Sign Up
                        </a>
                    </>
                )}
            </div>
        </nav>
    );
}
