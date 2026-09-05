import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingMessages = [
  { text: 'Initializing Vayu Rakshak', icon: '◈' },
  { text: 'Fetching environmental data', icon: '◉' },
  { text: 'Locating your environment', icon: '⊕' },
  { text: 'Analyzing local conditions', icon: '◎' },
];

/**
 * Cinematic loading screen with sequential status messages.
 */
export default function LoadingScreen({ onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex(prev => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(messageTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    // Progress bar
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    // Complete after messages
    const completeTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onComplete?.(), 800);
    }, 5000);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-atmos-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-atmos-cyan/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-center flex flex-col items-center"
      >
        <img
          src="/logo.png"
          alt="Vayu Rakshak Logo"
          className="w-36 h-36 object-contain mb-4 drop-shadow-[0_0_35px_rgba(34,211,238,0.9)] animate-pulse"
        />
        <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text-cyan mb-3">
          Vayu Rakshak
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-atmos-text-muted">
          Personal Environmental Intelligence
        </p>
      </motion.div>

      {/* Status messages */}
      <div className="h-8 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 text-sm text-atmos-text-dim"
          >
            <span className="text-atmos-cyan text-lg">
              {loadingMessages[messageIndex]?.icon}
            </span>
            <span>{loadingMessages[messageIndex]?.text}</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-atmos-cyan/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-atmos-cyan/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-atmos-cyan/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-atmos-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
            boxShadow: '0 0 10px #22d3ee80',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-atmos-text-muted"
      >
        Environmental conditions are not equally risky for everyone
      </motion.p>
    </motion.div>
  );
}
