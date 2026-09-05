import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Shield, ChevronRight, User, Heart, Briefcase, Sparkles, LogIn, UserPlus, CheckCircle2 } from 'lucide-react';

const ageOptions = [
  { value: 'child', label: 'Child', icon: '👶', desc: 'Under 12' },
  { value: 'teen', label: 'Teen', icon: '🧑', desc: '13–17' },
  { value: 'adult', label: 'Adult', icon: '🧑‍💼', desc: '18–59' },
  { value: 'senior', label: 'Senior', icon: '🧓', desc: '60+' },
];

const conditionOptions = [
  { value: 'none', label: 'None', desc: 'No conditions' },
  { value: 'asthma', label: 'Asthma', desc: 'Respiratory' },
  { value: 'copd', label: 'COPD', desc: 'Chronic lung' },
  { value: 'heart', label: 'Heart', desc: 'Cardiovascular' },
  { value: 'allergies', label: 'Allergies', desc: 'Seasonal/dust' },
  { value: 'other', label: 'Other', desc: 'Specify later' },
];

const occupationOptions = [
  { value: 'student', label: 'Student', icon: '📚' },
  { value: 'office', label: 'Office', icon: '🏢' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌿' },
  { value: 'traffic', label: 'Traffic', icon: '🚗' },
  { value: 'delivery', label: 'Delivery', icon: '📦' },
  { value: 'other', label: 'Other', icon: '💼' },
];

export default function Onboarding() {
  const { updateProfile, setPhase, loginExistingUser, getAllUsers } = useApp();

  const [mode, setMode] = useState('select'); // 'select', 'login', 'create'
  const [loginName, setLoginName] = useState('');
  const [loginError, setLoginError] = useState('');

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('adult');
  const [condition, setCondition] = useState('none');
  const [customCondition, setCustomCondition] = useState('');
  const [occupation, setOccupation] = useState('office');
  const [customOccupation, setCustomOccupation] = useState('');

  const existingUsers = getAllUsers();
  const totalSteps = 4;

  const handleComplete = () => {
    const finalCondition = condition === 'other' ? (customCondition.trim() || 'Other') : condition;
    const finalOccupation = occupation === 'other' ? (customOccupation.trim() || 'Other') : occupation;
    updateProfile({ 
      name: name.trim() || 'User', 
      age, 
      condition: finalCondition, 
      occupation: finalOccupation,
      customCondition,
      customOccupation
    });
    setPhase('loading');
  };

  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    if (!loginName.trim()) {
      setLoginError('Please enter your registered user name');
      return;
    }
    const success = loginExistingUser(loginName.trim());
    if (!success) {
      setLoginError(`No account found for "${loginName}". Please check the name or create a fresh account.`);
    }
  };

  const handleQuickLogin = (userName) => {
    const success = loginExistingUser(userName);
    if (!success) {
      setLoginError(`Failed to login as ${userName}`);
    }
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 2 && condition === 'other') return customCondition.trim().length > 0;
    if (step === 3 && occupation === 'other') return customOccupation.trim().length > 0;
    return true;
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40, scale: 0.98 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -40, scale: 0.98 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-atmos-bg">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-atmos-cyan/8 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-atmos-blue/6 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-atmos-purple/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

      {/* Main card container */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Header Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 flex flex-col items-center"
        >
          <img
            src="/logo.png"
            alt="Vayu Rakshak Logo"
            className="w-28 h-28 object-contain mb-2 drop-shadow-[0_0_30px_rgba(34,211,238,0.9)] hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text-cyan mb-1">
            Vayu Rakshak
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-atmos-text-muted">
            Personal Environmental Intelligence
          </p>
        </motion.div>

        {/* Card Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-strong p-6 md:p-8"
        >
          {/* Initial Mode Selection Screen */}
          {mode === 'select' && (
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-display font-bold text-white mb-2">Welcome to Vayu Rakshak</h2>
              <p className="text-xs text-atmos-text-muted mb-6">
                Sign in to your existing account or create a fresh personal profile.
              </p>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-4 mb-6">
                {existingUsers.length > 0 && (
                  <button
                    onClick={() => setMode('login')}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-atmos-cyan/40 text-atmos-cyan hover:bg-atmos-cyan/20 hover:scale-[1.02] transition-all font-semibold text-sm shadow-glow-cyan/20"
                  >
                    <LogIn className="w-5 h-5 text-atmos-cyan" />
                    Log In Existing User
                  </button>
                )}

                <button
                  onClick={() => setMode('create')}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-glow-cyan hover:shadow-glow-cyan/50 hover:scale-[1.02] transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Fresh User Account
                </button>
              </div>

              {/* Saved Accounts Quick List */}
              {existingUsers.length > 0 && (
                <div className="w-full border-t border-atmos-border/30 pt-4 text-left">
                  <span className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-3 block font-semibold">
                    Select Saved Account ({existingUsers.length})
                  </span>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {existingUsers.map((u) => (
                      <button
                        key={u.id || u.name}
                        onClick={() => handleQuickLogin(u.name)}
                        className="flex items-center justify-between p-3 rounded-xl bg-atmos-surface/40 border border-atmos-border/30 hover:border-atmos-cyan/50 hover:bg-atmos-cyan/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-atmos-cyan/20 border border-atmos-cyan/40 flex items-center justify-center text-atmos-cyan font-bold text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-semibold text-white group-hover:text-atmos-cyan transition-colors">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-atmos-text-muted capitalize">
                              {u.age || 'Adult'} • {u.condition || 'No conditions'}
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-atmos-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Login Screen */}
          {mode === 'login' && (
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-atmos-cyan/10 border border-atmos-cyan/20 flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-atmos-cyan" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold text-white">Log In to Your Profile</h2>
                  <p className="text-xs text-atmos-text-muted">Enter your registered name to restore settings</p>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-2 block font-medium">
                    User Name
                  </label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => {
                      setLoginName(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="Enter your registered name..."
                    className="input-dark text-base w-full"
                    autoFocus
                  />
                  {loginError && (
                    <p className="text-xs text-red-400 mt-2 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                      {loginError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-atmos-border/30">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('select');
                      setLoginError('');
                    }}
                    className="text-xs text-atmos-text-muted hover:text-white px-3 py-2"
                  >
                    ← Back Options
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-xs shadow-glow-cyan hover:scale-105 transition-all"
                  >
                    Log In <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Creation / Onboarding Flow */}
          {mode === 'create' && (
            <div>
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-6">
                {[...Array(totalSteps)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full overflow-hidden bg-atmos-border/30 transition-all duration-500"
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: i <= step ? '100%' : '0%' }}
                      transition={{ duration: 0.5, delay: i <= step ? i * 0.1 : 0 }}
                    />
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[260px] flex flex-col">
                <AnimatePresence mode="wait">
                  {/* Step 0: Name */}
                  {step === 0 && (
                    <motion.div
                      key="step-name"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-atmos-cyan/10 border border-atmos-cyan/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-atmos-cyan" />
                        </div>
                        <div>
                          <h2 className="text-lg font-display font-semibold text-white">Create New Profile</h2>
                          <p className="text-xs text-atmos-text-muted">Enter details for fresh profile</p>
                        </div>
                      </div>

                      <label className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-3 block font-medium">
                        What's your name?
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                        placeholder="Enter full name"
                        className="input-dark text-lg mb-4"
                        autoFocus
                        id="onboarding-name-input"
                      />
                      <p className="text-xs text-atmos-text-muted mt-1">
                        We use this to save your personalized profile in the database.
                      </p>
                    </motion.div>
                  )}

                  {/* Step 1: Age Group */}
                  {step === 1 && (
                    <motion.div
                      key="step-age"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-atmos-cyan/10 border border-atmos-cyan/20 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-atmos-cyan" />
                        </div>
                        <div>
                          <h2 className="text-lg font-display font-semibold text-white">Age Group</h2>
                          <p className="text-xs text-atmos-text-muted">Different ages have different vulnerabilities</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {ageOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setAge(opt.value)}
                            className={`group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                              age === opt.value
                                ? 'border-atmos-cyan/50 bg-atmos-cyan/10 shadow-glow-cyan/20'
                                : 'border-atmos-border/30 bg-atmos-surface/30 hover:border-atmos-border/60 hover:bg-atmos-surface/50'
                            }`}
                            id={`onboarding-age-${opt.value}`}
                          >
                            <span className="text-2xl">{opt.icon}</span>
                            <div>
                              <div className={`text-sm font-medium ${age === opt.value ? 'text-atmos-cyan' : 'text-atmos-text'}`}>
                                {opt.label}
                              </div>
                              <div className="text-[10px] text-atmos-text-muted">{opt.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Health Condition */}
                  {step === 2 && (
                    <motion.div
                      key="step-condition"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-display font-semibold text-white">Health Profile</h2>
                          <p className="text-xs text-atmos-text-muted">This helps us calibrate risk levels</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {conditionOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setCondition(opt.value)}
                            className={`group flex flex-col p-3 rounded-xl border transition-all duration-200 text-left ${
                              condition === opt.value
                                ? 'border-atmos-cyan/50 bg-atmos-cyan/10'
                                : 'border-atmos-border/30 bg-atmos-surface/30 hover:border-atmos-border/60 hover:bg-atmos-surface/50'
                            }`}
                            id={`onboarding-condition-${opt.value}`}
                          >
                            <div className={`text-sm font-medium ${condition === opt.value ? 'text-atmos-cyan' : 'text-atmos-text'}`}>
                              {opt.label}
                            </div>
                            <div className="text-[10px] text-atmos-text-muted mt-0.5">{opt.desc}</div>
                          </button>
                        ))}
                      </div>

                      {condition === 'other' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                          <label className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-2 block font-medium">
                            Specify Your Health Condition
                          </label>
                          <input
                            type="text"
                            value={customCondition}
                            onChange={(e) => setCustomCondition(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                            placeholder="e.g. Bronchitis, Sinusitis..."
                            className="input-dark text-sm w-full"
                            autoFocus
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Occupation */}
                  {step === 3 && (
                    <motion.div
                      key="step-occupation"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-atmos-blue/10 border border-atmos-blue/20 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-atmos-blue" />
                        </div>
                        <div>
                          <h2 className="text-lg font-display font-semibold text-white">Occupation</h2>
                          <p className="text-xs text-atmos-text-muted">Your outdoor exposure impacts risk levels</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {occupationOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setOccupation(opt.value)}
                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                              occupation === opt.value
                                ? 'border-atmos-cyan/50 bg-atmos-cyan/10'
                                : 'border-atmos-border/30 bg-atmos-surface/30 hover:border-atmos-border/60 hover:bg-atmos-surface/50'
                            }`}
                            id={`onboarding-occupation-${opt.value}`}
                          >
                            <span className="text-xl">{opt.icon}</span>
                            <div className={`text-sm font-medium ${occupation === opt.value ? 'text-atmos-cyan' : 'text-atmos-text'}`}>
                              {opt.label}
                            </div>
                          </button>
                        ))}
                      </div>

                      {occupation === 'other' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                          <label className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-2 block font-medium">
                            Specify Your Occupation
                          </label>
                          <input
                            type="text"
                            value={customOccupation}
                            onChange={(e) => setCustomOccupation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                            placeholder="e.g. Construction worker, Pilot..."
                            className="input-dark text-sm w-full"
                            autoFocus
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-atmos-border/20">
                <button
                  onClick={() => {
                    if (step === 0) setMode('select');
                    else prevStep();
                  }}
                  className="text-xs text-atmos-text-muted hover:text-atmos-text transition-colors px-3 py-2 rounded-lg hover:bg-atmos-surface/50"
                  id="onboarding-back-btn"
                >
                  ← {step === 0 ? 'Back Options' : 'Back'}
                </button>

                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`group flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs transition-all duration-300 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-glow-cyan hover:shadow-glow-cyan/50 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-atmos-surface/50 text-atmos-text-muted border border-atmos-border/30'
                  }`}
                  id="onboarding-next-btn"
                >
                  {step === totalSteps - 1 ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Account
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center text-[10px] uppercase tracking-[0.2em] text-atmos-text-muted mt-4"
        >
          Secured with Python SQL & Local Storage
        </motion.p>
      </div>
    </motion.div>
  );
}
