import React from 'react';
import { motion } from 'framer-motion';

export default function EtherealShimmer() {
    return (
        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none">
            {/* Layer 1 - Outer glow */}
            <motion.div
                className="absolute -right-1/4 top-1/2 w-[800px] h-[800px] rounded-full"
                style={{
                    background: `radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(200, 220, 255, 0.1) 20%,
            rgba(150, 180, 255, 0.05) 40%,
            transparent 70%
          )`,
                    filter: 'blur(80px)',
                }}
                animate={{
                    y: ['-50%', '-48%', '-52%', '-50%'],
                    x: ['0%', '2%', '-2%', '0%'],
                    scale: [1, 1.05, 0.95, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Layer 2 - Mid fog */}
            <motion.div
                className="absolute -right-1/3 top-1/2 w-[700px] h-[700px] rounded-full"
                style={{
                    background: `radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(180, 210, 255, 0.15) 25%,
            rgba(140, 170, 255, 0.08) 50%,
            transparent 75%
          )`,
                    filter: 'blur(60px)',
                }}
                animate={{
                    y: ['-50%', '-52%', '-48%', '-50%'],
                    x: ['0%', '-3%', '3%', '0%'],
                    scale: [1, 0.95, 1.05, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Layer 3 - Bright core */}
            <motion.div
                className="absolute -right-1/4 top-1/2 w-[500px] h-[500px] rounded-full"
                style={{
                    background: `radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(220, 235, 255, 0.25) 20%,
            rgba(180, 210, 255, 0.12) 40%,
            transparent 70%
          )`,
                    filter: 'blur(40px)',
                }}
                animate={{
                    y: ['-50%', '-49%', '-51%', '-50%'],
                    scale: [1, 1.1, 0.9, 1],
                    opacity: [0.8, 1, 0.7, 0.8],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
            />

            {/* Layer 4 - Hot white core (breathing) */}
            <motion.div
                className="absolute -right-1/4 top-1/2 w-[350px] h-[350px] rounded-full"
                style={{
                    background: `radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(240, 248, 255, 0.35) 15%,
            rgba(200, 220, 255, 0.15) 35%,
            transparent 60%
          )`,
                    filter: 'blur(30px)',
                }}
                animate={{
                    y: ['-50%', '-48%', '-52%', '-50%'],
                    scale: [1, 1.15, 0.85, 1],
                    opacity: [0.7, 1, 0.6, 0.7],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Layer 5 - Swirling tendrils */}
            <motion.div
                className="absolute -right-1/3 top-1/3 w-[600px] h-[400px] rounded-full"
                style={{
                    background: `radial-gradient(
            ellipse at center,
            rgba(200, 220, 255, 0.12) 0%,
            rgba(160, 190, 255, 0.06) 30%,
            transparent 60%
          )`,
                    filter: 'blur(50px)',
                }}
                animate={{
                    y: ['0%', '10%', '-5%', '0%'],
                    x: ['0%', '5%', '-5%', '0%'],
                    rotate: [0, 15, -10, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Layer 6 - Bottom swirl */}
            <motion.div
                className="absolute -right-1/3 top-2/3 w-[600px] h-[400px] rounded-full"
                style={{
                    background: `radial-gradient(
            ellipse at center,
            rgba(180, 210, 255, 0.1) 0%,
            rgba(140, 170, 255, 0.05) 30%,
            transparent 60%
          )`,
                    filter: 'blur(50px)',
                }}
                animate={{
                    y: ['0%', '-10%', '5%', '0%'],
                    x: ['0%', '-5%', '5%', '0%'],
                    rotate: [0, -15, 10, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                }}
            />

            {/* Gradient fade to left (ensures text readability) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, transparent 40%)',
                }}
            />
        </div>
    );
}
