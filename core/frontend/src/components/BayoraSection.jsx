import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import ThreeAgents from './ThreeAgents';

// Animated Element Wrapper
function AnimatedElement({ children, direction = 'up', delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        margin: "0px 0px -100px 0px",
        amount: 0.1
    });

    // Detect mobile device
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const directions = {
        up: { y: 60 },
        down: { y: -60 },
        left: { x: -60 },
        right: { x: 60 },
        scale: { scale: 0.9 }
    };

    // Skip animations on mobile - render children directly
    if (isMobile) {
        return <div ref={ref}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...directions[direction] }}
            animate={isInView ? {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1
            } : {
                opacity: 0,
                ...directions[direction]
            }}
            transition={{
                duration: 0.4,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            {children}
        </motion.div>
    );
}

// Process Card Wrapper - Disables animations on mobile
function ProcessCard({ children, delay = 0, className = '' }) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            viewport={{ once: false }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}


// Particle Sphere Component with Enhanced Glow
function ParticleSphere({ position, color, count = 1500 }) {
    const points = useRef();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const radius = 1.2;

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }

        return positions;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group position={position}>
            {/* Glowing Center Core */}
            <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={1} />
            </mesh>

            {/* Inner Glow Layers */}
            <mesh>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} />
            </mesh>

            {/* Particle Cloud */}
            <Points ref={points} positions={particlesPosition} stride={3} frustumCulled>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Enhanced Point Light for glow effect */}
            <pointLight position={[0, 0, 0]} color={color} intensity={3} distance={4} />
        </group>
    );
}

// Enhanced Connecting Line with Gradient Effect
function ConnectingLine({ start, end, color1, color2 }) {
    const lineRef = useRef();

    const points = useMemo(() => {
        const numPoints = 50;
        const pts = [];
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            pts.push(new THREE.Vector3(
                start[0] + (end[0] - start[0]) * t,
                start[1] + (end[1] - start[1]) * t,
                start[2] + (end[2] - start[2]) * t
            ));
        }
        return pts;
    }, [start, end]);

    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create color gradient along the line
        const colors = new Float32Array(points.length * 3);
        const c1 = new THREE.Color(color1);
        const c2 = new THREE.Color(color2);

        for (let i = 0; i < points.length; i++) {
            const t = i / (points.length - 1);
            const color = new THREE.Color().lerpColors(c1, c2, t);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geometry;
    }, [points, color1, color2]);

    return (
        <line ref={lineRef} geometry={lineGeometry}>
            <lineBasicMaterial
                attach="material"
                vertexColors
                transparent
                opacity={0.9}
                linewidth={3}
            />
        </line>
    );
}

// 3D Molecule Component with Enhanced Glow
function ParticleMolecule() {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    const positions = {
        top: [0, 2, 0],
        left: [-2, -0.7, 0],
        right: [2, -0.7, 0]
    };

    return (
        <group ref={groupRef}>
            {/* Three Particle Spheres with Enhanced Glowing Centers */}
            <ParticleSphere position={positions.top} color="#8b5cf6" count={1800} />
            <ParticleSphere position={positions.left} color="#3b82f6" count={1800} />
            <ParticleSphere position={positions.right} color="#ec4899" count={1800} />

            {/* Enhanced Connecting Lines with Gradients */}
            <ConnectingLine
                start={positions.top}
                end={positions.left}
                color1="#8b5cf6"
                color2="#3b82f6"
            />
            <ConnectingLine
                start={positions.top}
                end={positions.right}
                color1="#8b5cf6"
                color2="#ec4899"
            />
            <ConnectingLine
                start={positions.left}
                end={positions.right}
                color1="#3b82f6"
                color2="#ec4899"
            />

            {/* Ambient Lighting */}
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        </group>
    );
}

