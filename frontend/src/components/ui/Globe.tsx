import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const EARTH_URL = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg";
const LIGHTS_URL = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png";

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const [earthTexture, lightsTexture] = useLoader(THREE.TextureLoader, [EARTH_URL, LIGHTS_URL]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Primary rotation for the earth
    meshRef.current.rotation.y = time * 0.1;
    // Slight counter-rotation or different speed for the group/atmosphere effects
    groupRef.current.rotation.y = time * 0.05;
  });

  return (
    <group ref={groupRef} scale={3.2}>
      {/* Earth Sphere */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          emissiveMap={lightsTexture}
          emissive="#ffffcc"
          emissiveIntensity={1.5}
          roughness={0.7}
          metalness={0.2}
        />
      </Sphere>

      {/* Glowing atmosphere effect */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {/* Technical rings */}
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[1.3, 0.002, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
      </mesh>

      <mesh rotation={[Math.PI / 1.8, -0.3, 0]}>
        <torusGeometry args={[1.4, 0.001, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
      </mesh>

      {/* Technical wireframe overlay */}
      <mesh scale={1.01}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}
