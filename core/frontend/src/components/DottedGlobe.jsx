import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function DottedGlobe({ radius = 2.5, segments = 40 }) {
    const pointsRef = useRef();

    const particlesPosition = useMemo(() => {
        const positions = [];

        // Use a spherical Fibonacci distribution or similar for even dot placement
        const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

        // Calculate total dots based on segments to approximate density
        const numDots = segments * segments;

        for (let i = 0; i < numDots; i++) {
            const y = 1 - (i / (numDots - 1)) * 2; // y goes from 1 to -1
            const r = Math.sqrt(1 - y * y); // radius at y

            const theta = phi * i; // golden angle increment

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

            // Push scaled positions
            positions.push(x * radius, y * radius, z * radius);
        }

        return new Float32Array(positions);
    }, [radius, segments]);

    const particlesColor = useMemo(() => {
        const colors = [];
        const numDots = particlesPosition.length / 3;

        const color1 = new THREE.Color('#FF4DB6'); // Pink
        const color2 = new THREE.Color('#3AAFFF'); // Blue
        const color3 = new THREE.Color('#A22DFF'); // Purple

        for (let i = 0; i < numDots; i++) {
            const y = particlesPosition[i * 3 + 1];
            // Normalize y from [-radius, radius] to [0, 1]
            const normalizedY = (y + radius) / (radius * 2);

            const color = new THREE.Color();
            if (normalizedY > 0.5) {
                // Top half: Purple to Pink
                const t = (normalizedY - 0.5) * 2;
                color.lerpColors(color3, color1, t);
            } else {
                // Bottom half: Blue to Purple
                const t = normalizedY * 2;
                color.lerpColors(color2, color3, t);
            }
            colors.push(color.r, color.g, color.b);
        }
        return new Float32Array(colors);
    }, [particlesPosition, radius]);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
        }
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particlesPosition.length / 3}
                        array={particlesPosition}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particlesColor.length / 3}
                        array={particlesColor}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.15}
                    vertexColors
                    transparent
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.NormalBlending}
                />
            </points>
        </group>
    );
}
