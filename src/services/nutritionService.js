import { mockApi } from '../api/mockApi';

export const nutritionService = {
    addMealAndRecalculate: async (currentLogs, newMeal) => {
        try {
            const addedMeal = await mockApi.addMeal(newMeal);
            const combinedLogs = [...currentLogs, addedMeal];
            const newTotals = await mockApi.calculateDailyTotals(combinedLogs);
            return { addedMeal, combinedLogs, newTotals };
        } catch (error) {
            console.error('Error adding meal:', error);
            throw error;
        }
    },

    getAnalytics: async () => {
        try {
            return await mockApi.getWeeklyAnalytics();
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }
};
