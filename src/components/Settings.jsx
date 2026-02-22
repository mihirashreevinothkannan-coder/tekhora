import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, Trash2, UserCircle } from 'lucide-react';

export default function Settings({ user, onReset }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="px-0 pt-12 min-h-screen relative"
        >
            <div className="flex items-center gap-3 mb-10">
                <SettingsIcon size={28} className="text-gray-400" />
                <h2 className="text-2xl font-display font-bold">Settings</h2>
            </div>

            <div className="space-y-6">
                <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 border border-primary-500/30 glow-ring-green">
                        <UserCircle size={40} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl">{user?.gender || 'User'} Profile</h3>
                        <p className="text-sm text-gray-400">Level {user?.level} • {user?.xp} XP</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 mb-2">Targets configuration</h4>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex justify-between items-center text-sm font-semibold text-gray-300">
                        <span>Daily Calories</span>
                        <span className="text-white bg-white/10 px-3 py-1 rounded-xl">{user?.calorieTarget} kcal</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex justify-between items-center text-sm font-semibold text-gray-300">
                        <span>Protein Goal</span>
                        <span className="text-white bg-white/10 px-3 py-1 rounded-xl">{user?.proteinTarget}g</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex justify-between items-center text-sm font-semibold text-gray-300">
                        <span>Sugar Threshold</span>
                        <span className="text-white bg-white/10 px-3 py-1 rounded-xl">{user?.sugarThreshold}g</span>
                    </div>
                </div>

                <div className="pt-8 space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 mb-2">System</h4>
                    <button
                        onClick={onReset}
                        className="w-full flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl font-bold border border-red-500/20 active:scale-95 transition-all"
                    >
                        <Trash2 size={20} /> Reset Demo Data
                    </button>
                    <button disabled className="w-full flex items-center gap-3 p-4 bg-white/5 text-gray-400 rounded-2xl font-bold border border-white/10 grayscale opacity-50 cursor-not-allowed">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
