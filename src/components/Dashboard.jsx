import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Crown, ShieldAlert } from 'lucide-react';
import ProgressRing from './ui/ProgressRing';
import FlameStreak from './ui/FlameStreak';
import RecoveryCard from './RecoveryCard';
import { useData } from '../hooks/useData';

export default function Dashboard({ data, onLogFood }) {
    const [showXpAnim, setShowXpAnim] = useState(false);
    const { user, log, streak, pendingRecovery, recentMeals } = data;
    const { applyRecovery } = useData();

    const stats = {
        calories: { current: log.totalCalories, target: user.calorieTarget },
        protein: { current: log.totalProtein, target: user.proteinTarget },
        sugar: { current: log.totalSugar, target: user.sugarThreshold },
        streak: streak.calorieStreak
    };

    const calProgress = Math.min((stats.calories.current / stats.calories.target) * 100, 100);
    const proProgress = Math.min((stats.protein.current / stats.protein.target) * 100, 100);
    const sugProgress = Math.min((stats.sugar.current / stats.sugar.target) * 100, 100);

    const isOverSugar = stats.sugar.current > stats.sugar.target;
    const isOverCals = stats.calories.current > stats.calories.target;

    const sugarColor = isOverSugar ? 'text-red-500' : (sugProgress > 80 ? 'text-accent-500' : 'text-primary-500');
    const sugarGlow = isOverSugar ? 'glow-ring-red' : (sugProgress > 80 ? 'glow-ring-orange' : 'glow-ring-green');

    // Trigger XP effect when DB updates XP dynamically (For demo, assume random trigger logic)
    useEffect(() => {
        if (recentMeals.length > 0) {
            setShowXpAnim(true);
            const t = setTimeout(() => setShowXpAnim(false), 3000);
            return () => clearTimeout(t);
        }
    }, [recentMeals.length]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 pt-8 pb-32 min-h-full space-y-6"
        >
            {/* Top Bar */}
            <div className="flex justify-between items-center bg-card/60 rounded-3xl p-3 border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-500/20 p-2 rounded-xl text-primary-400 font-bold border border-primary-500/30 flex items-center gap-1.5 relative overflow-hidden group btn-pop">
                        <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-300"></div>
                        <Crown size={18} className="drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                        Lvl {user.level} <span className="text-xs text-gray-400 font-sans tracking-widest uppercase ml-1 block">{user.xp}/100</span>
                    </div>
                </div>
                <FlameStreak streak={stats.streak} />
            </div>

            {/* Hero Stats (Duolingo Style Ring) */}
            <div className="glass-card p-6 flex flex-col items-center">
                <div className="relative">
                    <ProgressRing
                        progress={calProgress}
                        size={180}
                        strokeWidth={16}
                        color={isOverCals ? "text-red-500" : "text-primary-500"}
                        glowClass={isOverCals ? "glow-ring-red" : "glow-ring-green"}
                    >
                        <div className="text-center font-display">
                            <div className={`text-4xl font-bold ${isOverCals ? 'text-red-500' : ''}`}>{stats.calories.current}</div>
                            <div className="text-gray-400 text-sm font-semibold uppercase tracking-widest mt-1">/ {stats.calories.target} kcal</div>
                        </div>
                    </ProgressRing>

                    {/* Floating XP Animation */}
                    <AnimatePresence>
                        {showXpAnim && (
                            <motion.div
                                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                animate={{ opacity: 1, y: -40, scale: 1 }}
                                exit={{ opacity: 0, y: -60 }}
                                transition={{ duration: 1.5, type: "spring" }}
                                className="absolute -top-4 -right-8 bg-yellow-500 text-yellow-950 font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(234,179,8,0.6)] z-20 pointer-events-none"
                            >
                                +20 XP <Zap size={14} className="fill-yellow-950" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mini Rings */}
                <div className="flex w-full justify-around mt-8">
                    <div className="flex flex-col items-center gap-2">
                        <ProgressRing progress={proProgress} size={70} strokeWidth={8} color="text-blue-500" glowClass="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                            <span className="font-bold text-sm">{stats.protein.current}g</span>
                        </ProgressRing>
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Protein <span className="opacity-50">/{stats.protein.target}</span></span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <ProgressRing progress={sugProgress} size={70} strokeWidth={8} color={sugarColor} glowClass={sugarGlow}>
                            <span className={`font-bold text-sm ${sugarColor}`}>{stats.sugar.current}g</span>
                        </ProgressRing>
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Sugar <span className="opacity-50">/{stats.sugar.target}</span></span>
                    </div>
                </div>
            </div>

            {/* Conditional Recovery */}
            <AnimatePresence>
                {pendingRecovery && (
                    <RecoveryCard session={pendingRecovery} onComplete={() => applyRecovery(pendingRecovery.id)} />
                )}
            </AnimatePresence>

            {/* AI Coach Mini Card */}
            {!pendingRecovery && (
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                        <Zap size={64} />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-2 flex items-center gap-2">
                        <span className="bg-primary-500/20 text-primary-400 p-1 rounded-md text-xs">AI</span> Coach Readout
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {isOverCals ? "You overshot your calories. Check the recovery card to restore your score!" :
                            isOverSugar ? "Watch the sugar intake today! Try opting for some complex carbs next meal." :
                                log.totalProtein < user.proteinTarget * 0.5 ? "Protein is looking a bit low. Time to drop in some Dal or paneer." :
                                    "You are doing incredible today. Keep the discipline high! 🚀"}
                    </p>
                </div>
            )}

        </motion.div>
    );
}
