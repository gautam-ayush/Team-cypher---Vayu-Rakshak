import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Preload } from '@react-three/drei';
import Earth from './Earth';
import Atmosphere from './Atmosphere';
import LocationMarker from './LocationMarker';
import { latLngToRotation } from '../../utils/location';
import { useApp } from '../../context/AppContext';

/**
 * Camera controller that handles smooth zoom-in animation.
 */
function CameraController({ isZooming, onZoomComplete }) {
  const { camera } = useThree();
  const targetZ = useRef(6);
  const startZ = useRef(6);
  const progress = useRef(0);

  useEffect(() => {
    if (isZooming) {
      startZ.current = camera.position.z;
      targetZ.current = 3.8;
      progress.current = 0;
    }
  }, [isZooming, camera]);

  useFrame((state, delta) => {
    if (isZooming) {
      progress.current = Math.min(1, progress.current + delta * 0.4);
      const t = easeInOutCubic(progress.current);
      camera.position.z = startZ.current + (targetZ.current - startZ.current) * t;

      if (progress.current >= 0.95) {
        onZoomComplete?.();
      }
    }
  });

  return null;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Main Earth scene — orchestrates the globe, camera, and animations.
 */
export default function EarthScene({ onComplete, isSmall = false }) {
  const { location, geoStatus } = useApp();
  const [earthPhase, setEarthPhase] = useState('rotating'); // rotating | locating | zooming | complete
  const [showMarker, setShowMarker] = useState(false);
  const [targetRotation, setTargetRotation] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const hasAnimated = useRef(false);

  // When location changes or is set, pinpoint it on the globe immediately
  useEffect(() => {
    if (location && location.lat != null && location.lng != null) {
      const rotation = latLngToRotation(location.lat, location.lng);
      setTargetRotation(rotation);
      setShowMarker(true);

      if (!hasAnimated.current && geoStatus === 'success') {
        hasAnimated.current = true;
        setEarthPhase('locating');
        setIsAnimating(true);
      }
    }
  }, [location?.lat, location?.lng, geoStatus]);

  const handleFlyComplete = useCallback(() => {
    setIsAnimating(false);
    setShowMarker(true);
    setEarthPhase('zooming');
    setIsZooming(true);
  }, []);

  const handleZoomComplete = useCallback(() => {
    setIsZooming(false);
    setEarthPhase('complete');

    // Delay before transitioning to dashboard
    setTimeout(() => {
      onComplete?.();
    }, 2500);
  }, [onComplete]);

  const containerClass = isSmall
    ? 'w-full h-64 md:h-80 rounded-2xl overflow-hidden'
    : 'w-full h-screen';

  return (
    <div className={containerClass}>
      <Canvas
        camera={{ position: [0, 0, isSmall ? 4.5 : 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.15} />
          <directionalLight
            position={[5, 3, 5]}
            intensity={1.8}
            color="#fff5e6"
          />
          <pointLight position={[-10, -5, -10]} intensity={0.3} color="#4488ff" />

          {/* Stars background */}
          <Stars
            radius={100}
            depth={60}
            count={4000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Earth */}
          <Earth
            targetRotation={targetRotation}
            isAnimating={isAnimating}
            isPinpointed={earthPhase === 'zooming' || earthPhase === 'complete' || showMarker}
            onAnimationComplete={handleFlyComplete}
          />

          {/* Atmospheric glow */}
          <Atmosphere />

          {/* Location marker */}
          {location && (
            <LocationMarker
              lat={location.lat}
              lng={location.lng}
              city={location.city}
              visible={showMarker}
            />
          )}

          {/* Camera animation */}
          <CameraController
            isZooming={isZooming}
            onZoomComplete={handleZoomComplete}
          />

          {/* Orbit controls for interaction */}
          <OrbitControls
            enableZoom={isSmall}
            enablePan={false}
            enableRotate={!isAnimating && !isZooming}
            rotateSpeed={0.4}
            minDistance={3}
            maxDistance={isSmall ? 8 : 12}
            autoRotate={false}
            autoRotateSpeed={0}
          />

          <Preload all />
        </Suspense>
      </Canvas>

      {/* Overlaid text during animation */}
      {!isSmall && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none z-10">
          {earthPhase === 'rotating' && (
            <div className="animate-fade-in text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-atmos-text-muted mb-2">
                Personal Environmental Intelligence
              </div>
            </div>
          )}

          {earthPhase === 'locating' && (
            <div className="animate-fade-in text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-atmos-cyan/80 mb-2">
                Locating your environment
              </div>
              <div className="w-32 h-0.5 bg-atmos-border rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-atmos-cyan rounded-full animate-shimmer" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {(earthPhase === 'zooming' || earthPhase === 'complete') && location && (
            <div className="animate-fade-in-up text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-atmos-cyan/80 mb-3">
                Environmental Intelligence for
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white glow-text">
                {location.city}{location.region ? `, ${location.region}` : ''}
              </h1>
              {location.country && (
                <div className="text-sm text-atmos-text-muted mt-2">{location.country}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
