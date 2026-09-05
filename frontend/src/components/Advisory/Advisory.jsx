import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Info, ShieldAlert, Zap } from 'lucide-react';

/**
 * AI Personalized Advisory panel with risk indicator and recommendations.
 */
export default function Advisory({ advisory }) {
  if (!advisory) return null;

  const { text, risk, recommendations, confidence } = advisory;
  const isRedAlert = risk.score > 75 || risk.level === 'VERY HIGH';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={`glass p-6 md:p-8 transition-all duration-500 ${
        isRedAlert ? 'border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.35)]' : ''
      }`}
    >
      {/* High Risk Red Alert Banner (> 75 Risk Score) */}
      {isRedAlert && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 p-4.5 rounded-2xl bg-red-500/20 border-2 border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.5)] flex items-start gap-4 animate-pulse text-red-200 backdrop-blur-xl"
        >
          <div className="p-3 rounded-xl bg-red-600 text-white font-bold animate-bounce flex-shrink-0 shadow-lg shadow-red-500/50">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[11px] tracking-widest uppercase shadow-md shadow-red-600/40">
                🚨 RED ALERT EXCEEDED &gt; 75
              </span>
              <span className="text-xs font-bold text-red-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-red-400" />
                RISK SCORE: {risk.score} / 100
              </span>
            </div>
            <div className="text-sm font-semibold text-white mt-1.5 leading-snug">
              CRITICAL HEALTH WARNING: Environmental exposure risk has exceeded the safe threshold of 75/100 for your health profile! Limit outdoor activities immediately and keep rescue medication & air purifiers active.
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="w-5 h-5 text-atmos-cyan" />
            <div className="absolute inset-0 bg-atmos-cyan/20 rounded-full blur-md" />
          </div>
          <div>
            <h2 className="text-sm font-display font-semibold text-white tracking-wide">
              PERSONALIZED ADVISORY
            </h2>
          </div>
        </div>
        <span className="badge bg-atmos-cyan/10 text-atmos-cyan border border-atmos-cyan/20">
          <Brain className="w-3 h-3" />
          AI Health Intelligence
        </span>
      </div>

      {/* Risk Level Indicator */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${risk.color}15`,
            border: `1px solid ${risk.color}30`,
          }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: risk.color }} />
        </div>
        <div>
          <div className="text-xs text-atmos-text-muted uppercase tracking-wider">Risk Level</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-display font-bold" style={{ color: risk.color }}>
              {risk.level}
            </span>
            <span className="text-xs text-atmos-text-muted">
              Score: {risk.score}/100
            </span>
          </div>
        </div>
        {/* Risk bar */}
        <div className="flex-1 ml-4 hidden sm:block">
          <div className="h-2 bg-atmos-border/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${risk.score}%` }}
              transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                backgroundColor: risk.color,
                boxShadow: `0 0 8px ${risk.color}60`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Advisory text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mb-6"
      >
        <p className="text-sm leading-relaxed text-atmos-text/90">
          {text}
        </p>
      </motion.div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-3">
            Recommendations
          </div>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-atmos-text-dim"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-atmos-cyan/60 flex-shrink-0" />
                {rec}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence */}
      <div className="text-[10px] text-atmos-text-muted mb-4">
        Based on: {confidence}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
        <Info className="w-3.5 h-3.5 text-atmos-text-muted flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-atmos-text-muted leading-relaxed">
          This information is general environmental guidance and is not medical advice.
          Consult healthcare professionals for health decisions.
        </p>
      </div>
    </motion.div>
  );
}
