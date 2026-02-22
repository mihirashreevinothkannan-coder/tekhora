import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { GlassCard } from '../components/ui/GlassCard';
import { aiService } from '../services/aiService';
import { useUserStore } from '../store/useUserStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { NUTRITION_GOALS } from '../utils/constants';
import { Loader2, Zap, Flame, Target } from 'lucide-react';

export default function WorkoutPlan() {
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useUserStore();
  const { totals } = useNutritionStore();

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsContext = {
        calories: {
            current: totals.calories,
            target: NUTRITION_GOALS.baselineCalories
        },
        protein: {
            current: totals.protein,
            target: NUTRITION_GOALS.proteinTarget
        },
        sugar: {
            current: totals.sugar,
            target: NUTRITION_GOALS.maxSugarGrams
        }
      };
      const plan = await aiService.generateWorkoutPlan(statsContext, user?.goal);
      setWorkoutPlan(plan);
    } catch (err) {
      setError('Failed to generate workout plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const excessCalories = Math.max(0, totals.calories - NUTRITION_GOALS.baselineCalories);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 fade-in w-full">
      <div className="flex items-center justify-between px-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Workout Generator</h1>
          <Zap className="w-8 h-8 text-yellow-400" />
      </div>

      <GlassCard className="p-6 relative overflow-hidden border-2 border-yellow-500/20">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" /> Goal: {user?.goal || 'Warrior (Fitness)'}
                </h3>
                <p className="text-sm text-slate-300">
                    <span className="font-semibold text-white">{totals.calories}</span> kcal consumed / <span className="font-semibold text-white">{NUTRITION_GOALS.baselineCalories}</span> kcal target
                </p>
                {excessCalories > 0 ? (
                    <div className="flex items-start gap-2 text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20 mt-2">
                        <Flame className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-semibold">You have an excess of {Math.round(excessCalories)} kcal today. Generate a workout to ignite the burn!</p>
                    </div>
                ) : (
                    <div className="flex items-start gap-2 text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/20 mt-2">
                        <Zap className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-semibold">You are within your calorie target. Maintain the discipline and build strength!</p>
                    </div>
                )}
            </div>

            <button
                onClick={handleGeneratePlan}
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 border-b-4 border-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                ) : (
                    <><Zap className="w-5 h-5 fill-current" /> Generate Workout</>
                )}
            </button>
        </div>
      </GlassCard>

      {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-200 rounded-xl text-center font-semibold">
              {error}
          </div>
      )}

      {workoutPlan && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassCard className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Your Custom Protocol</h2>
                <div className="prose prose-invert prose-green max-w-none">
                    <ReactMarkdown>{workoutPlan}</ReactMarkdown>
                </div>
            </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
