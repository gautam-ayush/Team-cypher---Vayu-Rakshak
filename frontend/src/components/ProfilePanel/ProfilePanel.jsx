import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Shield } from 'lucide-react';

const ageOptions = [
  { value: 'child', label: 'Child', icon: '👶' },
  { value: 'teen', label: 'Teen', icon: '🧑' },
  { value: 'adult', label: 'Adult', icon: '🧑‍💼' },
  { value: 'senior', label: 'Senior', icon: '🧓' },
];

const conditionOptions = [
  { value: 'none', label: 'None' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'copd', label: 'COPD' },
  { value: 'heart', label: 'Heart' },
  { value: 'allergies', label: 'Allergies' },
  { value: 'other', label: 'Other' },
];

const occupationOptions = [
  { value: 'student', label: 'Student' },
  { value: 'office', label: 'Office' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'other', label: 'Other' },
];

/**
 * User profile panel with pill selectors.
 */
export default function ProfilePanel() {
  const { profile, updateProfile } = useApp();

  const getSensitivityTags = () => {
    const tags = [];
    if (profile.condition !== 'none') {
      tags.push(conditionOptions.find(c => c.value === profile.condition)?.label);
    }
    if (['outdoor', 'traffic', 'delivery'].includes(profile.occupation)) {
      tags.push('Outdoor Exposure');
    }
    if (profile.age === 'senior') tags.push('Age Vulnerability');
    if (profile.age === 'child') tags.push('Developing Lungs');
    return tags;
  };

  const sensitivityTags = getSensitivityTags();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Shield className="w-4 h-4 text-atmos-cyan" />
        <div className="section-title mb-0">Your Profile</div>
      </div>

      {/* Age Group */}
      <div className="mb-5">
        <label className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-2 block">
          Age Group
        </label>
        <div className="flex flex-wrap gap-2">
          {ageOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateProfile({ age: opt.value })}
              className={`chip ${profile.age === opt.value ? 'chip-active' : 'chip-default hover:border-white/20'}`}
              aria-pressed={profile.age === opt.value}
            >
              <span className="mr-1">{opt.icon}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Health Condition */}
      <div className="mb-5">
        <label className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-2 block">
          Health Condition
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {conditionOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateProfile({ condition: opt.value })}
              className={`chip ${
                profile.condition === opt.value || (!conditionOptions.some(c => c.value === profile.condition) && opt.value === 'other') 
                  ? 'chip-active' 
                  : 'chip-default hover:border-white/20'
              }`}
              aria-pressed={profile.condition === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {(profile.condition === 'other' || !conditionOptions.some(c => c.value === profile.condition)) && (
          <input
            type="text"
            value={profile.customCondition || (profile.condition !== 'other' ? profile.condition : '')}
            onChange={(e) => updateProfile({ customCondition: e.target.value, condition: e.target.value || 'other' })}
            placeholder="Specify custom condition..."
            className="input-dark text-xs w-full py-2 px-3 mt-2"
          />
        )}
      </div>

      {/* Occupation */}
      <div className="mb-5">
        <label className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-2 block">
          Occupation
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {occupationOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateProfile({ occupation: opt.value })}
              className={`chip ${
                profile.occupation === opt.value || (!occupationOptions.some(o => o.value === profile.occupation) && opt.value === 'other') 
                  ? 'chip-active' 
                  : 'chip-default hover:border-white/20'
              }`}
              aria-pressed={profile.occupation === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {(profile.occupation === 'other' || !occupationOptions.some(o => o.value === profile.occupation)) && (
          <input
            type="text"
            value={profile.customOccupation || (profile.occupation !== 'other' ? profile.occupation : '')}
            onChange={(e) => updateProfile({ customOccupation: e.target.value, occupation: e.target.value || 'other' })}
            placeholder="Specify custom occupation..."
            className="input-dark text-xs w-full py-2 px-3 mt-2"
          />
        )}
      </div>

      {/* Sensitivity Tags */}
      {sensitivityTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-atmos-border/30">
          <div className="text-[11px] uppercase tracking-wider text-atmos-text-muted mb-3">
            Your Environmental Sensitivity
          </div>
          <div className="flex flex-wrap gap-2">
            {sensitivityTags.map((tag, i) => (
              <span
                key={tag}
                className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20"
              >
                {i > 0 && <span className="text-orange-500/50">+</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
