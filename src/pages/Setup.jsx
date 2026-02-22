import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useUserStore } from '../store/useUserStore';
import { mockApi } from '../api/mockApi';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Setup() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    age: '',
    height: '',
    weight: '',
    goal: 'Maintain',
    activityLevel: 'Moderate'
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      title: "What is your name?",
      isValid: () => formData.name.trim().length > 0,
      content: (
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => updateForm('name', e.target.value)}
          placeholder="Enter your hero name"
          className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-4 text-white text-xl text-center focus:outline-none focus:border-green-400 transition-colors placeholder:text-slate-500"
          autoFocus
        />
      )
    },
    {
      title: "Basic Metrics",
      isValid: () => formData.age && formData.height && formData.weight,
      content: (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {['Male', 'Female', 'Other'].map((g) => (
              <button
                key={g}
                onClick={() => updateForm('gender', g)}
                className={`flex-1 py-2 rounded-lg border transition-all text-sm ${
                  formData.gender === g 
                    ? 'border-green-400 bg-green-400/20 text-green-300 font-bold'
                    : 'border-white/10 bg-black/20 text-slate-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Age</label>
              <input type="number" placeholder="25" value={formData.age} onChange={e => updateForm('age', e.target.value)} className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-3 text-white text-center focus:border-green-400 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Height (cm)</label>
              <input type="number" placeholder="175" value={formData.height} onChange={e => updateForm('height', e.target.value)} className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-3 text-white text-center focus:border-green-400 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Weight (kg)</label>
            <input type="number" placeholder="70" value={formData.weight} onChange={e => updateForm('weight', e.target.value)} className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-3 text-white text-center focus:border-green-400 outline-none" />
          </div>
        </div>
      )
    },
    {
      title: "Activity Level",
      isValid: () => true,
      content: (
        <div className="space-y-3">
          {['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'].map((act) => (
            <button
              key={act}
              onClick={() => updateForm('activityLevel', act)}
              className={`w-full p-3 rounded-xl border transition-all text-sm ${
                formData.activityLevel === act 
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold'
                  : 'border-white/10 bg-black/20 text-slate-300 hover:border-white/30'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Primary Goal",
      isValid: () => true,
      content: (
        <div className="space-y-4">
          {['Cut Fat', 'Maintain', 'Build Muscle'].map((g) => (
            <button
              key={g}
              onClick={() => updateForm('goal', g)}
              className={`w-full p-4 rounded-xl border transition-all ${
                formData.goal === g 
                  ? 'border-green-400 bg-green-400/20 text-green-300 font-bold shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                  : 'border-white/10 bg-black/20 text-slate-300 hover:border-white/30'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      if (!steps[step].isValid()) return;
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const user = await mockApi.createUser(formData);
        setUser(user);
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-white relative">
      <GlassCard className="w-full max-w-sm relative z-10 min-h-[400px] flex flex-col">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-green-400 shadow-[0_0_8px_#4ade80]' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-8">{steps[step].title}</h2>
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          disabled={!steps[step].isValid() || isLoading}
          className="mt-8 w-full py-4 bg-green-400 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : (
            <>
              {step === steps.length - 1 ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </GlassCard>
    </div>
  );
}
