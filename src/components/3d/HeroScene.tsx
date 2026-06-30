import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Sparkles,
  Sphere,
  MeshDistortMaterial,
} from "@react-three/drei";
import { useRef, useState, useEffect, ComponentRef } from "react";
import * as THREE from "three";

interface PokeballProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function Pokeball({ isOpen, setIsOpen }: PokeballProps) {
  const meshRef = useRef<THREE.Group>(null);
  const topHalfRef = useRef<THREE.Group>(null);
  const buttonMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const auraMaterialRef = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);

  const [hovered, setHovered] = useState(false);

  // Change cursor on hover for better user feedback
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    // Smooth scale transitions based on hover & open states
    const targetScale = isOpen ? 1.08 : hovered ? 1.04 : 1.0;
    if (meshRef.current) {
      const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.set(s, s, s);

      // Rotate group: slow continuous rotation + mouse coordinates tilt
      const rotSpeed = isOpen ? 0.05 : 0.12;
      const targetRotX = -state.pointer.y * 0.45;
      const targetRotY = state.pointer.x * 0.45 + elapsed * rotSpeed;
      const targetRotZ = state.pointer.x * 0.08 + Math.sin(elapsed * 0.4) * 0.03;

      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.08);
    }

    // Smooth open/close pivot rotation for the lid (around back equator hinge)
    if (topHalfRef.current) {
      const targetLidRotation = isOpen ? -Math.PI / 2.6 : 0;
      topHalfRef.current.rotation.x = THREE.MathUtils.lerp(
        topHalfRef.current.rotation.x,
        targetLidRotation,
        0.1
      );
    }

    // Animate inner button glow pulsing
    if (buttonMaterialRef.current) {
      const targetIntensity = isOpen
        ? 3.2 + Math.sin(elapsed * 12) * 0.8
        : 0.5 + Math.sin(elapsed * 2.5) * 0.2;
      buttonMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        buttonMaterialRef.current.emissiveIntensity,
        targetIntensity,
        0.1
      );
    }

    // Animate inner core distortion and opacity when open
    if (auraMaterialRef.current) {
      const targetIntensity = isOpen ? 4.5 : 1.2;
      const targetOpacity = isOpen ? 0.75 : 0.25;
      auraMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        auraMaterialRef.current.emissiveIntensity,
        targetIntensity,
        0.1
      );
      auraMaterialRef.current.opacity = THREE.MathUtils.lerp(
        auraMaterialRef.current.opacity,
        targetOpacity,
        0.1
      );
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      <Float speed={isOpen ? 0.7 : 1.8} rotationIntensity={0.2} floatIntensity={isOpen ? 0.3 : 0.8}>
        {/* Top Half (Red Dome) with Hinge Pivot at [0, 0.05, -1.9] */}
        <group ref={topHalfRef} position={[0, 0.05, -1.9]}>
          <group position={[0, -0.05, 1.9]}>
            <mesh>
              <sphereGeometry args={[2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2 - 0.05]} />
              <meshPhysicalMaterial
                color="#FF3333"
                metalness={0.5}
                roughness={0.15}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
          </group>
        </group>

        {/* Bottom Half (White Dome) */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry
            args={[2, 64, 64, 0, Math.PI * 2, Math.PI / 2 + 0.05, Math.PI / 2 - 0.05]}
          />
          <meshPhysicalMaterial color="#FFFFFF" metalness={0.25} roughness={0.15} clearcoat={1} />
        </mesh>

        {/* Center Black Band */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.98, 1.98, 0.15, 64]} />
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Outer Button Collar */}
        <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Inner Button (Glowing & Pulsing) */}
        <mesh position={[0, 0, 2.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
          <meshPhysicalMaterial
            ref={buttonMaterialRef}
            color="#FFFFFF"
            emissive="#A98FF3"
            emissiveIntensity={0.5}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>

        {/* Glowing Aura Core inside the Pokeball */}
        <Sphere args={[1.8, 32, 32]}>
          <MeshDistortMaterial
            ref={auraMaterialRef}
            color="#FFFFFF"
            emissive="#A98FF3"
            emissiveIntensity={2}
            distort={0.4}
            speed={2}
            transparent
            opacity={0.3}
          />
        </Sphere>

        {/* Internal Light source that emerges when the Pokeball flips open */}
        {isOpen && (
          <pointLight position={[0, 0.2, 0.3]} intensity={8} distance={6} color="#A98FF3" />
        )}
      </Float>
    </group>
  );
}

export function HeroScene() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-90 overflow-hidden pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[10, 10, 10]} intensity={1.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.65} color="#A98FF3" />

        <Pokeball isOpen={isOpen} setIsOpen={setIsOpen} />

        <Sparkles
          count={isOpen ? 450 : 220}
          scale={isOpen ? 16 : 12}
          size={isOpen ? 4.5 : 2.5}
          speed={isOpen ? 1.5 : 0.4}
          opacity={isOpen ? 0.9 : 0.65}
          color={isOpen ? "#D3C2FF" : "#A98FF3"}
        />

        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 2 - 0.2}
        />
      </Canvas>
    </div>
  );
}
