"use client"

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Stars } from '@react-three/drei'
import { TechNetwork } from '../3d/TechNetwork'

export function HeroTech() {
    return (
        <div className="w-full h-full absolute inset-0 z-0 bg-[#020202]">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

                {/* Minimal Fog for depth */}
                <fog attach="fog" args={['#020202', 5, 20]} />

                <ambientLight intensity={0.1} />

                {/* Cool Tech Accents */}
                <pointLight position={[10, 10, 5]} intensity={1} color="#00ffff" distance={20} />
                <pointLight position={[-10, -10, 5]} intensity={0.5} color="#4c8bf5" distance={20} />

                <Suspense fallback={null}>
                    <TechNetwork />

                    {/* Subtle grain/noise via stars or post-processing (kept simple here) */}
                    <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        rotateSpeed={0.5}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                        // Constrain rotation to keep the "QR" somewhat facing
                        minAzimuthAngle={-Math.PI / 4}
                        maxAzimuthAngle={Math.PI / 4}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
