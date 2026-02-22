import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Leaf } from 'lucide-react';

export default function HeroScreen({ onNext }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[100dvh] p-6 relative z-10"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-32 h-32 bg-primary-500/10 rounded-full flex items-center justify-center mb-8 border border-primary-500/30 glass glow-ring-green"
            >
                <Leaf size={64} className="text-primary-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]" />
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-4 mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight drop-shadow-md">
                    Build Discipline <br />
                    <span className="text-primary-400">Through Nutrition</span>
                </h1>
                <p className="text-gray-300 font-medium text-lg max-w-sm mx-auto">
                    Gamified AI tracking for your Indian meals. Level up your health.
                </p>
            </motion.div>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onNext}
                className="w-full max-w-xs py-4 px-6 flex items-center justify-center gap-2 btn-pop btn-primary text-lg"
            >
                Start Tracking
                <ChevronRight size={24} />
            </motion.button>
        </motion.div>
    );
}
