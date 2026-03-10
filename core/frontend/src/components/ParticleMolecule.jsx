import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle Sphere Component with Enhanced Glow
export function ParticleSphere({ position, color, count = 1500 }) {
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
export function ConnectingLine({ start, end, color1, color2 }) {
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
export default function ParticleMolecule() {
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
