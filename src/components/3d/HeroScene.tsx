import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Sparkles,
  Sphere,
  MeshDistortMaterial,
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Pokeball() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Top Half - Red */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2 - 0.05]} />
          <meshPhysicalMaterial
            color="#FF3333"
            metalness={0.5}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Bottom Half - White */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry
            args={[2, 64, 64, 0, Math.PI * 2, Math.PI / 2 + 0.05, Math.PI / 2 - 0.05]}
          />
          <meshPhysicalMaterial color="#FFFFFF" metalness={0.2} roughness={0.1} clearcoat={1} />
        </mesh>

        {/* Center Black Band */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.98, 1.98, 0.15, 64]} />
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Outer Button */}
        <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Inner Button */}
        <mesh position={[0, 0, 2.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.5}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>

        {/* Glowing Aura Inside */}
        <Sphere args={[1.8, 32, 32]}>
          <MeshDistortMaterial
            color="#FFFFFF"
            emissive="#A98FF3"
            emissiveIntensity={2}
            distort={0.4}
            speed={2}
            transparent
            opacity={0.3}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-90 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#A98FF3" />

        <Pokeball />

        <Sparkles count={300} scale={15} size={3} speed={0.4} opacity={0.6} color="#A98FF3" />

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
