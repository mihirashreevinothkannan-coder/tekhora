import { mockApi } from '../api/mockApi';

export const streakService = {
    processDailyStreak: async (currentStreak, disciplineScore) => {
        try {
            const isValidDay = disciplineScore >= 60; // minimum score to keep streak
            return await mockApi.updateStreaks(currentStreak, isValidDay);
        } catch (error) {
            console.error('Error processing streak:', error);
            throw error;
        }
    },

    recoverStreak: async (currentStreak) => {
        try {
            return await mockApi.applyRecovery(currentStreak);
        } catch (error) {
            console.error('Error recovering streak:', error);
            throw error;
        }
    }
};
