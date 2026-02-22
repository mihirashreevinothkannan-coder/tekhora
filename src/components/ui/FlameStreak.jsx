import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function FlameStreak({ streak = 12 }) {
    return (
        <div className="flex items-center gap-1.5 bg-accent-500/20 px-3 py-1.5 rounded-2xl border border-accent-500/30">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Flame size={20} className="text-accent-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] fill-accent-500" />
            </motion.div>
            <span className="font-display font-bold text-accent-500 text-lg">{streak}</span>
        </div>
    );
}
