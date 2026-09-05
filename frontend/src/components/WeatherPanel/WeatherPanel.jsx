import { motion } from 'framer-motion';
import { Thermometer, Droplets, Sun, Wind, Cloud, CloudRain } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.4 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

/**
 * Weather metrics grid with animated entries.
 */
export default function WeatherPanel({ weather }) {
  if (!weather) return null;

  const metrics = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${weather.temperature}°`,
      unit: 'C',
      color: weather.temperature >= 35 ? '#ef4444' : weather.temperature >= 25 ? '#f97316' : '#3b82f6',
      large: true,
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${weather.feelsLike}°`,
      unit: 'C',
      color: weather.feelsLike >= 38 ? '#ef4444' : '#f97316',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: weather.humidity,
      unit: '%',
      color: '#3b82f6',
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: weather.uvIndex,
      unit: getUVLabel(weather.uvIndex),
      color: getUVColor(weather.uvIndex),
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: weather.windSpeed,
      unit: 'km/h',
      color: '#22d3ee',
    },
    {
      icon: CloudRain,
      label: 'Rain Chance',
      value: weather.precipitationProbability ?? 0,
      unit: '%',
      color: '#60a5fa',
    },
    {
      icon: Cloud,
      label: 'Condition',
      value: weather.condition,
      isText: true,
      color: '#94a3b8',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass p-6"
    >
      <div className="section-title">Weather Conditions</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            variants={item}
            className={`group relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-300 ${
              metric.large ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            {/* Icon */}
            <metric.icon
              className="w-4 h-4 mb-3 transition-colors"
              style={{ color: `${metric.color}80` }}
            />

            {/* Value */}
            {metric.isText ? (
              <div className="text-lg font-medium text-white">{metric.value}</div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span
                  className="text-3xl font-display font-bold"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </span>
                <span className="text-xs text-atmos-text-muted">{metric.unit}</span>
              </div>
            )}

            {/* Label */}
            <div className="stat-label">{metric.label}</div>

            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${metric.color}08, transparent 60%)`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function getUVLabel(uv) {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function getUVColor(uv) {
  if (uv <= 2) return '#22c55e';
  if (uv <= 5) return '#eab308';
  if (uv <= 7) return '#f97316';
  if (uv <= 10) return '#ef4444';
  return '#a855f7';
}
