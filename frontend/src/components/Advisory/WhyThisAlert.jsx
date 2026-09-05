import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * "Why You're Seeing This" explainability section.
 * Shows personalized risk factors as animated checklist.
 */
export default function WhyThisAlert({ factors }) {
  if (!factors || factors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <HelpCircle className="w-4 h-4 text-atmos-cyan" />
        <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-atmos-text-muted">
          Why You&apos;re Seeing This
        </h3>
      </div>

      <div className="space-y-3">
        {factors.map((factor, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.0 + i * 0.12 }}
            className="flex items-start gap-3"
          >
            <CheckCircle2
              className="w-4 h-4 text-atmos-cyan flex-shrink-0 mt-0.5"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))',
              }}
            />
            <span className="text-sm text-atmos-text-dim leading-snug">
              {factor}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
