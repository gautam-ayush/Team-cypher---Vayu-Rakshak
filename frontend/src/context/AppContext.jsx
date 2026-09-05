import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';
import { useAQI } from '../hooks/useAQI';
import { fetchAdvisory } from '../services/advisoryApi';
import { defaultProfile, defaultLocation } from '../data/mockData';
import { getCurrentUser, saveUser, getAllUsers, loginUser as loginUserService, logoutUser as logoutUserService } from '../services/userService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // App phase: onboarding -> loading -> earth -> dashboard
  // Always start on 'onboarding' so fresh site opens ask to log in or create account
  const [phase, setPhase] = useState('onboarding');

  // Location
  const { location, status: geoStatus, error: geoError, setManualLocation } = useGeolocation();

  // Profile (loads current user if exists)
  const [profile, setProfile] = useState(() => {
    const savedUser = getCurrentUser();
    return savedUser || { ...defaultProfile, name: '' };
  });

  // Environmental data
  const activeLocation = location || defaultLocation;
  const { weather, trend, loading: weatherLoading } = useWeather(activeLocation.lat, activeLocation.lng);
  const { aqi, loading: aqiLoading } = useAQI(activeLocation.lat, activeLocation.lng);

  // Advisory
  const [advisory, setAdvisory] = useState(null);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Generate advisory when data or profile changes
  useEffect(() => {
    if (!weather || !aqi) return;

    setAdvisoryLoading(true);
    fetchAdvisory({ weather, aqi }, profile)
      .then(setAdvisory)
      .finally(() => setAdvisoryLoading(false));
  }, [weather, aqi, profile]);

  // Update & persist profile
  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveUser(updated);
      return updated;
    });
  }, []);

  // Set demo profile
  const setDemoProfile = useCallback((demoProfile) => {
    setProfile(prev => {
      const updated = {
        ...prev,
        age: demoProfile.age,
        condition: demoProfile.condition,
        occupation: demoProfile.occupation,
      };
      saveUser(updated);
      return updated;
    });
  }, []);

  // Login existing user
  const loginExistingUser = useCallback((name) => {
    const user = loginUserService(name);
    if (user) {
      setProfile(user);
      setPhase('loading');
      return true;
    }
    return false;
  }, []);

  // Create fresh user account
  const createFreshUser = useCallback(() => {
    logoutUserService();
    setProfile({ ...defaultProfile, name: '' });
    setPhase('onboarding');
  }, []);

  // Logout
  const logout = useCallback(() => {
    logoutUserService();
    setProfile({ ...defaultProfile, name: '' });
    setPhase('onboarding');
  }, []);

  const value = {
    phase, setPhase,
    location: activeLocation,
    geoStatus, geoError,
    setManualLocation,
    profile, updateProfile, setDemoProfile,
    loginExistingUser, createFreshUser, logout, getAllUsers,
    weather, trend, weatherLoading,
    aqi, aqiLoading,
    advisory, advisoryLoading,
    activeTab, setActiveTab,
    dataReady: !!weather && !!aqi,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
