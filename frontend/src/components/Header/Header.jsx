import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, RefreshCw, User, Search, ChevronDown, Compass, LogOut, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LocationSearch from '../LocationSearch/LocationSearch';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'environment', label: 'Environment' },
  { id: 'advisory', label: 'Advisory' },
  { id: 'trends', label: 'Trends' },
  { id: 'history', label: 'History' },
];

export default function Header() {
  const { location, activeTab, setActiveTab, profile, createFreshUser, logout } = useApp();
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="sticky top-0 z-40 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Vayu Rakshak Logo" 
                className="w-16 h-16 object-contain rounded-xl drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white tracking-tight">
                Vayu Rakshak
              </h1>
              <p className="text-[9px] uppercase tracking-[0.15em] text-atmos-text-muted -mt-0.5 hidden sm:block">
                Personal Environmental Intelligence
              </p>
            </div>
          </div>

          {/* Navigation — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`nav-link px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'active bg-atmos-cyan/5'
                    : 'hover:bg-white/5'
                }`}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Location Selector Button */}
            <div className="relative">
              <button
                onClick={() => setShowLocationSearch(!showLocationSearch)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-atmos-surface/60 border border-atmos-cyan/30 text-xs text-atmos-cyan hover:bg-atmos-cyan/10 transition-all shadow-glow-cyan/10"
                title="Change / Search Area"
              >
                <MapPin className="w-3.5 h-3.5 text-atmos-cyan" />
                <span className="font-medium max-w-[120px] truncate">{location?.city || 'Select Area'}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Location Search Modal/Popover */}
              <AnimatePresence>
                {showLocationSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 p-4 bg-atmos-surface/95 backdrop-blur-2xl border border-atmos-cyan/40 rounded-2xl shadow-2xl z-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-atmos-cyan" />
                        Select Other Area / City
                      </span>
                      <button
                        onClick={() => setShowLocationSearch(false)}
                        className="text-[10px] text-atmos-text-muted hover:text-white px-2 py-0.5 rounded bg-white/5"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <LocationSearch onLocationSelected={() => setShowLocationSearch(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Refresh */}
            <button
              className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
              aria-label="Refresh data"
              title="Refresh environmental data"
            >
              <RefreshCw className="w-4 h-4 text-atmos-text-muted group-hover:text-atmos-cyan transition-colors" />
            </button>

            {/* User Profile / Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-atmos-surface/60 border border-atmos-border/40 hover:border-atmos-cyan/40 text-xs text-white transition-all"
                aria-label="User profile & login"
                title="Account Settings"
              >
                <div className="w-5 h-5 rounded-full bg-atmos-cyan/20 border border-atmos-cyan/40 flex items-center justify-center text-atmos-cyan font-bold text-[10px]">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[80px] truncate hidden sm:inline">{profile?.name || 'User'}</span>
                <ChevronDown className="w-3 h-3 text-atmos-text-muted" />
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 p-3 bg-atmos-surface/95 backdrop-blur-2xl border border-atmos-cyan/40 rounded-2xl shadow-2xl z-50 flex flex-col gap-2"
                  >
                    <div className="px-2 py-1.5 border-b border-atmos-border/30">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-atmos-cyan" />
                        {profile?.name || 'Guest User'}
                      </div>
                      <div className="text-[10px] text-atmos-text-muted capitalize mt-0.5">
                        {profile?.age || 'Adult'} • {profile?.condition || 'No conditions'}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        createFreshUser();
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-atmos-cyan hover:bg-atmos-cyan/10 transition-colors text-left font-medium"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Log In / Switch Account
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
