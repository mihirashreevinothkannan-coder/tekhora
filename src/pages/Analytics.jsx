import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { GlassCard } from '../components/ui/GlassCard';
import { nutritionService } from '../services/nutritionService';
import { aiService } from '../services/aiService';
import { Loader2, BrainCircuit } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    nutritionService.getAnalytics().then(async (res) => {
      setData(res);
      setLoading(false);
      // Fetch AI Insight
      const analysis = await aiService.generateWeeklyInsights(res);
      setInsight(analysis);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 fade-in w-full">
      <h1 className="text-3xl font-bold px-2 tracking-tight">Discipline Trends</h1>

      <GlassCard className="p-6 relative overflow-hidden border-2 border-indigo-500/20">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <BrainCircuit className="w-32 h-32 text-indigo-400" />
        </div>
        <div className="flex gap-4 relative z-10">
           <div className="bg-indigo-500/20 p-3 rounded-xl h-fit">
             <BrainCircuit className="w-6 h-6 text-indigo-400" />
           </div>
           <div>
             <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">Weekly AI Analysis</h3>
             {insight ? (
                 <p className="text-sm font-medium text-slate-200 leading-relaxed max-w-2xl">{insight}</p>
             ) : (
                 <div className="flex items-center gap-2 text-indigo-200/50 text-sm">
                     <Loader2 className="w-4 h-4 animate-spin" /> Analyzing 7-day pattern...
                 </div>
             )}
           </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {/* Weekly Calories */}
        <GlassCard className="p-5 h-72">
          <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Caloric Load</h3>
          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Sugar Target Compliance */}
        <GlassCard className="p-5 h-72">
          <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Sugar Spikes</h3>
          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="sugar" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.sugar > 30 ? '#ef4444' : '#fb923c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      <GlassCard className="p-4 mb-8">
        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Discipline Score</h3>
        <div className="h-32 w-full flex items-end gap-2 justify-between">
          {data.map((d, i) => (
            <motion.div 
              key={i} 
              className="flex-1 rounded-t-lg bg-green-500/20 relative group"
              style={{ height: `${d.score}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${d.score}%` }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-x-0 bottom-0 bg-green-400 w-full" style={{ height: 'max(4px, 10%)' }} />
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded shadow-lg transition-opacity font-bold">
                {d.score}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-1">
          {data.map((d, i) => (
             <span key={i} className="text-[10px] text-slate-500 font-bold">{d.day.charAt(0)}</span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
