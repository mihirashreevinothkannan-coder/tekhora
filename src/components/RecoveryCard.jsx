import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, Activity, Bike } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecoveryCard({ session, onComplete }) {
    const [complete, setComplete] = useState(false);

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#4ade80', '#eab308']
        });
    };

    const handleDone = () => {
        setComplete(true);
        triggerConfetti();
        setTimeout(() => {
            onComplete();
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 15 }}
            className="glass-card border-none bg-gradient-to-br from-red-950/80 to-accent-950/80 p-6 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert size={120} />
            </div>

            <AnimatePresence mode="wait">
                {!complete ? (
                    <motion.div key="options" exit={{ opacity: 0, x: -50 }} className="relative z-10">
                        <h3 className="text-xl font-display font-bold text-red-400 flex items-center gap-2 mb-2">
                            <ShieldAlert size={20} /> Recovery Run Needed
                        </h3>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed font-semibold">
                            You exceeded your target by <span className="text-red-400">{session.extraCalories} kcal</span>.
                            Complete an activity below to restore {session.compensationPercent}% of your penalty.
                        </p>

                        <div className="space-y-3">
                            {[
                                { icon: Activity, title: `${Math.round(session.requiredMinutes * 0.7)} min HIIT`, desc: `Burn ${session.extraCalories} kcal` },
                                { icon: CheckCircle, title: `Walk ${session.requiredMinutes} mins`, desc: `Burn ${session.extraCalories} kcal` },
                            ].map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={handleDone}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95"
                                >
                                    <div className="flex items-center gap-3">
                                        <opt.icon size={20} className="text-primary-400" />
                                        <div className="text-left">
                                            <div className="font-bold text-sm tracking-wide">{opt.title}</div>
                                            <div className="text-xs text-gray-400">{opt.desc}</div>
                                        </div>
                                    </div>
                                    <div className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">+15 XP</div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-8 relative z-10"
                    >
                        <CheckCircle size={64} className="text-primary-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                        <h3 className="text-2xl font-display font-bold">Penalty Recovered!</h3>
                        <p className="text-primary-400 font-semibold mt-2 text-sm uppercase tracking-widest">+15 Discipline XP</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