// Create circular particle texture
function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Fast Attack Particles - Very fast moving chaotic particles
function FastAttackParticles() {
    const particlesRef = useRef();
    const sphereRef = useRef();
    const particleCount = 1000;
    const circleTexture = useMemo(() => createCircleTexture(), []);

    // Store velocities and reset logic
    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            // Spawn on a sphere shell with staggered radius for "process flow"
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.acos(Math.random() * 2 - 1);
            const r = 1 + (i / particleCount) * 5; // Staggered initial distances

            pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = r * Math.cos(theta);

            // Velocity towards center (0,0,0)
            const dirX = -pos[i * 3];
            const dirY = -pos[i * 3 + 1];
            const dirZ = -pos[i * 3 + 2];
            const mag = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

            vel[i * 3] = (dirX / mag) * 0.15;
            vel[i * 3 + 1] = (dirY / mag) * 0.15;
            vel[i * 3 + 2] = (dirZ / mag) * 0.15;
        }
        return { positions: pos, velocities: vel };
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            const posAttr = particlesRef.current.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                // Move towards center
                posAttr[i * 3] += velocities[i * 3];
                posAttr[i * 3 + 1] += velocities[i * 3 + 1];
                posAttr[i * 3 + 2] += velocities[i * 3 + 2];

                // Check distance to center
                const dist = Math.sqrt(
                    posAttr[i * 3] * posAttr[i * 3] +
                    posAttr[i * 3 + 1] * posAttr[i * 3 + 1] +
                    posAttr[i * 3 + 2] * posAttr[i * 3 + 2]
                );

                // Reset if reached center
                if (dist < 0.2) {
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.acos(Math.random() * 2 - 1);
                    const r = 5 + Math.random() * 2;
                    posAttr[i * 3] = r * Math.sin(theta) * Math.cos(phi);
                    posAttr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
                    posAttr[i * 3 + 2] = r * Math.cos(theta);

                    // Recalculate velocity towards center for the new position
                    const dirX = -posAttr[i * 3];
                    const dirY = -posAttr[i * 3 + 1];
                    const dirZ = -posAttr[i * 3 + 2];
                    const mag = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
                    velocities[i * 3] = (dirX / mag) * 0.15;
                    velocities[i * 3 + 1] = (dirY / mag) * 0.15;
                    velocities[i * 3 + 2] = (dirZ / mag) * 0.15;
                }
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (sphereRef.current) {
            sphereRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 15) * 0.1);
        }
    });

    return (
        <group>
            <ambientLight intensity={0.5} />
            {/* Central Target Sphere */}
            <mesh ref={sphereRef}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color="#ff4d4d" emissive="#ff0000" emissiveIntensity={2} />
            </mesh>

            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.15} color="#ff6b6b" transparent opacity={0.65} sizeAttenuation map={circleTexture} />
            </points>
        </group>
    );
}

// Analysis Particles - Organized wave patterns
function AnalysisParticles() {
    const particlesRef = useRef();
    const particleCount = 800;
    const circleTexture = useMemo(() => createCircleTexture(), []);

    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2 + Math.random() * 3;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = Math.sin(angle) * radius;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.3;
            const positions = particlesRef.current.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.01;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.12} color="#c084fc" transparent opacity={0.9} sizeAttenuation map={circleTexture} />
            </points>
        </>
    );
}

