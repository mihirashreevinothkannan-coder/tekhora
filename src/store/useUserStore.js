import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
    persist(
        (set) => ({
            user: null, // { name, goal, currentLevel, ... }
            xp: 0,
            streak: 0,
            levelIndex: 0,

            setUser: (user) => set({ user }),

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            setStreak: (streak) => set({ streak }),
            incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
            resetStreak: () => set({ streak: 0 }),

            setLevelIndex: (index) => set({ levelIndex: index }),

            logout: () => set({ user: null, xp: 0, streak: 0, levelIndex: 0 }),
        }),
        {
            name: 'user-storage',
        }
    )
);
