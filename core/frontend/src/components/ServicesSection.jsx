import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ServicesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const services = [
        {
            number: "01",
            title: "Bayora",
            subtitle: "LLM Safety Stress-Testing",
            description: "Your model is brilliant until someone jailbreaks it. We make sure that someone… is us.",
            color: "from-purple-500 to-violet-500"
        },
        {
            number: "02",
            title: "Private-Cloud",
            subtitle: "Compute Chambers",
            description: "Your data never leaves the room. Your model never leaves the vault.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            number: "03",
            title: "Ethical AI",
            subtitle: "Consulting",
            description: "We help teams build AI that won't embarrass them in public or endanger their users.",
            color: "from-pink-500 to-rose-500"
        },
        {
            number: "04",
            title: "Custom Safety",
            subtitle: "Architecture",
            description: "Bespoke systems that help your AI operate within ethical guardrails.",
            color: "from-indigo-500 to-purple-500"
        },
        {
            number: "05",
            title: "Zero-Retention",
            subtitle: "Model Training",
            description: "Train your model on sensitive data without losing sleep.",
            color: "from-teal-500 to-emerald-500"
        }
    ];

    return (
        <section id="Services" ref={ref} className="py-8 sm:py-10 md:py-12 relative z-0 overflow-hidden flex items-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10 w-full"
            >
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-space font-bold mb-3 sm:mb-4 text-white">
                            Our Services
                        </h2>
                        <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 mx-auto mb-3 sm:mb-4"></div>
                        <p className="text-sm sm:text-base text-white/60 font-inter max-w-xl mx-auto px-4">
                            Making AI Safer, Smarter &amp; Worthy of Human Trust
                        </p>
                    </motion.div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
                    {services.map((service, index) => {
                        // Determine animation direction based on position
                        const isLeftColumn = index % 2 === 0 && index !== 4;
                        const isRightColumn = index % 2 === 1;
                        const isCenterCard = index === 4;

                        const animationVariants = isCenterCard
                            ? { opacity: 0, scale: 0.8 }
                            : isLeftColumn
                                ? { opacity: 0, x: -50 }
                                : { opacity: 0, x: 50 };

                        const animateToVariants = isCenterCard
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 1, x: 0 };

                        return (
                            <motion.div
                                key={index}
                                initial={animationVariants}
                                whileInView={animateToVariants}
                                viewport={{ once: false, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className={`group relative ${index === 4 ? 'md:col-span-2 md:max-w-2xl md:mx-auto' : ''}`}
                            >
                                {/* Card */}
                                <div className="relative h-full p-4 sm:p-5 md:p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/10">

                                    {/* Number Badge */}
                                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                                        <div className={`text-3xl sm:text-4xl font-space font-bold bg-gradient-to-br ${service.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300`}>
                                            {service.number}
                                        </div>
                                    </div>

                                    {/* Accent Line */}
                                    <div className={`w-10 sm:w-12 h-0.5 bg-gradient-to-r ${service.color} mb-3 sm:mb-4 group-hover:w-14 sm:group-hover:w-16 transition-all duration-300`}></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <h3 className="text-xl sm:text-2xl font-space font-bold text-white mb-1">
                                            {service.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-white/50 font-space mb-2 sm:mb-3">
                                            {service.subtitle}
                                        </p>
                                        <p className="text-white/70 font-inter leading-relaxed text-xs sm:text-sm">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Hover Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="text-center mt-8 sm:mt-10"
                >
                    <p className="text-white/40 font-inter text-xs">
                        Each service is designed to protect what matters most
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
}
