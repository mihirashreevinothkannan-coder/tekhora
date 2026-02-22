import React, { useState, useEffect } from 'react';
import ParticlesBackground from './components/ui/ParticlesBackground';
import HeroScreen from './components/HeroScreen';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import FoodEntry from './components/FoodEntry';
import Analytics from './components/Analytics';
import RecoveryCard from './components/RecoveryCard';
import AiInsights from './components/AiInsights';
import Settings from './components/Settings';
import { LayoutDashboard, Utensils, BarChart3, Settings as SettingsIcon, BrainCircuit } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useData } from './hooks/useData';

export default function App() {
    const { user, dashboardData, loading, createUser, addMeal, applyRecovery, resetAll } = useData();

    // If user exists, default to dashboard. Else, hero.
    const [currentScreen, setCurrentScreen] = useState('hero');

    useEffect(() => {
        if (!loading) {
            if (user && ['hero', 'setup'].includes(currentScreen)) {
                setCurrentScreen('dashboard');
            } else if (!user && !['hero', 'setup'].includes(currentScreen)) {
                setCurrentScreen('hero');
            }
        }
    }, [user, loading]);

    const navigate = (screen) => setCurrentScreen(screen);

    if (loading) return null; // Avoid flicker

    return (
        <div className="min-h-[100dvh] w-full text-white overflow-hidden bg-background font-sans relative pb-20 md:pb-0">
            <ParticlesBackground />

            <main className="relative z-10 w-full max-w-full px-0 mx-auto min-h-[100dvh] flex flex-col">
                <AnimatePresence mode="wait">
                    {currentScreen === 'hero' && <HeroScreen key="hero" onNext={() => navigate('setup')} />}

                    {currentScreen === 'setup' && (
                        <ProfileSetup key="setup" onComplete={(profile) => {
                            createUser(profile);
                            navigate('dashboard');
                        }} />
                    )}

                    {currentScreen === 'dashboard' && dashboardData && (
                        <Dashboard
                            key="dashboard"
                            data={dashboardData}
                            onLogFood={() => navigate('entry')}
                        />
                    )}

                    {currentScreen === 'entry' && (
                        <FoodEntry
                            key="entry"
                            onAdd={(meal) => {
                                addMeal(meal);
                                navigate('dashboard');
                            }}
                            onBack={() => navigate('dashboard')}
                        />
                    )}

                    {currentScreen === 'analytics' && <Analytics key="analytics" />}

                    {currentScreen === 'insights' && <AiInsights key="insights" onBack={() => navigate('dashboard')} />}

                    {currentScreen === 'settings' && (
                        <Settings
                            key="settings"
                            user={user}
                            onReset={() => {
                                resetAll();
                                navigate('hero');
                            }}
                        />
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Navigation for Core Application screens */}
            {!['hero', 'setup'].includes(currentScreen) && (
                <nav className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-6 glass border-t border-white/10">
                    <div className="max-w-full px-0 mx-auto flex justify-around items-end">

                        <button onClick={() => navigate('insights')} className={`p-2 flex flex-col items-center gap-1 rounded-2xl transition-all ${currentScreen === 'insights' ? 'text-primary-400' : 'text-gray-400'}`}>
                            <BrainCircuit size={22} className={currentScreen === 'insights' ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" : ""} />
                            <span className="text-[10px] font-bold uppercase">Coach</span>
                        </button>
                        <button onClick={() => navigate('dashboard')} className={`p-2 flex flex-col items-center gap-1 rounded-2xl transition-all ${currentScreen === 'dashboard' ? 'text-primary-400' : 'text-gray-400'}`}>
                            <LayoutDashboard size={22} className={currentScreen === 'dashboard' ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" : ""} />
                            <span className="text-[10px] font-bold uppercase">Home</span>
                        </button>

                        {/* Center Floating Button */}
                        <button onClick={() => navigate('entry')} className="p-4 bg-primary-500 rounded-full text-white shadow-lg glow-ring-green mb-2 btn-pop border-b-4 border-primary-600 active:border-b-0 active:translate-y-1">
                            <Utensils size={28} />
                        </button>

                        <button onClick={() => navigate('analytics')} className={`p-2 flex flex-col items-center gap-1 rounded-2xl transition-all ${currentScreen === 'analytics' ? 'text-primary-400' : 'text-gray-400'}`}>
                            <BarChart3 size={22} className={currentScreen === 'analytics' ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" : ""} />
                            <span className="text-[10px] font-bold uppercase">Stats</span>
                        </button>
                        <button onClick={() => navigate('settings')} className={`p-2 flex flex-col items-center gap-1 rounded-2xl transition-all ${currentScreen === 'settings' ? 'text-primary-400' : 'text-gray-400'}`}>
                            <SettingsIcon size={22} className={currentScreen === 'settings' ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" : ""} />
                            <span className="text-[10px] font-bold uppercase">Settings</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}
