"use client"

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei'
import { SmartQRCube } from '../3d/SmartQRCube'

export function Hero3D() {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <fog attach="fog" args={['#050510', 5, 20]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4c8bf5" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

                <Suspense fallback={null}>
                    <Float
                        speed={2}
                        rotationIntensity={0.2}
                        floatIntensity={0.5}
                        floatingRange={[-0.2, 0.2]}
                    >
                        <SmartQRCube />
                    </Float>

                    <ContactShadows
                        position={[0, -2.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={4}
                        color="#00aaff"
                    />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 3}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
