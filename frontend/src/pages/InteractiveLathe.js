import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

function LathePart({ position, geometry, color, hoverColor, onClick, label, isSelected, dims }) {
    const [hovered, setHover] = useState(false);

    return (
        <mesh
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHover(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                setHover(false);
                document.body.style.cursor = 'auto';
            }}
        >
            {geometry === 'box' && <boxGeometry args={dims} />}
            {geometry === 'cylinder' && <cylinderGeometry args={dims} />}
            <meshStandardMaterial
                color={isSelected || hovered ? hoverColor : color}
                roughness={0.3}
                metalness={0.8}
            />
        </mesh>
    );
}

function LatheMachine({ onSelectPart, selectedPart }) {
    return (
        <group position={[0, -0.5, 0]}>
            {/* Bed */}
            <LathePart
                position={[0, 0, 0]}
                geometry="box"
                dims={[6, 0.5, 2]}
                color="#2a2a2a"
                hoverColor="#404040"
                label="Lathe Bed"
                isSelected={selectedPart?.id === 'bed'}
                onClick={() => onSelectPart({
                    id: 'bed',
                    title: 'Lathe Bed',
                    description: 'The rigid base that supports all other components. It has precision-ground ways for the carriage and tailstock to slide on.'
                })}
            />

            {/* Headstock */}
            <LathePart
                position={[-2.5, 1, 0]}
                geometry="box"
                dims={[1.5, 1.5, 2]}
                color="#3b82f6"
                hoverColor="#60a5fa"
                label="Headstock"
                isSelected={selectedPart?.id === 'headstock'}
                onClick={() => onSelectPart({
                    id: 'headstock',
                    title: 'Headstock',
                    description: 'Contains the main motor, spindle, and speed change gears. It spins the workpiece.'
                })}
            />

            {/* Chuck */}
            <group rotation={[0, 0, Math.PI / 2]} position={[-1.5, 1, 0]}>
                <LathePart
                    position={[0, 0, 0]}
                    geometry="cylinder"
                    dims={[0.6, 0.6, 0.5, 32]}
                    color="#9ca3af"
                    hoverColor="#d1d5db"
                    label="Chuck"
                    isSelected={selectedPart?.id === 'chuck'}
                    onClick={() => onSelectPart({
                        id: 'chuck',
                        title: 'Chuck',
                        description: 'Clamps the workpiece securely. Common types include 3-jaw (self-centering) and 4-jaw (independent).'
                    })}
                />
            </group>

            {/* Workpiece (Mock) */}
            <group rotation={[0, 0, Math.PI / 2]} position={[0, 1, 0]}>
                <mesh>
                    <cylinderGeometry args={[0.2, 0.2, 3, 32]} />
                    <meshStandardMaterial color="#d97706" metalness={0.5} roughness={0.2} />
                </mesh>
            </group>


            {/* Carriage */}
            <LathePart
                position={[1, 0.5, 0.5]}
                geometry="box"
                dims={[1.2, 0.4, 2.2]}
                color="#22c55e"
                hoverColor="#4ade80"
                label="Carriage"
                isSelected={selectedPart?.id === 'carriage'}
                onClick={() => onSelectPart({
                    id: 'carriage',
                    title: 'Carriage',
                    description: 'Moves along the bed ways. It carries the cross-slide, compound rest, and the cutting tool.'
                })}
            />

            {/* Tool Post */}
            <LathePart
                position={[1, 1.2, 0.5]}
                geometry="box"
                dims={[0.4, 0.8, 0.4]}
                color="#ef4444"
                hoverColor="#f87171"
                label="Tool Post"
                isSelected={selectedPart?.id === 'toolpost'}
                onClick={() => onSelectPart({
                    id: 'toolpost',
                    title: 'Tool Post',
                    description: 'Holds the cutting tool. Can be adjusted for height and angle.'
                })}
            />

            {/* Tailstock */}
            <LathePart
                position={[2.5, 0.75, 0]}
                geometry="box"
                dims={[1, 1, 1.5]}
                color="#a855f7"
                hoverColor="#c084fc"
                label="Tailstock"
                isSelected={selectedPart?.id === 'tailstock'}
                onClick={() => onSelectPart({
                    id: 'tailstock',
                    title: 'Tailstock',
                    description: 'Used to support long workpieces or hold drilling tools. It can slide along the bed.'
                })}
            />
        </group>
    );
}

function InteractiveLathe() {
    const [selectedPart, setSelectedPart] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0b] via-[#111113] to-[#0a0a0b] text-white flex flex-col relative">

            {/* Overlay Info Box */}
            {selectedPart && (
                <div className="absolute top-8 left-8 z-10 w-80 bg-black/60 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold text-cyan-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {selectedPart.title}
                        </h2>
                        <button
                            onClick={() => setSelectedPart(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        {selectedPart.description}
                    </p>
                </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-gray-400 text-sm">
                    Use mouse to rotate (Left Click) and zoom (Scroll). Click components for details.
                </div>
            </div>

            <div className="flex-1 h-screen w-full">
                <Canvas shadows className="h-full w-full">
                    <PerspectiveCamera makeDefault position={[5, 4, 6]} fov={45} />

                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={100} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={50} />

                    <Suspense fallback={null}>
                        <LatheMachine onSelectPart={setSelectedPart} selectedPart={selectedPart} />
                        {/* Environment removed for stability testing */}
                    </Suspense>

                    <OrbitControls
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2}
                        enablePan={false}
                        minDistance={4}
                        maxDistance={15}
                    />
                </Canvas>
            </div>
        </div>
    );
}

export default InteractiveLathe;
