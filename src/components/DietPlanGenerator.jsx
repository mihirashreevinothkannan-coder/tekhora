import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Loader2, Sparkles, ChevronDown, ChevronUp, ChefHat } from 'lucide-react';
import { aiService } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import { GlassCard } from './ui/GlassCard';

export default function DietPlanGenerator({ userStats, userGoal }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dietPlan, setDietPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsOpen(true);
        setIsLoading(true);
        // Clear old plan on new generation
        setDietPlan('');
        const plan = await aiService.generateDietPlan(userStats, userGoal);
        setDietPlan(plan);
        setIsLoading(false);
    };

    return (
        <GlassCard className="w-full relative overflow-hidden border-2 border-primary-500/30">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ChefHat className="w-24 h-24 text-primary-400" />
            </div>
            
            <div className="flex gap-4 relative z-10 px-6 pt-6">
                <div className="bg-primary-500/20 p-3 rounded-full h-fit flex-shrink-0">
                    <Utensils className="w-6 h-6 text-primary-300" />
                </div>
                <div>
                    <h3 className="font-bold text-primary-300 text-sm tracking-widest uppercase mb-1">AI Dietitian</h3>
                    <p className="text-slate-200 font-medium leading-relaxed">
                        Need a personalized meal plan to hit your remaining macros for today?
                    </p>
                </div>
            </div>

            <div className="px-6 pb-6 relative z-10 w-full mt-4">
                {!isOpen ? (
                    <button 
                        onClick={handleGenerate}
                        className="w-full py-3 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/40 rounded-xl flex items-center justify-center gap-2 text-primary-400 font-bold transition-all btn-pop text-sm"
                    >
                        <Sparkles size={16} />
                        Generate Today's Plan
                    </button>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="w-full bg-primary-950/30 border border-primary-500/20 rounded-2xl overflow-hidden mt-4"
                    >
                        <div 
                            className="flex justify-between items-center bg-primary-900/40 px-4 py-3 border-b border-primary-500/10 cursor-pointer hover:bg-primary-800/40 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="text-xs font-bold text-primary-300 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={14} /> Plan Generated
                            </span>
                            <ChevronUp size={16} className="text-primary-300" />
                        </div>

                        <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-6 text-primary-400 gap-3">
                                    <Loader2 size={24} className="animate-spin" />
                                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Crafting plan...</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:marker:text-primary-500 prose-headings:text-primary-300">
                                    <ReactMarkdown>{dietPlan}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </GlassCard>
    );
}
