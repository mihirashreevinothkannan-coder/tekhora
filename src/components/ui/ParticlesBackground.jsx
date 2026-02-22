import React from 'react';
import { motion } from 'framer-motion';

export default function ParticlesBackground() {
    const particles = Array.from({ length: 20 });

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((_, i) => {
                const isGreen = i % 2 === 0;
                return (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full blur-xl opacity-20 ${isGreen ? 'bg-primary-500' : 'bg-accent-500'}`}
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}
        </div>
    );
}
