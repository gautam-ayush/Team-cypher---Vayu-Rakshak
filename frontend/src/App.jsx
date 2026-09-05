import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import { useCursor } from './context/CursorContext';

import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import EarthScene from './components/Earth/EarthScene';
import LocationSearch from './components/LocationSearch/LocationSearch';
import CustomCursor from './components/Cursor/CustomCursor';
import Header from './components/Header/Header';
import AQIGauge from './components/AQIGauge/AQIGauge';
import WeatherPanel from './components/WeatherPanel/WeatherPanel';
import ProfilePanel from './components/ProfilePanel/ProfilePanel';
import Advisory from './components/Advisory/Advisory';
import WhyThisAlert from './components/Advisory/WhyThisAlert';
import TrendChart from './components/TrendChart/TrendChart';
import AlertHistory from './components/AlertHistory/AlertHistory';
import LocationMap from './components/LocationMap/LocationMap';
import DemoMode from './components/DemoMode/DemoMode';
import Onboarding from './components/Onboarding/Onboarding';
import Chatbot from './components/Chatbot/Chatbot';

import { mockAlertHistory, mockNearbyStations } from './data/mockData';
import './App.css';

export default function App() {
  const { phase, setPhase, aqi, weather, trend, advisory, geoStatus, location: appLocation } = useApp();
  const { setCursor } = useCursor();
  
  // Track scroll for active tab and small earth visibility
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {/* Onboarding Phase */}
        {phase === 'onboarding' && (
          <Onboarding key="onboarding" />
        )}

        {/* Loading Phase */}
        {phase === 'loading' && (
          <LoadingScreen key="loading" onComplete={() => setPhase('earth')} />
        )}

        {/* Earth / Hero Phase */}
        {phase === 'earth' && (
          <motion.div
            key="earth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-10"
            onMouseEnter={() => setCursor('globe')}
            onMouseLeave={() => setCursor('default')}
          >
            <EarthScene onComplete={() => setPhase('dashboard')} />
            
            {/* Show search if location failed */}
            {(geoStatus === 'denied' || geoStatus === 'error') && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="pointer-events-auto flex flex-col items-center mt-32">
                  <h2 className="text-xl font-display text-white mb-6">Where are you located?</h2>
                  <LocationSearch onLocationSelected={() => setPhase('earth')} />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Dashboard Phase */}
        {phase === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-20 min-h-screen pb-20"
          >
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none -z-10">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-atmos-cyan/5 rounded-full blur-[120px] opacity-50" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-atmos-blue/5 rounded-full blur-[100px] opacity-30" />
            </div>

            <Header />

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
              {/* Overview Section */}
              <section id="section-overview" className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: AQI & Environment */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div id="section-environment">
                       {aqi && (
                        <AQIGauge 
                          aqi={aqi.aqi} 
                          level={aqi.level} 
                          pm25={aqi.pm25} 
                          dominantPollutant={aqi.dominantPollutant} 
                        />
                      )}
                    </div>
                    {weather && <WeatherPanel weather={weather} />}
                  </div>

                  {/* Right Column: Profile & Small Earth */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="hidden lg:block h-64 rounded-2xl overflow-hidden glass border-0"
                         onMouseEnter={() => setCursor('globe')}
                         onMouseLeave={() => setCursor('default')}
                    >
                       <EarthScene isSmall={true} />
                    </div>
                    <ProfilePanel />
                  </div>
                </div>
              </section>

              {/* Advisory Section */}
              <section id="section-advisory" className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    {advisory && <Advisory advisory={advisory} />}
                  </div>
                  <div className="lg:col-span-4">
                    {advisory && <WhyThisAlert factors={advisory.factors} />}
                  </div>
                </div>
              </section>

              {/* Trends & History Section */}
              <section id="section-trends" className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div>
                     {trend && <TrendChart trendData={trend} />}
                   </div>
                   <div id="section-history">
                     <AlertHistory historyData={mockAlertHistory} />
                   </div>
                </div>
              </section>

              {/* Map Section */}
              <section className="mb-12">
                 <LocationMap location={weather ? appLocation : null} nearbyStations={mockNearbyStations} />
              </section>

            </main>

            <DemoMode />
            <Chatbot />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
