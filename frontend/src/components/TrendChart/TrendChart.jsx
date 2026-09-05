import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';

/**
 * 7-day trend chart for AQI, PM2.5, or Temperature.
 */
export default function TrendChart({ trendData }) {
  const [activeMetric, setActiveMetric] = useState('aqi'); // aqi | pm25 | temp

  if (!trendData || trendData.length === 0) return null;

  const metrics = {
    aqi: { label: 'AQI', color: '#3b82f6', unit: '' },
    pm25: { label: 'PM2.5', color: '#f97316', unit: 'µg/m³' },
    temp: { label: 'Temperature', color: '#ef4444', unit: '°C' },
  };

  const metric = metrics[activeMetric];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-atmos-surface/90 backdrop-blur-md border border-atmos-border p-3 rounded-lg shadow-xl">
          <p className="text-xs text-atmos-text-muted mb-1">{label}</p>
          <p className="text-sm font-semibold" style={{ color: metric.color }}>
            {metric.label}: {payload[0].value} {metric.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025, boxShadow: '0 0 35px rgba(34, 211, 238, 0.4)', borderColor: 'rgba(34, 211, 238, 0.6)' }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3 }}
      className="glass p-6 md:p-8 cursor-pointer transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-atmos-cyan" />
          <div className="section-title mb-0">7-Day Trend</div>
        </div>

        {/* Metric Toggles */}
        <div className="flex bg-white/5 rounded-lg p-1 w-fit">
          {Object.entries(metrics).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeMetric === key
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-atmos-text-muted hover:text-atmos-text-dim hover:bg-white/5'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            
            {/* Reference Line for AQI threshold if showing AQI */}
            {activeMetric === 'aqi' && (
              <ReferenceLine y={100} stroke="#f97316" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'Unhealthy (Sens.)', fill: '#f97316', fontSize: 10, opacity: 0.8 }} />
            )}

            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={metric.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient-${activeMetric})`}
              activeDot={{ r: 6, fill: metric.color, stroke: '#0a0e1a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
