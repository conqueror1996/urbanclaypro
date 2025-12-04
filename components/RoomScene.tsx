'use client';

import React, { useEffect } from 'react';
import { Stage, useTexture, Environment, SoftShadows, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

interface RoomSceneProps {
    materialUrl: string;
    lighting: 'day' | 'evening';
    scale: number;
    mortarColor?: string;
    pattern?: string;
}

const Wall = ({ materialUrl, scale, mortarColor, pattern }: { materialUrl: string, scale: number, mortarColor?: string, pattern?: string }) => {
    const texture = useTexture(materialUrl);

    useEffect(() => {
        if (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            // Adjust repeat based on wall size (approx 4m x 3m) and scale
            // Base scale: assuming texture is ~1m wide.

            // Pattern Logic (Simulated via Repeat & Rotation)
            let repeatX = 4 * scale;
            let repeatY = 3 * scale;

            if (pattern === 'stack') {
                repeatX = 6 * scale; // Tighter vertical alignment look
                repeatY = 3 * scale;
            } else if (pattern === 'flemish') {
                repeatX = 5 * scale;
                repeatY = 4 * scale; // Denser
            }

            texture.repeat.set(repeatX, repeatY);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
        }
    }, [texture, scale, pattern]);

    return (
        <mesh position={[0, 1.5, -2]} receiveShadow castShadow>
            <boxGeometry args={[6, 3, 0.2]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.8}
                bumpMap={texture}
                bumpScale={0.05}
                envMapIntensity={0.5}
                color={mortarColor ? new THREE.Color(mortarColor).lerp(new THREE.Color('#ffffff'), 0.9) : '#ffffff'} // Subtle tint
            />
        </mesh>
    );
};

const Floor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.5} metalness={0.1} />
        </mesh>
    );
};

const SideWall = () => {
    return (
        <mesh position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[6, 3, 0.2]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
    );
};

export default function RoomScene({ materialUrl, lighting, scale, mortarColor, pattern }: RoomSceneProps) {
    return (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [2, 1.5, 4], fov: 45 }}>
            <SoftShadows size={10} samples={10} />

            <group position={[0, -1, 0]}>
                <Wall materialUrl={materialUrl} scale={scale} mortarColor={mortarColor} pattern={pattern} />
                <SideWall />
                <Floor />

                {/* Furniture / Context Placeholder (e.g. a simple plinth or bench to show scale) */}
                <mesh position={[0, 0.25, -1]} castShadow receiveShadow>
                    <boxGeometry args={[2, 0.5, 0.5]} />
                    <meshStandardMaterial color="#2A1E16" roughness={0.2} />
                </mesh>
            </group>

            {/* Lighting Setup */}
            <ambientLight intensity={lighting === 'day' ? 0.3 : 0.1} />

            {lighting === 'day' && (
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-bias={-0.0001}
                />
            )}

            {lighting === 'evening' && (
                <>
                    <pointLight position={[0, 2, 2]} intensity={1} color="#ffaa00" distance={5} />
                    <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={0.5} castShadow color="#aaaaff" />
                </>
            )}

            <Environment preset={lighting === 'day' ? "lobby" : "city"} background={false} />
            <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Canvas>
    );
}
