import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
      {/* Animated particle background (simplified radial overlay with float) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-screen" />
      
      <motion.div 
        className="z-10 animate-float"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="h-24 w-24 bg-gradient-to-tr from-green-500 to-green-300 rounded-full flex items-center justify-center shadow-[0_0_30px_#4ade80] mb-8 relative">
          <Flame className="w-12 h-12 text-slate-900" />
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-green-400 opacity-50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <GlassCard className="w-full max-w-sm z-10" delay={0.2}>
        <motion.h1 
          className="text-4xl font-extrabold mb-4 text-glow tracking-tight text-white leading-tight"
        >
          Build Discipline Through Nutrition Intelligence
        </motion.h1>
        <motion.p 
          className="text-slate-300 mb-8 font-medium text-lg leading-relaxed"
        >
          Gamified AI tracking for Indian meals.
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/setup')}
          className="w-full py-4 text-slate-900 bg-green-400 font-bold rounded-xl text-lg hover:bg-green-300 transition-colors shadow-[0_0_15px_#4ade80] relative overflow-hidden group"
        >
          <span className="relative z-10">Start Your Journey</span>
          <div className="absolute inset-0 bg-white/30 transform -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
        </motion.button>
      </GlassCard>
    </div>
  );
}
