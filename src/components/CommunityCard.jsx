import React, { useState } from 'react';
import { Users, Flame, ThumbsUp, Medal } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_COMMUNITY = [
    { id: 1, name: 'Priya S.', goal: 'Lose Weight', streak: 12, avatar: 'P' },
    { id: 2, name: 'Rahul K.', goal: 'Build Muscle', streak: 5, avatar: 'R' },
    { id: 3, name: 'Arjun T.', goal: 'Maintain', streak: 28, avatar: 'A' },
];

export default function CommunityCard() {
    const [cheeredIds, setCheeredIds] = useState([]);

    const handleCheer = (id) => {
        if (!cheeredIds.includes(id)) {
            setCheeredIds(prev => [...prev, id]);
        }
    };

    return (
        <GlassCard className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
                        <Users size={18} />
                    </div>
                    <span className="font-bold text-emerald-100 uppercase tracking-widest text-sm">Discipline Squad</span>
                </div>
                <span className="text-xs text-gray-400 font-semibold">{MOCK_COMMUNITY.length} Active Now</span>
            </div>

            <div className="flex flex-col gap-3">
                {MOCK_COMMUNITY.map((member) => (
                    <div key={member.id} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center font-bold text-white shadow-lg">
                                {member.avatar}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-100">{member.name}</p>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                    <Medal size={10} className="text-yellow-500" /> {member.goal}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                                <Flame size={12} className="text-orange-400 fill-current" />
                                <span className="text-orange-300 font-bold text-xs">{member.streak}</span>
                            </div>
                            <button 
                                onClick={() => handleCheer(member.id)}
                                disabled={cheeredIds.includes(member.id)}
                                className={`p-2 rounded-full transition-all flex items-center justify-center ${
                                    cheeredIds.includes(member.id) 
                                        ? 'bg-emerald-500/20 text-emerald-400 cursor-default' 
                                        : 'bg-white/10 hover:bg-white/20 text-gray-300 btn-pop'
                                }`}
                            >
                                <ThumbsUp size={14} className={cheeredIds.includes(member.id) ? 'fill-current' : ''} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 transition-colors btn-pop">
                Find Friends
            </button>
        </GlassCard>
    );
}
