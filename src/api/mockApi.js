// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    createUser: async (userData) => {
        await delay(500);
        return { id: 'user_' + Date.now(), ...userData, streak: 0, xp: 0 };
    },

    addMeal: async (mealData) => {
        await delay(400);
        return { id: 'meal_' + Date.now(), ...mealData, timestamp: new Date().toISOString() };
    },

    calculateDailyTotals: async (meals) => {
        await delay(300);
        return meals.reduce((acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            sugar: acc.sugar + meal.sugar,
        }), { calories: 0, protein: 0, sugar: 0 });
    },

    updateStreaks: async (currentStreak, isValidDay) => {
        await delay(300);
        return isValidDay ? currentStreak + 1 : 0;
    },

    applyRecovery: async (currentStreak) => {
        await delay(800);
        // partially restore streak max 40%
        return Math.max(1, Math.floor(currentStreak * 0.4));
    },

    getWeeklyAnalytics: async () => {
        await delay(600);
        return [
            { day: 'Mon', calories: 1900, sugar: 25, protein: 130, score: 95 },
            { day: 'Tue', calories: 2100, sugar: 40, protein: 110, score: 80 },
            { day: 'Wed', calories: 1850, sugar: 20, protein: 140, score: 98 },
            { day: 'Thu', calories: 2500, sugar: 60, protein: 90, score: 60 },
            { day: 'Fri', calories: 1950, sugar: 28, protein: 125, score: 92 },
            { day: 'Sat', calories: 2050, sugar: 35, protein: 115, score: 85 },
            { day: 'Sun', calories: 1900, sugar: 22, protein: 130, score: 95 },
        ];
    }
};
