import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Target, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { useData } from '../hooks/useData';

export default function AiInsights({ onBack }) {
    const { user, dashboardData } = useData();
    const log = dashboardData?.log || {};

    const isOverSugar = log.totalSugar > user?.sugarThreshold;
    const isOverCals = log.totalCalories > user?.calorieTarget;
    const isProteinLow = log.totalProtein < user?.proteinTarget * 0.8;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="px-0 pt-12 pb-32 min-h-screen relative"
        >
            <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center border border-primary-500/30 glow-ring-green">
                    <BrainCircuit size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold">Coach AI</h2>
                    <p className="text-xs text-primary-400 font-semibold uppercase tracking-widest">Behavioral Insights</p>
                </div>
            </div>

            <div className="space-y-4">

                <div className="glass-card border border-primary-500/30 p-5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <Sparkles size={100} className="text-primary-500" />
                    </div>
                    <h3 className="font-bold font-display text-lg flex items-center gap-2 mb-3">
                        <Target size={18} className="text-primary-400" /> Weekly Summary
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        You are building fantastic momentum, hitting level {user?.level} this week! Your discipline score is highly resilient, but watch for evening spikes.
                    </p>
                </div>

                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mt-8 mb-4">Actionable Feedback</h3>

                {isOverSugar && (
                    <InsightCard
                        icon={AlertCircle}
                        color="text-red-400"
                        bg="bg-red-500/10"
                        borderColor="border-red-500/20"
                        title="Sugar Spikes detected"
                        desc="Your Indian sweets intake pushed you out of the zone today. Try replacing Gulab Jamun with fresh fruits tomorrow to protect your streak."
                    />
                )}

                {isOverCals && (
                    <InsightCard
                        icon={Zap}
                        color="text-accent-400"
                        bg="bg-accent-500/10"
                        borderColor="border-accent-500/20"
                        title="Calorie Overflow"
                        desc="Heavy meals detected. You have a chance to recover these points. Complete a brisk 20 minute walk to re-balance your metabolism tonight."
                    />
                )}

                {isProteinLow && (
                    <InsightCard
                        icon={TrendingUp}
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                        borderColor="border-blue-500/20"
                        title="Protein Deficit"
                        desc="To meet your muscle goals, add more Dal, paneer, or a scoop of whey. You're currently missing your daily target by a significant margin."
                    />
                )}

                {(!isOverSugar && !isOverCals && !isProteinLow) && (
                    <InsightCard
                        icon={Sparkles}
                        color="text-primary-400"
                        bg="bg-primary-500/10"
                        borderColor="border-primary-500/20"
                        title="Perfect Day"
                        desc="Incredible discipline! Macros are balanced, calories are strictly under the line. You are mastering your nutrition habits."
                    />
                )}
            </div>
        </motion.div>
    );
}

function InsightCard({ icon: Icon, title, desc, color, bg, borderColor }) {
    return (
        <div className={`p-5 rounded-3xl border ${borderColor} ${bg} flex gap-4 backdrop-blur-md`}>
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${color} bg-white/5 border border-white/10`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className={`font-bold text-md mb-1 ${color}`}>{title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
