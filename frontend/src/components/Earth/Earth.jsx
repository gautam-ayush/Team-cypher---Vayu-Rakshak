import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 3D Earth globe with textures, auto-rotation, and smooth fly-to animation.
 */
export default function Earth({ targetRotation, isAnimating, isPinpointed, onAnimationComplete }) {
  const meshRef = useRef();
  const cloudsRef = useRef();

  // Use reliable local textures from public/textures
  const [earthMap, bumpMap, specMap, cloudMap] = useTexture([
    '/textures/earth_atmos_2048.jpg',
    '/textures/earth_normal_2048.jpg',
    '/textures/earth_specular_2048.jpg',
    '/textures/earth_clouds_1024.png',
  ]);

  // Auto-rotation speed
  const rotationSpeed = useRef(0.001);
  const currentRotation = useRef({ x: 0, y: 0 });
  const animProgress = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isAnimating && targetRotation) {
      // Smooth fly-to animation
      animProgress.current = Math.min(1, animProgress.current + delta * 0.5);
      const t = easeInOutCubic(animProgress.current);

      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.y,
        t
      );
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.x,
        t * 0.5
      );

      meshRef.current.rotation.y = currentRotation.current.y;
      meshRef.current.rotation.x = currentRotation.current.x;

      if (animProgress.current >= 0.98) {
        onAnimationComplete?.();
      }
    } else if (isPinpointed || targetRotation) {
      // Pinpointed — HOLD position steady, stop spinning!
      if (targetRotation) {
        meshRef.current.rotation.y = targetRotation.y;
        meshRef.current.rotation.x = targetRotation.x;
      }
    } else {
      // Auto-rotate only when not pinpointed
      meshRef.current.rotation.y += rotationSpeed.current;
      currentRotation.current.y = meshRef.current.rotation.y;
    }

    // Clouds rotate slightly faster only when not pinpointed
    if (cloudsRef.current && !isPinpointed && !targetRotation) {
      cloudsRef.current.rotation.y += 0.0003;
    }
  });

  const earthMaterial = useMemo(() => (
    <meshPhongMaterial
      map={earthMap}
      bumpMap={bumpMap}
      bumpScale={0.05}
      specularMap={specMap}
      specular={new THREE.Color('#1a3a5c')}
      shininess={15}
    />
  ), [earthMap, bumpMap, specMap]);

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        {earthMaterial}
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
