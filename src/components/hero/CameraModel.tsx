import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface CameraModelProps {
  emissiveIntensity?: number;
  scale?: number;
}

/**
 * Low-poly CCTV camera built from Three.js primitives.
 * - Cylindrical body
 * - Lens ring + lens cap with emissive glow
 * - Mount arm
 * - Wall mount plate
 */
export default function CameraModel({ 
  emissiveIntensity = 0, 
  scale = 1 
}: CameraModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Moderate idle rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  // Materials
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#60646b', // Premium anodized grey metallic
        metalness: 0.7,
        roughness: 0.4,
      }),
    []
  );

  const darkMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#050505',
        metalness: 0.1,
        roughness: 0.9,
      }),
    []
  );

  const lensMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a2a5c',
        emissive: new THREE.Color('#3b82f6'),
        emissiveIntensity,
        metalness: 0.3,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
      }),
    [emissiveIntensity]
  );

  const lensRingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#222222',
        metalness: 0.95,
        roughness: 0.15,
      }),
    []
  );

  return (
    <group ref={groupRef} scale={scale} rotation={[0, 0, 0]}>
      {/* Camera body — modern rounded box with high smoothness to prevent fan artifacts */}
      <RoundedBox args={[1.5, 0.9, 0.9]} radius={0.15} smoothness={16} position={[0, 0, 0]} material={bodyMaterial} />



      {/* Large Dark Recess (The black circular area) */}
      <mesh position={[0.742, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={darkMetal}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 64]} />
      </mesh>

      {/* Outer Thick Lens Ring */}
      <mesh position={[0.75, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={lensRingMaterial}>
        <torusGeometry args={[0.18, 0.05, 16, 64]} />
      </mesh>

      {/* Inner Thin Lens Ring */}
      <mesh position={[0.75, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={bodyMaterial}>
        <torusGeometry args={[0.10, 0.015, 16, 64]} />
      </mesh>

      {/* Center Lens Core (Dark Glass) */}
      <mesh position={[0.748, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={lensMaterial}>
        <circleGeometry args={[0.09, 64]} />
      </mesh>

      {/* Center Lens Highlight (Emissive) */}
      <mesh position={[0.749, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.03, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={new THREE.Color('#3b82f6')}
          emissiveIntensity={emissiveIntensity * 2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Small Flashlight Assembly (Embedded perfectly flush into body) */}
      <group position={[0.75, -0.25, 0.25]} rotation={[0, 0, -Math.PI / 2]}>
        {/* Outer Casing Hole (blends into body perfectly) */}
        <mesh position={[0, -0.01, 0]} material={bodyMaterial}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 32]} />
        </mesh>
        
        {/* Inner Chrome Reflector Cone */}
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.035, 0.015, 0.018, 32]} />
          <meshStandardMaterial color="#cccccc" metalness={1} roughness={0.05} />
        </mesh>

        {/* The LED Phosphor Chip (yellow when idle, white when on) */}
        <mesh position={[0, -0.018, 0]}>
          <boxGeometry args={[0.01, 0.01, 0.005]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive={new THREE.Color('#ffffff')}
            emissiveIntensity={emissiveIntensity > 0 ? 5 + emissiveIntensity * 5 : 0}
          />
        </mesh>

        {/* Inner Glass Dome (Bulb) */}
        <mesh position={[0, -0.015, 0]}>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Outer Flush Glass Cover */}
        <mesh position={[0, -0.001, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.002, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} metalness={1} roughness={0.1} />
        </mesh>

        <pointLight
          position={[0, 0.02, 0]}
          intensity={emissiveIntensity > 0 ? 2 + emissiveIntensity * 2 : 0}
          distance={5}
          decay={2}
          color="#ffffff"
        />
      </group>

      {/* Mount arm — connects body to wall plate */}
      <mesh position={[-0.2, 0.65, 0]} material={bodyMaterial}>
        <boxGeometry args={[0.12, 0.6, 0.12]} />
      </mesh>

      {/* Arm joint — connecting piece */}
      <mesh position={[-0.2, 0.38, 0]} material={bodyMaterial}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>

      {/* Wall mount plate */}
      <mesh position={[-0.2, 1.0, 0]} material={bodyMaterial}>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
      </mesh>


    </group>
  );
}
