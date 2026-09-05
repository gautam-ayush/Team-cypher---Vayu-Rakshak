import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Custom animated cursor with glowing dot + trailing ring.
 * Expands on hover over interactive elements.
 * Respects prefers-reduced-motion.
 */
export default function CustomCursor() {
  const { cursorType } = useCursor();
  const reducedMotion = useReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if ('ontouchstart' in window) return;

    const handleMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, a, [role="button"], input, select, .cursor-pointer, [data-cursor], .glass, .glass-subtle, .glass-strong, [class*="glass"]');
      setIsHovering(!!isInteractive);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', () => setVisible(true));

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [visible]);

  // Animation loop
  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      // Dot follows closely
      dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.5;
      dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.5;

      // Ring trails behind
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${isHovering ? 1.8 : 1})`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [isHovering, reducedMotion]);

  // Don't render on touch devices or reduced motion
  if (reducedMotion || typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Central glowing dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: isHovering ? '6px' : '8px',
            height: isHovering ? '6px' : '8px',
            background: cursorType === 'globe' ? '#3b82f6' : '#22d3ee',
            boxShadow: `0 0 10px ${cursorType === 'globe' ? '#3b82f6' : '#22d3ee'}, 0 0 20px ${cursorType === 'globe' ? '#3b82f680' : '#22d3ee80'}`,
          }}
        />
      </div>

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        <div
          className="rounded-full border transition-all duration-300"
          style={{
            width: isHovering ? '48px' : '32px',
            height: isHovering ? '48px' : '32px',
            borderColor: isHovering
              ? 'rgba(34, 211, 238, 0.6)'
              : 'rgba(34, 211, 238, 0.25)',
            background: isHovering
              ? 'rgba(34, 211, 238, 0.05)'
              : 'transparent',
          }}
        />
      </div>
    </>
  );
}
