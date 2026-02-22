import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNutritionStore = create(
    persist(
        (set, get) => ({
            dailyLogs: [],
            totals: { calories: 0, protein: 0, sugar: 0 },
            isRecoveryMode: false,
            disciplineScore: 100,

            addMeal: (meal) => set((state) => {
                const newLogs = [...state.dailyLogs, meal];
                const newTotals = newLogs.reduce((acc, curr) => ({
                    calories: acc.calories + (Number(curr.calories) || 0),
                    protein: acc.protein + (Number(curr.protein) || 0),
                    sugar: acc.sugar + (Number(curr.sugar) || 0),
                }), { calories: 0, protein: 0, sugar: 0 });

                return {
                    dailyLogs: newLogs,
                    totals: newTotals,
                };
            }),

            setTotals: (totals) => set({ totals }),

            setRecoveryMode: (isRecovery) => set({ isRecoveryMode: isRecovery }),

            setDisciplineScore: (score) => set({ disciplineScore: score }),

            resetDaily: () => set({
                dailyLogs: [],
                totals: { calories: 0, protein: 0, sugar: 0 },
                isRecoveryMode: false,
                disciplineScore: 100
            }),
        }),
        {
            name: 'nutrition-storage',
        }
    )
);
