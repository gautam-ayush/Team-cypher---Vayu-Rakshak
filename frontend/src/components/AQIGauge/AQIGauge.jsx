import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAQIColor } from '../../services/aqiApi';

/**
 * Animated circular AQI gauge with glowing arc.
 */
export default function AQIGauge({ aqi, level, pm25, dominantPollutant }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [displayNumber, setDisplayNumber] = useState(0);
  const rafRef = useRef(null);

  const maxAQI = 500;
  const percentage = Math.min((aqi / maxAQI) * 100, 100);
  const color = getAQIColor(aqi);

  // Animated arc
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degrees
  const dashOffset = arcLength - (arcLength * animatedValue) / 100;

  // Animate on mount
  useEffect(() => {
    const start = performance.now();
    const duration = 2000;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      setAnimatedValue(percentage * eased);
      setDisplayNumber(Math.round(aqi * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [aqi, percentage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass p-6 md:p-8 flex flex-col items-center"
    >
      <div className="section-title mb-2">Air Quality Index</div>

      {/* Gauge SVG */}
      <div className="relative w-52 h-52 md:w-60 md:h-60">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full -rotate-[135deg]"
        >
          {/* Background arc */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="rgba(30, 41, 59, 0.5)"
            strokeWidth="8"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${color}80)`,
              transition: 'stroke 0.5s ease',
            }}
          />

          {/* Glow arc (duplicate, blurred) */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            opacity={0.2}
            style={{ filter: 'blur(6px)' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl md:text-6xl font-display font-bold"
            style={{ color }}
            role="text"
            aria-label={`AQI value: ${aqi}`}
          >
            {displayNumber}
          </span>
          <span className="stat-label mt-1">AQI</span>
          <span
            className="text-xs font-semibold uppercase tracking-wider mt-2 px-3 py-1 rounded-full"
            style={{
              color,
              backgroundColor: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          >
            {level}
          </span>
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="flex items-center gap-6 mt-4">
        <div className="text-center">
          <div className="text-lg font-display font-semibold text-white">{pm25}</div>
          <div className="text-[10px] uppercase tracking-wider text-atmos-text-muted">PM2.5 µg/m³</div>
        </div>
        <div className="w-px h-8 bg-atmos-border" />
        <div className="text-center">
          <div className="text-xs text-atmos-text-dim">Primary</div>
          <div className="text-xs font-medium text-atmos-cyan">{dominantPollutant}</div>
        </div>
      </div>
    </motion.div>
  );
}
