import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
    const sectionRef = useRef(null);

    // Track scroll progress relative to this section
    // "start start": when top of section meets top of viewport (0 progress)
    // "end start": when bottom of section meets top of viewport (1 progress)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Gentle enlarge while fading
    // Map scroll progress 0->0.8 to scale 1->1.5 and opacity 1->0
    const logoScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.5]);
    const logoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]); // Subtle parallax movement

    return (
        <section
            id="Home"
            ref={sectionRef}
            className="relative min-h-screen z-20" /* Increased z-index to prevent clipping by subsequent sections */
        >
            <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[calc(100vh-6rem)] pb-4 sm:pb-12 lg:pb-16">
                    {/* Left Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left mt-2 sm:mt-12 lg:mt-16"
                    >
                        {/* Logo */}
                        <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center lg:justify-start">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-bold tracking-tight">
                                    <span className="text-white">Dom</span>
                                    <span
                                        className="bg-gradient-to-b from-[#3AAFFF] to-[#A22DFF] bg-clip-text text-transparent"
                                    >
                                        A
                                    </span>
                                    <span
                                        className="bg-gradient-to-b from-[#FF4DB6] to-[#A22DFF] bg-clip-text text-transparent"
                                    >
                                        I
                                    </span>
                                    <span className="text-white">yn Labs</span>
                                </h1>
                            </motion.div>
                        </div>

                        {/* Hero Text */}
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-space font-bold leading-tight mb-3 sm:mb-4 md:mb-6"
                            >
                                <span className="bg-gradient-to-r from-nebula-purple via-nebula-blue to-nebula-pink bg-clip-text text-transparent">
                                    Continuous Safety Validation for AI Systems
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-inter max-w-xl mx-auto lg:mx-0 leading-relaxed mb-3 sm:mb-4 md:mb-6"
                            >
                                Adversarial testing, behavioural risk audits, and compliance-ready safety evidence for large language models.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                                className="text-xs sm:text-sm md:text-base text-white/60 font-inter max-w-xl mx-auto lg:mx-0"
                            >
                                Privacy-first · Deterministic · Isolated cloud & on-prem deployments
                            </motion.p>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="flex justify-center lg:justify-start pt-2"
                        >
                            <a href="#Contact" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-nebula-purple via-nebula-blue to-nebula-pink rounded-lg font-space font-semibold text-sm sm:text-base md:text-lg hover:shadow-lg hover:shadow-nebula-purple/50 transition-all duration-300 w-full sm:w-auto"
                                >
                                    Request a Behavioural Risk Audit
                                </motion.button>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Interactive Spherical Logo */}
                    <motion.div
                        className="relative h-[50vw] w-[50vw] sm:h-[40vw] sm:w-[40vw] lg:h-[35vw] lg:w-[35vw] flex items-center justify-center lg:justify-end order-1 lg:order-2 -mx-4 sm:mx-0 lg:mr-[-10%] pt-4 sm:pt-12 lg:pt-20"
                        style={{
                            overflow: 'visible',
                            scale: logoScale,
                            opacity: logoOpacity,
                            y: logoY
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        {/* Main Logo - Responsive sizing */}
                        <motion.img
                            src="/static/sphere_logo.png"
                            alt="DomAIyn Sphere Logo"
                            className="cursor-pointer w-full h-full object-contain"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                mixBlendMode: 'lighten',
                                filter: 'brightness(1.0) contrast(1.1) saturate(1.0)',
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
