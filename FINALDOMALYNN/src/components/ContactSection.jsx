import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';


export default function ContactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
    const [statusMsg, setStatusMsg] = useState('');

    const offices = [
        {
            name: 'London Office',
            address: 'Office 16113, 182-184 High Street North',
            city: 'East Ham, London E6 2JA',
            phone: '+44 7436988342',
            email: 'domaiynlabs@gmail.com',
            comingSoon: false
        }
    ];

    const socialLinks = [
        {
            name: 'Twitter',
            url: 'https://x.com/domaiynlabs',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/company/domaiynteam/posts/?feedView=all&viewAsMember=true',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        },
        {
            name: 'Email',
            url: 'mailto:domaiynlabs@gmail.com',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMsg('');

        try {
            const res = await fetch('/api/contact/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus('success');
                setStatusMsg(data.message || 'Thank you! We will get back to you soon.');
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                setStatus('error');
                setStatusMsg(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setStatusMsg('Could not reach the server. Make sure Django is running on port 8000.');
        }

        // Auto-clear status after 6 seconds
        setTimeout(() => setStatus(null), 6000);
    };

    return (
        <section id="Contact" ref={ref} className="relative overflow-hidden flex items-center py-8 sm:py-10 md:py-12 z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10 w-full"
            >
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-space font-bold mb-3 sm:mb-4 text-white">
                            Let's Talk
                        </h2>
                        <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 mx-auto mb-3 sm:mb-4"></div>
                        <p className="text-sm sm:text-base text-white/60 font-inter max-w-xl mx-auto px-4">
                            Ready to make your AI safer, smarter, and worthy of human trust?
                        </p>
                    </motion.div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12">
                    {/* Left Side: Contact Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-4 sm:space-y-5 lg:col-span-3"
                    >
                        <h3 className="text-xl sm:text-2xl font-space font-semibold text-white mb-4 sm:mb-6">Send us a Message</h3>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-xs sm:text-sm font-space mb-1.5 sm:mb-2 text-white/70">
                                Name <span className="text-pink-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500/50 transition-all duration-300 text-white placeholder-white/30 font-inter text-sm"
                                placeholder="Your name"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-space mb-1.5 sm:mb-2 text-white/70">
                                Email <span className="text-pink-400">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-all duration-300 text-white placeholder-white/30 font-inter text-sm"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-xs sm:text-sm font-space mb-1.5 sm:mb-2 text-white/70">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500/50 transition-all duration-300 text-white placeholder-white/30 font-inter text-sm"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        {/* Subject Field */}
                        <div>
                            <label htmlFor="subject" className="block text-xs sm:text-sm font-space mb-1.5 sm:mb-2 text-white/70">
                                Subject <span className="text-pink-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500/50 transition-all duration-300 text-white placeholder-white/30 font-inter text-sm"
                                placeholder="How can we help you?"
                            />
                        </div>

                        {/* Message Field */}
                        <div>
                            <label htmlFor="message" className="block text-xs sm:text-sm font-space mb-1.5 sm:mb-2 text-white/70">
                                Message <span className="text-pink-400">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500/50 transition-all duration-300 text-white placeholder-white/30 resize-none font-inter text-sm"
                                placeholder="Tell us about your project or ask us anything..."
                            />
                        </div>

                        {/* Status Toast */}
                        <AnimatePresence>
                            {status && status !== 'loading' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`px-4 py-3 rounded-lg text-sm font-inter flex items-center gap-2 ${status === 'success'
                                        ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                                        : 'bg-red-500/20 border border-red-500/40 text-red-300'
                                        }`}
                                >
                                    {status === 'success' ? (
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    {statusMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={status === 'loading'}
                            whileHover={status !== 'loading' ? { scale: 1.02, y: -2 } : {}}
                            whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                            className={`w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-lg font-space font-semibold text-sm sm:text-base text-white hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {status === 'loading' ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Sending...
                                </>
                            ) : 'Send Message'}
                        </motion.button>
                    </motion.form>

                    {/* Right Side: Office Locations + Social Links */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col space-y-6 lg:col-span-2"
                    >
                        {/* Office Locations */}
                        <div>
                            <h3 className="text-xl sm:text-2xl font-space font-semibold text-white mb-4 sm:mb-6">Our Offices</h3>
                            <div className="space-y-4 sm:space-y-5">
                                {offices.map((office, index) => (
                                    <motion.div
                                        key={office.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                        whileHover={!office.comingSoon ? {
                                            scale: 1.02,
                                            y: -4,
                                            transition: { duration: 0.3, ease: "easeOut" }
                                        } : {}}
                                        className={`bg-white/5 backdrop-blur-sm border rounded-lg p-4 sm:p-5 md:p-6 transition-all duration-300 group ${office.comingSoon
                                            ? 'border-white/5 opacity-70'
                                            : 'border-white/10 hover:border-purple-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer'
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                <h4 className={`text-base sm:text-lg font-space font-semibold text-white ${!office.comingSoon && 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400'
                                                    } transition-all duration-300`}>
                                                    {office.name}
                                                </h4>
                                                {office.comingSoon && (
                                                    <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-purple-300">
                                                        Coming Soon
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/60 font-inter group-hover:text-white/80 transition-colors duration-300">
                                                <p className="flex items-start">
                                                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{office.address}<br />{office.city}</span>
                                                </p>
                                                {!office.comingSoon && office.phone && (
                                                    <p className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 flex-shrink-0 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <a href={`tel:${office.phone}`} className="hover:text-white transition-colors">
                                                            {office.phone}
                                                        </a>
                                                    </p>
                                                )}
                                                {!office.comingSoon && office.email && (
                                                    <p className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 flex-shrink-0 group-hover:text-pink-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <a href={`mailto:${office.email}`} className="hover:text-white transition-colors">
                                                            {office.email}
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                            {!office.comingSoon && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-pink-500/5 rounded-lg transition-all duration-500 -z-10 blur-xl" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div>
                            <h3 className="text-xl sm:text-2xl font-space font-semibold text-white mb-4 sm:mb-6">Connect With Us</h3>
                            <div className="flex justify-start items-center space-x-4 sm:space-x-6">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        className="text-white/60 hover:text-white transition-all duration-300 group"
                                        aria-label={social.name}
                                    >
                                        <div className="relative scale-90 sm:scale-100">
                                            {social.icon}
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </section>
    );
}
