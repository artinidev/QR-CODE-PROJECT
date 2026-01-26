"use client"

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SmartQRCubeProps {
    hoverColor?: string
    baseColor?: string
}

export function SmartQRCube({ hoverColor = '#00f7ff', baseColor = '#ffffff' }: SmartQRCubeProps) {
    const meshRef = useRef<THREE.Group>(null)

    // Create a grid of segments to represent the QR code complexity
    // We'll use LineSegments for the clean grid look
    const segments = useMemo(() => {
        const size = 3
        const divisions = 8
        const step = size / divisions
        const vertices: number[] = []

        // Generate grid lines
        for (let i = 0; i <= divisions; i++) {
            const p = -size / 2 + i * step

            // Lines along X
            for (let j = 0; j <= divisions; j++) {
                // Z-parallel lines on top/bottom faces
                vertices.push(p, -size / 2, -size / 2, p, -size / 2, size / 2)
                vertices.push(p, size / 2, -size / 2, p, size / 2, size / 2)

                // Y-parallel lines on front/back faces
                vertices.push(p, -size / 2, -size / 2, p, size / 2, -size / 2)
                vertices.push(p, -size / 2, size / 2, p, size / 2, size / 2)
            }

            // Lines along Y... (similar logic for full cube grid)
            // Simplified approach: Use BoxGeometry wireframe for base, then add random internal data points
        }

        return new THREE.BufferGeometry()
    }, [])

    // Material with custom shader for the glow effect
    // For MVP we'll use a standard LineBasicMaterial and dynamic color changes on hover

    // Actually, let's use a collection of small boxes to form the "QR" pattern
    // This looks more premium than just wireframes
    const particles = useMemo(() => {
        const temp = []
        const grid = 6
        const gap = 0.5
        const offset = (grid * gap) / 2 - gap / 2

        for (let x = 0; x < grid; x++) {
            for (let y = 0; y < grid; y++) {
                for (let z = 0; z < grid; z++) {
                    // Only sparse population to look like data
                    if (Math.random() > 0.7) {
                        temp.push({
                            x: x * gap - offset,
                            y: y * gap - offset,
                            z: z * gap - offset
                        })
                    }
                }
            }
        }
        return temp
    }, [])

    useFrame((state) => {
        if (meshRef.current) {
            // Slow premium rotation
            meshRef.current.rotation.y += 0.002
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
        }
    })

    return (
        <group ref={meshRef}>
            {/* Outer framing cage */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(3.2, 3.2, 3.2)]} />
                <lineBasicMaterial color={baseColor} transparent opacity={0.1} />
            </lineSegments>

            {/* Internal "QR" Data bits */}
            {particles.map((pos, i) => (
                <DataBit key={i} position={[pos.x, pos.y, pos.z]} hoverColor={hoverColor} baseColor={baseColor} />
            ))}
        </group>
    )
}

function DataBit({ position, hoverColor, baseColor }: { position: [number, number, number], hoverColor: string, baseColor: string }) {
    const mesh = useRef<THREE.Mesh>(null)
    const [hovered, setHover] = React.useState(false)
    const color = new THREE.Color()

    useFrame((state, delta) => {
        if (mesh.current) {
            const targetColor = hovered ? new THREE.Color(hoverColor) : new THREE.Color(baseColor)
            // Smooth color transition
            const mat = mesh.current.material as THREE.MeshStandardMaterial
            if (mat.color) {
                mat.color.lerp(targetColor, delta * 5)
            }

            // Subtle float
            // mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.05
        }
    })

    return (
        <mesh
            ref={mesh}
            position={position}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
            onPointerOut={() => setHover(false)}
        >
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
                color={baseColor}
                emissive={hovered ? hoverColor : '#000000'}
                emissiveIntensity={hovered ? 2 : 0}
                toneMapped={false}
                transparent
                opacity={0.8}
            />
        </mesh>
    )
}
