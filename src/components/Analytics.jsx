import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Target, Activity, Droplets } from 'lucide-react';
import { dbService } from '../services/api';
import { useData } from '../hooks/useData';

export default function Analytics() {
    const { user } = useData();
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        setWeeklyData(dbService.getWeeklyAnalytics());
    }, []);

    const totalProThisWeek = weeklyData.reduce((sum, d) => sum + d.pro, 0);
    const avgSugarThisWeek = weeklyData.length > 0 ? Math.round(weeklyData.reduce((sum, d) => sum + d.sug, 0) / weeklyData.length) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="p-4 pt-8 pb-32 min-h-[100dvh] bg-background space-y-8"
        >
            <div>
                <h2 className="text-3xl font-display font-bold">Analytics</h2>
                <p className="text-gray-400 font-semibold tracking-wide uppercase text-sm mt-1">Discipline Insights</p>
            </div>

            <div className="glass-card p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5"><Activity size={64} /></div>
                <h3 className="text-lg font-bold mb-6 font-display flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary-500 rounded-full inline-block"></span>
                    Weekly Calories
                </h3>

                <div className="h-48 w-full">
                    {weeklyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#4ade80' }}
                                />
                                <Area type="monotone" dataKey="cal" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm font-semibold">
                            Not enough data to display
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StatsCard
                    title="Avg Sugar"
                    val={`${avgSugarThisWeek}g`}
                    trend={avgSugarThisWeek > user.sugarThreshold ? 'Over Limit' : 'On Track'}
                    color={avgSugarThisWeek > user.sugarThreshold ? 'text-red-400' : 'text-primary-400'}
                    icon={Droplets}
                    bg={avgSugarThisWeek > user.sugarThreshold ? 'bg-red-500/10' : 'bg-primary-500/10'}
                    border={avgSugarThisWeek > user.sugarThreshold ? 'border-red-500/20' : 'border-primary-500/20'}
                />
                <StatsCard
                    title="Discipline Score"
                    val={(user.level * 10) + user.xp}
                    trend="+ Level Scale"
                    color="text-primary-400"
                    icon={Target}
                    bg="bg-primary-500/10"
                    border="border-primary-500/20"
                />
            </div>

            <div className="glass p-5 rounded-3xl border border-white/5 space-y-4">
                <h3 className="font-display font-bold text-lg mb-2">Protein Compliance</h3>
                {weeklyData.length > 0 ? (
                    <div className="space-y-3">
                        {weeklyData.map((d, i) => {
                            const height = Math.min((d.pro / user.proteinTarget) * 100, 100) || 5;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-8 text-xs text-gray-400 font-bold">{d.date}</span>
                                    <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${height}%` }}
                                            transition={{ delay: i * 0.1, duration: 1 }}
                                            className={`h-full rounded-full ${height > 80 ? 'bg-blue-500' : 'bg-blue-500/50'}`}
                                        ></motion.div>
                                    </div>
                                    <span className="w-10 text-xs font-bold text-right">{Math.round(d.pro)}g</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm font-semibold text-center">Log meals to view compliance.</p>
                )}
            </div>

        </motion.div>
    );
}

function StatsCard({ title, val, trend, color, icon: Icon, bg, border }) {
    return (
        <div className={`p-5 rounded-3xl border ${border} ${bg} backdrop-blur-md flex flex-col items-center text-center`}>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 text-white">
                <Icon size={20} />
            </div>
            <div className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">{title}</div>
            <div className="text-3xl font-display font-bold mb-1">{val}</div>
            <div className={`font-semibold text-xs ${color}`}>{trend}</div>
        </div>
    );
}
