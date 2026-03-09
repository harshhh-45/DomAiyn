import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CometCursor() {
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Calculate distance from last position
      const dx = x - lastPositionRef.current.x;
      const dy = y - lastPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn particles if mouse is moving
      if (distance > 3) {
        // Spawn multiple particles for more visibility
        for (let i = 0; i < 2; i++) {
          const newParticle = {
            id: particleIdRef.current++,
            x: x + (Math.random() - 0.5) * 15,
            y: y + (Math.random() - 0.5) * 15,
            createdAt: Date.now(),
            size: Math.random() * 4 + 3, // Larger particles (3-7px)
          };

          setParticles(prev => [...prev, newParticle]);
        }
        lastPositionRef.current = { x, y };
      }
    };

    // Clean up old particles
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.createdAt < 1200));
    }, 50);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[9998]"
          initial={{
            left: particle.x,
            top: particle.y,
            opacity: 0.9,
            scale: 1,
          }}
          animate={{
            opacity: 0,
            scale: 0.3,
            y: Math.random() * 30 - 15,
            x: Math.random() * 30 - 15,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        >
          <div className="w-full h-full rounded-full bg-white shadow-lg shadow-white/50" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
