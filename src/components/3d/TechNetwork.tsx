"use client"

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Instance, Instances } from '@react-three/drei'

// Constants for the QR Grid
const GRID_SIZE = 10
const SPACING = 0.6
const PACKET_COUNT = 20

export function TechNetwork() {
    // --- 1. Static Grid Lines ---
    const gridLines = useMemo(() => {
        const points = []
        const offset = (GRID_SIZE * SPACING) / 2

        // Create a structured grid (QR-like)
        // Horizontal and Vertical lines
        for (let i = 0; i <= GRID_SIZE; i++) {
            const x = i * SPACING - offset
            // Vertical line
            points.push(
                new THREE.Vector3(x, -offset, 0),
                new THREE.Vector3(x, offset, 0)
            )
            // Horizontal line
            points.push(
                new THREE.Vector3(-offset, x, 0),
                new THREE.Vector3(offset, x, 0)
            )
        }
        return new THREE.BufferGeometry().setFromPoints(points)
    }, [])

    // --- 2. QR Modules (Squares) ---
    // We'll place purely aesthetic "modules" randomly but snapped to grid
    const modules = useMemo(() => {
        const mods = []
        const offset = (GRID_SIZE * SPACING) / 2
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                // "QR Code" pattern logic: dense areas, sparse areas
                // Center roughly has more, edges less
                const x = i * SPACING - offset + SPACING / 2
                const y = j * SPACING - offset + SPACING / 2

                const distFromCenter = Math.sqrt(x * x + y * y)
                if (Math.random() > 0.6 || distFromCenter < 1.5) {
                    mods.push({ position: [x, y, 0], scale: 0.8 })
                }
            }
        }
        return mods
    }, [])

    // --- 3. Data Packets (Moving Light Pulses) ---
    const packets = useMemo(() => {
        return Array.from({ length: PACKET_COUNT }).map(() => ({
            currentPos: new THREE.Vector3(),
            targetPos: new THREE.Vector3(),
            speed: Math.random() * 0.05 + 0.02,
            progress: 0,
            axis: Math.random() > 0.5 ? 'x' : 'y', // movement axis
            lineIndex: Math.floor(Math.random() * GRID_SIZE)
        }))
    }, [])

    const packetsRef = useRef<THREE.InstancedMesh>(null)
    const dummylp = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const offset = (GRID_SIZE * SPACING) / 2

        // Animate Packets
        if (packetsRef.current) {
            packets.forEach((packet, i) => {
                // Simple movement logic: slide along a grid line, then reset
                const linePos = packet.lineIndex * SPACING - offset
                const travel = (time * packet.speed * 10) % (GRID_SIZE * SPACING)
                const pos = travel - offset

                if (packet.axis === 'x') {
                    dummylp.position.set(pos, linePos, 0)
                    dummylp.scale.set(1.5, 0.1, 0.1) // Stretch effect
                } else {
                    dummylp.position.set(linePos, pos, 0)
                    dummylp.scale.set(0.1, 1.5, 0.1)
                }

                dummylp.updateMatrix()
                packetsRef.current!.setMatrixAt(i, dummylp.matrix)
            })
            packetsRef.current.instanceMatrix.needsUpdate = true
        }
    })

    return (
        <group rotation={[Math.PI / 4, Math.PI / 4, 0]}> {/* Isometric-ish view initially */}

            {/* 1. Base Grid Lines */}
            <lineSegments geometry={gridLines}>
                <lineBasicMaterial color="#1a2b4b" transparent opacity={0.3} linewidth={1} />
            </lineSegments>

            {/* 2. QR Modules (Static but interactive on hover via Instances) via Drei maybe? 
          Or simple InstancedMesh for performance. Here using simple map for clarity 
          since count is low (<100) and we want individual interaction potentially later.
          Actually, let's use Instances for glow. */}

            <Instances range={1000}>
                <planeGeometry args={[SPACING * 0.85, SPACING * 0.85]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.1} side={THREE.DoubleSide} />

                {modules.map((data, i) => (
                    <ModuleInstance key={i} position={data.position as [number, number, number]} />
                ))}
            </Instances>

            {/* 3. Data Flow Packets */}
            <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKET_COUNT]}>
                <boxGeometry args={[SPACING / 2, SPACING / 2, 0.05]} />
                <meshBasicMaterial color="#ffffff" />
            </instancedMesh>

        </group>
    )
}

function ModuleInstance({ position }: { position: [number, number, number] }) {
    const ref = useRef<any>(null)
    const [hovered, setHover] = React.useState(false)

    useFrame((state) => {
        if (ref.current) {
            // Idle varying opacity or color
            const time = state.clock.getElapsedTime()
            const baseScale = 1
            const pulse = Math.sin(time * 2 + position[0] * 0.5) * 0.05

            // Hover reaction
            const targetColor = hovered ? new THREE.Color("#00ffff") : new THREE.Color("#002244")
            const targetOpacity = hovered ? 0.8 : 0.2 + pulse

            // We can't easily animate color on Instance without custom logic or using individual meshes.
            // For MVP strict interaction, let's just scale or use color on the instance if supported, 
            // but standard Drei Instance color prop is handy.

            ref.current.scale.setScalar(hovered ? 0.95 : 0.85)
            ref.current.color.lerp(targetColor, 0.1)
        }
    })

    return (
        <Instance
            ref={ref}
            position={position}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
            onPointerOut={() => setHover(false)}
        />
    )
}
