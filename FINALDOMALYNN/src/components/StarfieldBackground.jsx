import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars({ mousePosition }) {
    const starsRef = useRef();
    const twinkleRef = useRef([]);

    const [positions, colors, twinkleData] = useMemo(() => {
        const positions = new Float32Array(3000 * 3);
        const colors = new Float32Array(3000 * 3);
        const twinkleData = [];

        for (let i = 0; i < 3000; i++) {
            // Random position in a sphere
            const radius = Math.random() * 50 + 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Slight color variation (white to light blue)
            const colorVariation = Math.random() * 0.3;
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1 - colorVariation * 0.2;
            colors[i * 3 + 2] = 1;

            // Random twinkle properties - only 3-4 stars twinkle occasionally
            if (twinkleData.length < 4 && Math.random() < 0.002) { // Very selective - creates ~3-4 twinkling stars
                twinkleData.push({
                    index: i,
                    speed: 0.8 + Math.random() * 1.2, // Slower twinkle (0.8-2.0 seconds)
                    offset: Math.random() * Math.PI * 2 // Random phase offset
                });
            }
        }

        return [positions, colors, twinkleData];
    }, []);

    useFrame((state) => {
        if (starsRef.current) {
            // Mouse parallax effect - smooth interpolation with average speed
            const targetRotationY = state.clock.elapsedTime * 0.05 + mousePosition.x * 0.15;
            const targetRotationX = state.clock.elapsedTime * 0.025 + mousePosition.y * 0.15;

            // Smooth interpolation for natural movement
            starsRef.current.rotation.y += (targetRotationY - starsRef.current.rotation.y) * 0.02;
            starsRef.current.rotation.x += (targetRotationX - starsRef.current.rotation.x) * 0.02;

            // Twinkle effect - modify opacity of specific stars
            const geometry = starsRef.current.geometry;
            const sizes = geometry.attributes.size;

            if (!sizes) {
                // Initialize size attribute if it doesn't exist
                const sizeArray = new Float32Array(3000);
                sizeArray.fill(0.25);
                geometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
            } else {
                // Animate twinkling stars - make them VERY visible and dramatic
                twinkleData.forEach(({ index, speed, offset }) => {
                    const twinkle = Math.sin(state.clock.elapsedTime * speed + offset);
                    // Make twinkle VERY pronounced - stars get up to 8x larger when twinkling
                    const normalizedTwinkle = (twinkle + 1) / 2; // Convert -1 to 1 range to 0 to 1
                    const size = 0.3 + (normalizedTwinkle * 2.0); // Size ranges from 0.3 to 2.3 (much more dramatic)
                    sizes.array[index] = size;
                });
                sizes.needsUpdate = true;
            }
        }
    });

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.25}
                vertexColors
                transparent
                opacity={0.3}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function StarfieldBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize mouse position to -1 to 1 range
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]">
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                style={{ background: 'transparent' }}
            >
                <Stars mousePosition={mousePosition} />
            </Canvas>
        </div>
    );
}
