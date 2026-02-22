import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, Plus, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { nutritionService } from '../services/nutritionService';
import { useNutritionStore } from '../store/useNutritionStore';
import { useUserStore } from '../store/useUserStore';
import { streakService } from '../services/streakService';
import { calculateDisciplineScore } from '../services/disciplineEngine';

// Mock DB for the searchable dropdown
const MOCK_FOOD_DB = [
  { id: 1, name: 'Chicken Biryani', calories: 450, protein: 25, sugar: 5 },
  { id: 2, name: 'Paneer Butter Masala', calories: 350, protein: 12, sugar: 8 },
  { id: 3, name: 'Masala Dosa', calories: 250, protein: 6, sugar: 4 },
  { id: 4, name: 'Dal Tadka', calories: 150, protein: 8, sugar: 2 },
  { id: 5, name: 'Butter Naan', calories: 180, protein: 4, sugar: 3 },
  { id: 6, name: 'Protein Shake', calories: 120, protein: 24, sugar: 2 },
  { id: 7, name: 'Oats with Apple', calories: 200, protein: 6, sugar: 12 },
];

export default function FoodEntry() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');
  
  // Stores
  const { dailyLogs, isRecoveryMode, setTotals } = useNutritionStore();
  const { streak, setStreak } = useUserStore();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [sugar, setSugar] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredFoods = useMemo(() => {
    if (!searchQuery) return MOCK_FOOD_DB;
    return MOCK_FOOD_DB.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const handleFoodSelect = (food) => {
    setMealName(food.name);
    setSearchQuery(food.name);
    setCalories(food.calories);
    setProtein(food.protein);
    setSugar(food.sugar);
    setQuantity(1);
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setMealName(e.target.value); // Custom entry
    setShowDropdown(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!mealName || !calories) return;
    
    setIsSubmitting(true);
    
    // Multiply by quantity
    const newMeal = {
      name: `${mealName} (x${quantity})`,
      calories: Number(calories) * quantity,
      protein: (Number(protein) || 0) * quantity,
      sugar: (Number(sugar) || 0) * quantity
    };

    try {
      const { combinedLogs, newTotals } = await nutritionService.addMealAndRecalculate(dailyLogs, newMeal);
      
      // Update global states using stores
      useNutritionStore.getState().addMeal(newMeal); 
      
      // Recalc streak based on new totals
      const { score } = calculateDisciplineScore({ ...newTotals, isRecovery: isRecoveryMode });
      const nextStreak = await streakService.processDailyStreak(streak, score);
      
      if (nextStreak !== streak) {
        setStreak(nextStreak);
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
      
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const simulateAiDetection = () => {
    setAnalyzingImage(true);
    setTimeout(() => {
      setSearchQuery('Grilled Chicken Salad');
      setMealName('Grilled Chicken Salad');
      setCalories('350');
      setProtein('45');
      setSugar('4');
      setQuantity(1);
      setAnalyzingImage(false);
      setActiveTab('manual');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20 fade-in">
      <h1 className="text-2xl font-bold px-2">Log Fuel</h1>
      
      {/* Target Tabs */}
      <GlassCard className="p-2 flex gap-2">
        <button 
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'manual' ? 'bg-green-400 text-slate-900 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          <Search className="inline w-4 h-4 mr-2" /> Manual
        </button>
        <button 
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'camera' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          <Camera className="inline w-4 h-4 mr-2" /> AI Scan
        </button>
      </GlassCard>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center h-64"
          >
            <CheckCircle2 className="w-20 h-20 text-green-400 mb-4 bg-green-400/20 rounded-full p-2" />
            <h2 className="text-xl font-bold text-white">Logged Successfully</h2>
            <p className="text-slate-400">Streak updated.</p>
          </motion.div>
        ) : activeTab === 'manual' ? (
          <motion.form 
            key="manual"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <GlassCard className="space-y-4">
              <div className="relative">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-1 mb-1 block">Search Food</label>
                <input 
                  autoFocus
                  required
                  placeholder="e.g. Masala Dosa" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-green-400"
                />
                
                {/* Search Dropdown */}
                {showDropdown && filteredFoods.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                    {filteredFoods.map(food => (
                      <button
                        key={food.id}
                        type="button"
                        onClick={() => handleFoodSelect(food)}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 text-white border-b border-white/5 last:border-0"
                      >
                        <div className="font-semibold">{food.name}</div>
                        <div className="text-xs text-slate-400">{food.calories} kcal • {food.protein}g Pro</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 border-r border-white/10 pr-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-1 mb-1 block">Qty</label>
                  <input type="number" min="1" step="0.5" required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-3 text-white text-center focus:border-green-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-1 mb-1 block">Kcal</label>
                  <input type="number" required placeholder="0" value={calories} onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-3 text-white text-center focus:border-green-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-1 mb-1 block text-blue-400">Pro</label>
                  <input type="number" placeholder="0" value={protein} onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-3 text-center text-blue-300 focus:border-blue-400 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-1 mb-1 block text-orange-400">Sug</label>
                  <input type="number" placeholder="0" value={sugar} onChange={(e) => setSugar(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/20 rounded-xl p-3 text-center text-orange-300 focus:border-orange-400 outline-none" />
                </div>
              </div>
            </GlassCard>

            <button 
              type="submit"
              disabled={isSubmitting || !mealName || !calories}
              className="w-full py-4 rounded-xl bg-green-500 text-slate-900 font-bold text-lg flex justify-center items-center gap-2 hover:bg-green-400 transform transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <><Plus className="w-5 h-5" /> Add to Log</>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="camera"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <div 
              onClick={simulateAiDetection}
              className="relative w-full h-80 rounded-2xl border-2 border-dashed border-indigo-500/50 bg-indigo-500/10 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-500/20 transition-colors overflow-hidden group"
            >
              {analyzingImage ? (
                <>
                  <div className="absolute inset-0 bg-indigo-900/50 animate-pulse" />
                  <Loader2 className="w-12 h-12 text-indigo-400 animate-spin z-10 mb-4" />
                  <span className="z-10 text-indigo-200 font-bold text-lg animate-pulse">Analyzing Macros...</span>
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_15px_#818cf8] animate-[scan_2s_ease-in-out_infinite] z-20" />
                </>
              ) : (
                <>
                  <Camera className="w-16 h-16 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="text-indigo-200 font-bold text-lg">Tap to Snap</span>
                  <p className="text-sm text-indigo-400/80 mt-2 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> AI Auto-Detect
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
