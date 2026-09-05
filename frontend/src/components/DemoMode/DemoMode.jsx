import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { demoProfiles } from '../../data/mockData';

/**
 * Quick profile switcher for hackathon demo.
 * Shows how personalization changes the UI for different people in same environment.
 */
export default function DemoMode() {
  const [isOpen, setIsOpen] = useState(false);
  const { setDemoProfile, profile } = useApp();

  const isProfileActive = (demoP) => {
    return profile.age === demoP.age && 
           profile.condition === demoP.condition && 
           profile.occupation === demoP.occupation;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-atmos-surface border border-atmos-border shadow-xl hover:bg-white/5 hover:border-white/10 transition-all hover-lift"
        title="Demo Mode: Switch Profiles"
      >
        <Settings className="w-5 h-5 text-atmos-text-muted" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 z-50 w-80 glass p-5 shadow-2xl origin-bottom-right"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-display font-semibold text-white tracking-wide">
                HACKATHON DEMO MODE
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-atmos-text-muted" />
              </button>
            </div>

            <p className="text-xs text-atmos-text-muted mb-4 leading-relaxed">
              Quickly switch profiles to see how the AI advisory personalizes for different users in the <span className="text-white font-medium">same environment</span>.
            </p>

            <div className="space-y-2">
              {demoProfiles.map((p) => {
                const active = isProfileActive(p);
                return (
                  <button
                    key={p.id}
                    onClick={() => setDemoProfile(p)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      active 
                        ? 'bg-atmos-cyan/10 border-atmos-cyan/30' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <div className={`text-sm font-medium ${active ? 'text-atmos-cyan' : 'text-white'}`}>
                          {p.label}: {p.name}
                        </div>
                        <div className="text-[10px] text-atmos-text-muted mt-0.5 uppercase tracking-wider">
                          {p.condition !== 'none' ? p.condition : 'Healthy'} • {p.occupation}
                        </div>
                      </div>
                    </div>
                    {active ? (
                      <div className="w-2 h-2 rounded-full bg-atmos-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-atmos-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
