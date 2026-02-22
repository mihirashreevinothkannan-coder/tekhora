import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Search, Plus, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function FoodEntry({ onBack, onAdd }) {
    const [mode, setMode] = useState('manual');
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedFood, setDetectedFood] = useState(null);

    const mockFoods = [
        { foodName: 'Palak Paneer', calories: 320, protein: 18, sugar: 2 },
        { foodName: 'Masala Dosa', calories: 280, protein: 6, sugar: 0 },
        { foodName: 'Gulab Jamun', calories: 150, protein: 2, sugar: 14 },
        { foodName: 'Roti (1 piece)', calories: 120, protein: 3, sugar: 1 },
        { foodName: 'Dal Makhani', calories: 340, protein: 14, sugar: 3 },
        { foodName: 'Jeera Rice', calories: 210, protein: 4, sugar: 0 }
    ];

    const handleImageMock = () => {
        setIsAnalyzing(true);
        setMode('image');
        setTimeout(() => {
            setIsAnalyzing(false);
            // Randomly pick an item from mock foods to simulate AI detection
            const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
            setDetectedFood(randomFood);
        }, 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 pt-8 pb-32 min-h-[100dvh] flex flex-col items-center max-w-md mx-auto w-full relative bg-card"
        >
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8">
                <button onClick={onBack} className="p-3 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-display font-bold">Log Food</h2>
                <div className="w-10"></div>
            </div>

            {/* Toggle */}
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-8 w-full gap-1">
                <button
                    onClick={() => { setMode('manual'); setDetectedFood(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-semibold ${mode === 'manual' ? 'bg-white/10 shadow-lg' : 'text-gray-500'}`}
                >
                    <Search size={18} /> Manual
                </button>
                <button
                    onClick={() => { setMode('image'); setDetectedFood(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-semibold ${mode === 'image' || isAnalyzing ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-gray-500'}`}
                >
                    <Camera size={18} /> Auto AI
                </button>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'manual' ? (
                    <motion.div key="manual" className="w-full space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search Indian foods..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-lg outline-none focus:border-primary-500 focus:bg-white/10 transition-all font-semibold"
                            />
                        </div>

                        <div className="space-y-3 pt-4">
                            {mockFoods.filter(f => f.foodName.toLowerCase().includes(query.toLowerCase())).map((f, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div
                                        onClick={() => onAdd(f)}
                                        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer"
                                    >
                                        <div>
                                            <div className="font-bold text-lg mb-0.5">{f.foodName}</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                                {f.calories} kcal • {f.protein}g Pro • {f.sugar}g Sug
                                            </div>
                                        </div>
                                        <button className="p-3 bg-primary-500/10 text-primary-400 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-all btn-pop shrink-0">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="image" className="w-full flex-1 flex flex-col items-center justify-center relative min-h-[300px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {!isAnalyzing && !detectedFood && (
                            <div className="flex flex-col items-center justify-center p-8 bg-dashed border-2 border-dashed border-white/20 rounded-3xl w-full hover:bg-white/5 transition-all cursor-pointer" onClick={handleImageMock}>
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 relative">
                                    <ImageIcon size={32} className="text-gray-400" />
                                    <div className="absolute -bottom-2 -right-2 bg-primary-500 p-2 text-white rounded-full shadow-lg">
                                        <Camera size={14} />
                                    </div>
                                </div>
                                <h3 className="font-display font-bold text-xl mb-2">Tap to scan meal</h3>
                                <p className="text-center text-sm text-gray-400">Our AI instantly detects calories and macros for Indian dishes.</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="flex flex-col items-center justify-center space-y-6 animate-pulse w-full">
                                <div className="w-32 h-32 rounded-3xl border-4 border-t-primary-500 border-white/10 animate-spin flex items-center justify-center shrink-0">
                                </div>
                                <div className="text-primary-400 font-bold uppercase tracking-widest text-sm flex gap-2 items-center">
                                    <Loader2 size={16} className="animate-spin" /> Analyzing Food...
                                </div>
                            </div>
                        )}

                        {detectedFood && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full bg-gradient-to-br from-primary-950/80 to-background border border-primary-500/30 p-6 rounded-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={80} className="text-primary-400" /></div>

                                <div className="bg-primary-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-max mb-4 flex gap-1.5 items-center">
                                    <Sparkles size={12} /> AI Detected
                                </div>

                                <h3 className="text-2xl font-display font-bold mb-1">{detectedFood.foodName}</h3>
                                <p className="text-3xl font-bold text-primary-400 mb-6 font-display">{detectedFood.calories} <span className="text-base text-gray-500 uppercase tracking-widest font-sans font-semibold">kcal</span></p>

                                <div className="flex justify-between border-t border-white/10 pt-4 mb-6">
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Protein</div>
                                        <div className="font-bold text-lg text-blue-400">{detectedFood.protein}g</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Sugar</div>
                                        <div className="font-bold text-lg text-accent-400">{detectedFood.sugar}g</div>
                                    </div>
                                </div>

                                <button className="w-full py-4 btn-pop btn-primary flex justify-center items-center gap-2 relative z-10" onClick={() => onAdd(detectedFood)}>
                                    <CheckCircle size={20} /> Add to Log
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function CheckCircle(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
