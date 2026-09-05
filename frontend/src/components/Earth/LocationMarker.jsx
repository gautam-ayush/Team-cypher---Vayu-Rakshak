import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLngToVector3 } from '../../utils/location';

/**
 * Pulsing location marker on the globe surface.
 * Shows a glowing pin + "You are here" label.
 */
export default function LocationMarker({ lat, lng, city, visible }) {
  const groupRef = useRef();
  const pulseRef = useRef();
  const ringRef = useRef();
  const time = useRef(0);

  // Convert lat/lng to 3D position
  const position = latLngToVector3(lat, lng, 2.02);

  useFrame((state, delta) => {
    if (!visible) return;
    time.current += delta;

    // Pulsing glow
    if (pulseRef.current) {
      const scale = 1 + Math.sin(time.current * 3) * 0.3;
      pulseRef.current.scale.setScalar(scale);
      pulseRef.current.material.opacity = 0.4 + Math.sin(time.current * 3) * 0.2;
    }

    // Expanding ring
    if (ringRef.current) {
      const ringScale = 1 + (time.current % 2) * 1.5;
      ringRef.current.scale.setScalar(ringScale);
      ringRef.current.material.opacity = Math.max(0, 0.6 - (time.current % 2) * 0.3);
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Core marker dot */}
      <mesh>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>

      {/* Pulsing glow */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
      </mesh>

      {/* Expanding ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.06, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} side={2} />
      </mesh>

      {/* HTML Label */}
      <Html
        position={[0, 0.15, 0]}
        center
        distanceFactor={5}
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex flex-col items-center animate-fade-in">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/80 font-medium whitespace-nowrap">
            You are here
          </div>
          <div className="text-[13px] font-semibold text-white whitespace-nowrap mt-0.5 font-display">
            {city || 'Your Location'}
          </div>
        </div>
      </Html>
    </group>
  );
}
