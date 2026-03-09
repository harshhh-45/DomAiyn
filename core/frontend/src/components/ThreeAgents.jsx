import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Planet-like agent with orbital rings
function AgentPlanet({ angle, radius, color, delay = 0, orbitSpeed = 0.3 }) {
    const groupRef = useRef();
    const planetRef = useRef();
    const ringsRef = useRef([]);
    const atmosphereRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime + delay;

        // Revolve around center
        if (groupRef.current) {
            const orbitAngle = angle + time * orbitSpeed;
            groupRef.current.position.x = Math.cos(orbitAngle) * radius;
            groupRef.current.position.y = Math.sin(orbitAngle) * radius * 0.5;
        }

        // Rotate planet on its axis
        if (planetRef.current) {
            planetRef.current.rotation.y = time * 0.5;
            planetRef.current.rotation.x = Math.sin(time * 0.3) * 0.15;
        }

        // Rotate rings at different speeds
        ringsRef.current.forEach((ring, index) => {
            if (ring) {
                ring.rotation.z = time * (0.6 + index * 0.25);

                // Subtle pulsing
                const pulse = Math.sin(time * 1.5 + index * 0.5);
                ring.material.opacity = 0.65 + pulse * 0.12;
            }
        });

        // Pulsing atmosphere
        if (atmosphereRef.current) {
            const atmoPulse = 1 + Math.sin(time * 1.3) * 0.1;
            atmosphereRef.current.scale.setScalar(atmoPulse);
            atmosphereRef.current.material.opacity = 0.25 + Math.sin(time * 1.3) * 0.06;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Atmosphere glow */}
            <mesh ref={atmosphereRef}>
                <sphereGeometry args={[0.85, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.25}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Main planet sphere */}
            <mesh ref={planetRef}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.7}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Orbital rings - like Saturn */}
            {[0, 1, 2, 3].map((index) => (
                <mesh
                    key={index}
                    ref={(el) => (ringsRef.current[index] = el)}
                    rotation={[Math.PI / 2.3, 0, 0]}
                >
                    <torusGeometry
                        args={[
                            0.8 + index * 0.18,
                            0.025,
                            16,
                            60
                        ]}
                    />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.4}
                        transparent
                        opacity={0.7}
                        metalness={0.7}
                        roughness={0.2}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* Point light from planet */}
            <pointLight color={color} intensity={2} distance={3} />
        </group>
    );
}

// Random floating dust particles
function DustParticles() {
    const dustRef = useRef();

    const dustCount = 120;
    const { positions, colors, velocities } = useMemo(() => {
        const pos = new Float32Array(dustCount * 3);
        const col = new Float32Array(dustCount * 3);
        const vel = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            // Random positions in 3D space
            pos[i * 3] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 4;

            // Random velocities for floating motion
            vel[i * 3] = (Math.random() - 0.5) * 0.003;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

            // Subtle white/gray colors
            const brightness = 0.6 + Math.random() * 0.4;
            col[i * 3] = brightness;
            col[i * 3 + 1] = brightness;
            col[i * 3 + 2] = brightness;
        }

        return { positions: pos, colors: col, velocities: vel };
    }, []);

    useFrame(() => {
        if (dustRef.current) {
            const positions = dustRef.current.geometry.attributes.position.array;

            for (let i = 0; i < dustCount; i++) {
                // Apply velocity for random floating
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];

                // Wrap around boundaries to keep particles in view
                if (Math.abs(positions[i * 3]) > 3) positions[i * 3] *= -0.9;
                if (Math.abs(positions[i * 3 + 1]) > 2) positions[i * 3 + 1] *= -0.9;
                if (Math.abs(positions[i * 3 + 2]) > 2) positions[i * 3 + 2] *= -0.9;
            }

            dustRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={dustRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={dustCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={dustCount}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                vertexColors
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
}

export default function ThreeAgents() {
    return (
        <>
            {/* Three revolving planets - faster orbit speed */}
            <AgentPlanet
                angle={0}
                radius={2.2}
                color="#ff6b9d"
                delay={0}
                orbitSpeed={0.5}
            />
            <AgentPlanet
                angle={Math.PI * 2 / 3}
                radius={2.2}
                color="#c084fc"
                delay={0.8}
                orbitSpeed={0.5}
            />
            <AgentPlanet
                angle={Math.PI * 4 / 3}
                radius={2.2}
                color="#60a5fa"
                delay={1.6}
                orbitSpeed={0.5}
            />

            {/* Random floating dust particles */}
            <DustParticles />

            {/* Enhanced lighting */}
            <ambientLight intensity={0.35} />
            <directionalLight position={[6, 6, 6]} intensity={0.8} color="#ffffff" />
            <directionalLight position={[-4, -4, -4]} intensity={0.5} color="#4a5568" />
            <pointLight position={[0, 0, 4]} intensity={0.6} color="#ffffff" />
        </>
    );
}
