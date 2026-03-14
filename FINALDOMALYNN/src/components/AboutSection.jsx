import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="About" ref={ref} className="relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl"
            >
                <div className="p-6 sm:p-8 md:p-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-space font-bold mb-4 sm:mb-6 bg-gradient-to-r from-nebula-purple to-nebula-blue bg-clip-text text-transparent">
                        About
                    </h2>

                    <div className="space-y-8 sm:space-y-10 text-base sm:text-lg text-white/80 font-inter leading-relaxed">
                        <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                            DomAIyn Labs evaluates how AI systems behave under misuse, adversarial pressure, and instruction conflict.<br />
                            We do not train language models. We systematically test and validate their safety before and after deployment.
                        </p>

                        <div className="bg-white/[0.05] backdrop-blur-md rounded-lg p-4 sm:p-6 md:p-8 border border-white/20 shadow-xl shadow-black/20">
                            <h3 className="text-2xl sm:text-3xl font-space font-bold mb-6 text-white">
                                Vision & Mission
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-nebula-purple mb-2">Vision</h4>
                                    <p className="text-lg text-white/90">
                                        AI that behaves safely, consistently, and predictably.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-nebula-blue mb-2">Mission</h4>
                                    <p className="text-lg text-white/90">
                                        Identify AI weaknesses early and help teams launch with confidence.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