export default function BayoraSection() {
    return (
        <section id="Bayora" className="py-4 sm:py-6 md:py-8 relative overflow-hidden z-10">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10">

                {/* Main Bayora Hero Section - Centered Layout */}
                <div className="relative flex items-start justify-center mb-12 sm:mb-16 md:mb-20">
                    <div className="max-w-7xl mx-auto w-full">
                        {/* Centered Title */}
                        <div className="text-center mb-8 sm:mb-10">
                            <AnimatedElement direction="up">
                                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-space font-bold tracking-tight mb-4">
                                    <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                                        Bayora
                                    </span>
                                </h2>
                                <h3 className="text-lg sm:text-xl md:text-2xl text-purple-300/90 font-space font-bold">
                                    CONTINUOUS ADVERSARIAL SAFETY VALIDATION
                                </h3>
                            </AnimatedElement>
                        </div>

                        {/* Layout with Molecule in Center and Text Around It */}
                        <div className="relative max-w-6xl mx-auto">
                            {/* Top Row: Left Text + Molecule + Right Text */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-start mb-2 sm:mb-3">
                                {/* Left Column - Platform Features */}
                                <AnimatedElement direction="left" delay={0.3}>
                                    <div className="space-y-4 text-center md:text-left pt-8 sm:pt-10 md:pt-12">
                                        <h4 className="text-xl sm:text-2xl font-space font-semibold text-white">Platform Features</h4>
                                        <ul className="space-y-3">
                                            <motion.li
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4, duration: 0.5 }}
                                                viewport={{ once: false }}
                                                className="flex items-start space-x-2 justify-center md:justify-start"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 mt-2 flex-shrink-0" />
                                                <span className="text-white/70 text-base sm:text-lg">Structured adversarial test suites</span>
                                            </motion.li>
                                            <motion.li
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5, duration: 0.5 }}
                                                viewport={{ once: false }}
                                                className="flex items-start space-x-2 justify-center md:justify-start"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 mt-2 flex-shrink-0" />
                                                <span className="text-white/70 text-base sm:text-lg">Behavioural safety evaluation</span>
                                            </motion.li>
                                            <motion.li
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6, duration: 0.5 }}
                                                viewport={{ once: false }}
                                                className="flex items-start space-x-2 justify-center md:justify-start"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 mt-2 flex-shrink-0" />
                                                <span className="text-white/70 text-base sm:text-lg">Pre & post-deployment testing</span>
                                            </motion.li>
                                        </ul>
                                    </div>
                                </AnimatedElement>

                                {/* Center - Glowing 3D Molecule */}
                                <div className="flex justify-center items-center">
                                    <AnimatedElement direction="scale" delay={0.2}>
                                        <div className="relative">
                                            {/* Enhanced Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-pink-500/40 blur-3xl rounded-full animate-pulse"></div>

                                            {/* 3D Molecule */}
                                            <div className="relative h-[200px] sm:h-[250px] lg:h-[300px] w-[200px] sm:w-[250px] lg:w-[300px]">
                                                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                                                    <ParticleMolecule />
                                                </Canvas>
                                            </div>
                                        </div>
                                    </AnimatedElement>
                                </div>

                                {/* Right Column - Deployment Options */}
                                <AnimatedElement direction="right" delay={0.5}>
                                    <div className="space-y-4 text-center md:text-right pt-8 sm:pt-10 md:pt-12">
                                        <h4 className="text-xl sm:text-2xl font-space font-semibold text-white">Deployment Options</h4>
                                        <ul className="space-y-3">
                                            <motion.li
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6, duration: 0.5 }}
                                                viewport={{ once: false }}
                                                className="flex items-start space-x-2 justify-center md:justify-end"
                                            >
                                                <span className="text-white/60 text-base sm:text-lg order-2 md:order-1">Isolated cloud</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 mt-2 flex-shrink-0 order-1 md:order-2" />
                                            </motion.li>
                                            <motion.li
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7, duration: 0.5 }}
                                                viewport={{ once: false }}
                                                className="flex items-start space-x-2 justify-center md:justify-end"
                                            >
                                                <span className="text-white/60 text-base sm:text-lg order-2 md:order-1">Customer VPC</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 mt-2 flex-shrink-0 order-1 md:order-2" />
                                            </motion.li>
                                            <motion.li
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8, duration: 0.5 }}
                                                viewport={{ once: false }}
                                                className="flex items-start space-x-2 justify-center md:justify-end"
                                            >
                                                <span className="text-white/60 text-base sm:text-lg order-2 md:order-1">On-prem / air-gapped</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 mt-2 flex-shrink-0 order-1 md:order-2" />
                                            </motion.li>
                                        </ul>
                                    </div>
                                </AnimatedElement>
                            </div>

                            {/* Bottom Row: Description Below the Molecule - Always Visible */}
                            <div className="space-y-4 text-center max-w-3xl mx-auto">
                                <p className="text-base sm:text-lg text-white/80 font-inter leading-relaxed">
                                    Bayora is DomAIyn Labs' structured adversarial safety validation platform for large language models.
                                </p>
                                <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                                    <span className="text-sm sm:text-base text-purple-300 font-space font-semibold">Privacy-first · Deterministic · Reproducible</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOW BAYORA WORKS Section - Keeping the rest of the content */}
                <AnimatedElement direction="up">
                    <div className="max-w-7xl mx-auto pt-8 sm:pt-12 md:pt-16 mb-12 sm:mb-20 px-4 sm:px-6">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-space font-bold text-center mb-3 sm:mb-4 text-white">
                            HOW BAYORA WORKS
                        </h3>
                        <p className="text-center text-white/60 text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 lg:mb-16">
                            Three-step adversarial validation process
                        </p>

                        {/* Process Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            <ProcessCard
                                delay={0.1}
                                className="group relative glass-card rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
                            >
                                <div className="w-full">
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl font-space font-bold text-red-400">01</span>
                                        </div>
                                        <h4 className="text-xl sm:text-2xl font-space font-bold text-white">Adversarial Attack Execution</h4>
                                    </div>

                                    {/* Three.js Particle Visual */}
                                    <div className="h-40 w-full mb-6 opacity-80">
                                        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                                            <FastAttackParticles />
                                        </Canvas>
                                    </div>

                                    <ul className="space-y-3 text-left inline-block">
                                        {['Instruction override', 'Refusal suppression', 'Roleplay abuse', 'Multi-shot coercion'].map((item, i) => (
                                            <li key={i} className="flex items-start space-x-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                                <span className="text-white/60 text-base sm:text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ProcessCard>

                            <ProcessCard
                                delay={0.3}
                                className="group relative glass-card rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
                            >
                                <div className="w-full">
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl font-space font-bold text-purple-400">02</span>
                                        </div>
                                        <h4 className="text-xl sm:text-2xl font-space font-bold text-white">Behavioural Analysis</h4>
                                    </div>

                                    {/* Three.js Particle Visual */}
                                    <div className="h-40 w-full mb-6 opacity-80">
                                        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
                                            <AnalysisParticles />
                                        </Canvas>
                                    </div>

                                    <ul className="space-y-3 text-left inline-block">
                                        {['Policy violations', 'Instruction failures', 'Unsafe outputs', 'Behaviour degradation'].map((item, i) => (
                                            <li key={i} className="flex items-start space-x-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                                <span className="text-white/60 text-base sm:text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ProcessCard>

                            <ProcessCard
                                delay={0.5}
                                className="group relative glass-card rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-transparent p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
                            >
                                <div className="w-full">
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl font-space font-bold text-pink-400">03</span>
                                        </div>
                                        <h4 className="text-xl sm:text-2xl font-space font-bold text-white">Multi-Agent Judgement</h4>
                                    </div>

                                    {/* Three.js Particle Visual */}
                                    <div className="h-40 w-full mb-6 opacity-80">
                                        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                                            <ThreeAgents />
                                        </Canvas>
                                    </div>

                                    <ul className="space-y-3 text-left inline-block">
                                        {['Independent agents', 'Reduced bias', 'Deterministic scoring', 'Reproducible verdicts'].map((item, i) => (
                                            <li key={i} className="flex items-start space-x-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                                                <span className="text-white/60 text-base sm:text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ProcessCard>
                        </div>
                    </div>
                </AnimatedElement>

                {/* Additional Sections - Minimalistic Creative Design */}
                <div className="space-y-16 sm:space-y-20">
                    {/* Threat Models - Clean Grid */}
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-10 text-center">
                            <h3 className="text-3xl sm:text-4xl font-space font-bold text-white mb-2">
                                Threat Models
                            </h3>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { text: 'External malicious users', color: 'text-red-400' },
                                { text: 'Internal misconfiguration', color: 'text-orange-400' },
                                { text: 'Instruction override', color: 'text-yellow-400' },
                                { text: 'Behavioural drift', color: 'text-pink-400' }
                            ].map((threat, i) => (
                                <div key={i} className="group relative space-y-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative p-6 border-l-2 border-purple-400/40 hover:border-purple-400/80 transition-colors">
                                        <div className={`text-xl font-space font-bold ${threat.color} mb-3`}>0{i + 1}</div>
                                        <p className="text-white/95 text-xl font-medium leading-relaxed">{threat.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inputs and Outputs - Two Column Layout */}
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-10 text-center">
                            <h3 className="text-3xl sm:text-4xl font-space font-bold text-white mb-2">
                                Inputs & Outputs
                            </h3>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Inputs */}
                            <div className="space-y-6 text-center">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-md border-2 border-blue-400/40 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
                                    </div>
                                    <h4 className="text-xl sm:text-2xl font-space font-semibold text-blue-300">Inputs Required</h4>
                                </div>
                                <div className="space-y-4">
                                    {['Model endpoint', 'Prompt configuration', 'Use case description', 'Risk tolerance'].map((input, i) => (
                                        <div key={i} className="text-white/90 text-lg leading-relaxed hover:text-white transition-colors">
                                            {input}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Outputs */}
                            <div className="space-y-6 text-center">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-md border-2 border-pink-400/40 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2.5 h-2.5 bg-pink-400 rounded-full"></div>
                                    </div>
                                    <h4 className="text-xl sm:text-2xl font-space font-semibold text-pink-300">Outputs Delivered</h4>
                                </div>
                                <div className="space-y-4">
                                    {['PDF audit report', 'JSON structured logs', 'Risk scores', 'Test artifacts'].map((output, i) => (
                                        <div key={i} className="text-white/90 text-lg leading-relaxed hover:text-white transition-colors">
                                            {output}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compliance Mapping - Horizontal Badges */}
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-10 text-center">
                            <h3 className="text-3xl sm:text-4xl font-space font-bold text-white mb-2">
                                Compliance Mapping
                            </h3>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mx-auto mb-4"></div>
                            <p className="text-white/70 text-base max-w-xl mx-auto">
                                Technical evidence mapped to regulatory frameworks
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['EU AI Act', 'GDPR', 'DPDP India'].map((compliance, i) => (
                                <div key={i} className="group relative px-8 py-4 border border-white/20 rounded-lg hover:border-white/50 transition-all duration-300">
                                    <span className="text-white/90 font-space text-lg group-hover:text-white transition-colors">
                                        {compliance}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section >
    );
}
