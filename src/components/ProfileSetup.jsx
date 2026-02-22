import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Target, Activity } from 'lucide-react';

const steps = [
    { id: 'goal', title: 'What is your main goal?', options: ['Lose Weight', 'Build Muscle', 'Maintain Health'] },
    { id: 'activity', title: 'How active are you?', options: ['Sedentary', 'Lightly Active', 'Very Active'] },
    { id: 'details', title: 'A few details' },
];

export default function ProfileSetup({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({ goal: '', activity: '', age: '', weight: '', height: '' });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            onComplete(formData);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(s => s - 1);
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="min-h-[100dvh] flex flex-col px-0 pt-12 pb-6 relative"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={handlePrev} className={`p-2 glass rounded-full ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
                    <ArrowLeft size={24} />
                </button>
                <div className="flex w-32 h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary-500 w-full origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: (currentStep + 1) / steps.length }}
                        transition={{ ease: "easeInOut" }}
                    />
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-3xl font-display font-bold mb-8">{steps[currentStep].title}</h2>

                    {currentStep < 2 ? (
                        <div className="flex flex-col gap-4">
                            {steps[currentStep].options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        setFormData({ ...formData, [steps[currentStep].id]: opt });
                                        setTimeout(handleNext, 300);
                                    }}
                                    className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${formData[steps[currentStep].id] === opt
                                            ? 'border-primary-500 bg-primary-500/10 text-primary-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                            : 'border-white/10 hover:border-white/30 glass'
                                        }`}
                                >
                                    <span className="font-semibold text-lg">{opt}</span>
                                    <Target className={formData[steps[currentStep].id] === opt ? 'text-primary-500' : 'text-gray-500'} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Age</label>
                                <input
                                    type="number" placeholder="e.g. 28"
                                    value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Weight (kg)</label>
                                <input
                                    type="number" placeholder="e.g. 70"
                                    value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Height (cm)</label>
                                <input
                                    type="number" placeholder="e.g. 175"
                                    value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8">
                <button
                    onClick={handleNext}
                    disabled={currentStep === 2 && (!formData.age || !formData.weight)} // basic validation
                    className="w-full py-4 btn-pop btn-primary flex justify-center items-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                    {currentStep === 2 ? 'Complete Profile' : 'Continue'}
                    <ArrowRight size={20} />
                </button>
            </div>
        </motion.div>
    );
}
