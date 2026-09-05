import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { getRiskColor } from '../../utils/risk';

/**
 * Vertical timeline of past alerts.
 */
export default function AlertHistory({ historyData }) {
  if (!historyData || historyData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <History className="w-4 h-4 text-atmos-cyan" />
        <div className="section-title mb-0">Alert History</div>
      </div>

      <div className="relative border-l border-atmos-border/50 ml-3 space-y-6">
        {historyData.slice(0, 5).map((alert, index) => {
          // Approximate score from risk level for color mapping
          let score = 20;
          if (alert.level === 'moderate') score = 40;
          if (alert.level === 'high') score = 65;
          if (alert.level === 'very high') score = 90;
          const color = getRiskColor(score);

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative pl-6"
            >
              {/* Timeline Dot */}
              <div
                className="absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}80`,
                  border: '2px solid #0a0e1a'
                }}
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                <span className="text-sm font-medium text-white">{alert.date}</span>
                <span className="text-[10px] text-atmos-text-muted">{alert.dateShort}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                 <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color,
                    backgroundColor: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {alert.level}
                </span>
                <span className="text-[10px] text-atmos-text-dim">AQI {alert.aqi}</span>
              </div>

              <p className="text-sm text-atmos-text-muted leading-snug">
                {alert.summary}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
