import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Activity, ShieldAlert, Zap } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowRing } from '../components/ui/GlowRing';
import AiChat from '../components/AiChat';
import DietPlanGenerator from '../components/DietPlanGenerator';
import CommunityCard from '../components/CommunityCard';
import { useDashboard } from '../hooks/useDashboard';
import { useRecovery } from '../hooks/useRecovery';
import { getLevelFromXP, calculateProgress, calculateNextLevelProgress } from '../utils/calculations';
import { NUTRITION_GOALS, LEVELS } from '../utils/constants';

export default function Dashboard() {
  const { 
    user, xp, streak, totals, coachMessage, currentScore, scoreStatus, progressMetrics, isRecoveryMode
  } = useDashboard();
  
  const { isRecovering, handleRecovery } = useRecovery();
  
  const level = getLevelFromXP(xp, LEVELS);
  const nextLevelProgress = calculateNextLevelProgress(xp, level, LEVELS);

  // Sugar color logic
  const sugarColor = progressMetrics.sugarRatio <= 1 ? '#4ade80' : (progressMetrics.sugarRatio <= 1.5 ? '#fb923c' : '#ef4444');

  const extraCalories = Math.max(0, totals.calories - NUTRITION_GOALS.baselineCalories);
  const walkingMinutes = extraCalories > 0 ? Math.ceil(extraCalories / 7) : 20;

  const aiStats = {
      calories: { current: totals.calories, target: NUTRITION_GOALS.baselineCalories },
      protein: { current: totals.protein, target: NUTRITION_GOALS.proteinTarget },
      sugar: { current: totals.sugar, target: NUTRITION_GOALS.maxSugarGrams },
  };

  return (
    <div className="pb-20 fade-in lg:grid lg:grid-cols-12 lg:gap-10 lg:min-h-full lg:items-start space-y-8 lg:space-y-0">
      {/* --- LEFT COLUMN (Stats) --- */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6">

      {/* Level & XP */}
      <GlassCard className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-current w-5 h-5" />
            <span className="font-bold text-yellow-100">{level.title}</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Lvl {level.level}</span>
          </div>
          <span className="text-sm font-mono text-green-300">{xp} XP</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5 relative">
           <motion.div 
              className="h-full bg-gradient-to-r from-green-600 to-green-400 relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${nextLevelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
           >
             <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-[shimmer_2s_infinite]" />
           </motion.div>
        </div>
      </GlassCard>

      {/* Main Rings */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calories Ring */}
        <GlassCard className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white/5 to-white/0">
          <GlowRing percentage={progressMetrics.calorieProgress} color="#4ade80" size={140} strokeWidth={12}>
            <div className="text-center">
              <span className="block text-2xl font-black text-glow tracking-tighter">{Math.round(totals.calories)}</span>
              <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">kcal</span>
            </div>
          </GlowRing>
        </GlassCard>
        
        {/* Macros */}
        <div className="flex flex-col gap-4">
           {/* Protein */}
           <GlassCard className="flex-1 flex flex-col justify-center items-center p-4">
             <div className="flex justify-between w-full mb-2 px-1 text-sm font-semibold">
               <span className="text-slate-300">Protein</span>
               <span className="text-blue-400">{Math.round(totals.protein)}g</span>
             </div>
             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-blue-500 box-glow"
                 initial={{ width: 0 }}
                 animate={{ width: `${progressMetrics.proteinProgress}%` }}
               />
             </div>
           </GlassCard>
           
           {/* Sugar */}
           <GlassCard className="flex-1 flex flex-col justify-center items-center p-4">
             <div className="flex justify-between w-full mb-2 px-1 text-sm font-semibold">
               <span className="text-slate-300">Sugar</span>
               <span style={{ color: sugarColor }}>{Math.round(totals.sugar)}g</span>
             </div>
             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full"
                 style={{ backgroundColor: sugarColor }}
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(progressMetrics.sugarRatio * 100, 100)}%` }}
               />
             </div>
           </GlassCard>
        </div>
      </div>
      
      {/* Community / Friends Card */}
      <CommunityCard />
      
      </div>

      {/* --- RIGHT COLUMN (AI Tools & Action) --- */}
      <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6 h-full">
      {/* Diet Plan Generator */}
      <DietPlanGenerator userStats={aiStats} userGoal={user?.goal} />

      {/* AI Coach */}
      <GlassCard className="relative overflow-hidden border-2 border-indigo-500/30">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24 text-indigo-400" />
        </div>
        <div className="flex gap-4 relative z-10">
           <div className="bg-indigo-500/20 p-3 rounded-full h-fit flex-shrink-0">
             <Zap className="w-6 h-6 text-indigo-300" />
           </div>
           <div>
             <h3 className="font-bold text-indigo-300 text-sm tracking-widest uppercase mb-1">AI Coach</h3>
             <p className="text-slate-200 font-medium leading-relaxed">
               "{coachMessage}"
             </p>
           </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
           <span className="text-slate-400">Daily Score</span>
           <span className={`font-bold ${currentScore >= 80 ? 'text-green-400' : 'text-orange-400'}`}>
             {Math.round(currentScore)} / 100
           </span>
        </div>

        {/* AI Chat Bot Interface */}
        <div className="w-full mt-4 pt-4 border-t border-indigo-500/20">
             <AiChat userStats={aiStats} />
        </div>
      </GlassCard>

      {/* Recovery Prompt */}
      {scoreStatus === 'Slipped' && !isRecoveryMode && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-red-950/40 border border-red-500/50 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
         >
           <div className="flex items-center gap-3">
             <ShieldAlert className="text-red-400 w-8 h-8" />
             <div>
               <h4 className="font-bold text-red-200">Discipline Slipped</h4>
               <p className="text-xs text-red-300/80">Activate recovery protocol to save 40% of your streak.</p>
             </div>
           </div>

           {extraCalories > 0 && (
             <div className="text-xs text-center text-red-300/90 py-1 bg-red-900/40 rounded-lg">
                Caloric Override Detected: +{Math.round(extraCalories)} kcal
             </div>
           )}

           <div className="grid grid-cols-1 gap-2 mt-2">
             <button 
               onClick={handleRecovery}
               disabled={isRecovering}
               className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/40 border border-red-400 rounded-xl font-bold text-red-100 transition-colors flex justify-center items-center text-sm"
             >
               {isRecovering ? 'Recovering...' : `Power Walk: ${walkingMinutes}m`}
             </button>
             <button 
               onClick={handleRecovery}
               disabled={isRecovering}
               className="w-full py-2.5 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-400 rounded-xl font-bold text-orange-200 transition-colors flex justify-center items-center text-sm"
             >
               {isRecovering ? 'Recovering...' : `Jogging: ${Math.ceil(walkingMinutes * 0.7)}m`}
             </button>
             <button 
               onClick={handleRecovery}
               disabled={isRecovering}
               className="w-full py-2.5 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-400 rounded-xl font-bold text-yellow-200 transition-colors flex justify-center items-center text-sm"
             >
               {isRecovering ? 'Recovering...' : `HIIT: ${Math.ceil(walkingMinutes * 0.5)}m`}
             </button>
           </div>
         </motion.div>
      )}
      </div>
    </div>
  );
}
