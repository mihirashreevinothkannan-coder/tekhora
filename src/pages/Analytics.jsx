import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { GlassCard } from '../components/ui/GlassCard';
import { nutritionService } from '../services/nutritionService';
import { Loader2 } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nutritionService.getAnalytics().then((res) => {
      setData(res);
      setLoading(false);
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
    <div className="space-y-6 pb-20 fade-in">
      <h1 className="text-2xl font-bold px-2">Discipline Trends</h1>
      
      {/* Weekly Calories */}
      <GlassCard className="p-4">
        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Caloric Load</h3>
        <div className="h-48 w-full">
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
      <GlassCard className="p-4">
        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Sugar Spikes</h3>
        <div className="h-40 w-full">
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

      {/* Score */}
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
