import { useState, useEffect } from 'react';
import { dbService } from '../services/api';

export function useData() {
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const reloadData = () => {
        const currentUser = dbService.getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
            // Ensure daily log exists and latest totals are calculated
            const log = dbService.calculateDailyTotals();
            dbService.updateStreaks(log.date);
            setDashboardData(dbService.getDashboardData());
        } else {
            setDashboardData(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        reloadData();
        // Simulate real-time updates across tabs if needed
        window.addEventListener('storage', reloadData);
        return () => window.removeEventListener('storage', reloadData);
    }, []);

    const createUser = (profile) => {
        dbService.createUser(profile);
        reloadData();
    };

    const addMeal = (meal) => {
        dbService.addMeal(meal);
        reloadData();
    };

    const applyRecovery = (sessionId) => {
        dbService.applyRecovery(sessionId);
        reloadData();
    };

    const resetAll = () => {
        dbService.resetDatabase();
        reloadData();
    };

    return {
        user,
        dashboardData,
        loading,
        createUser,
        addMeal,
        applyRecovery,
        resetAll,
        reloadData
    };
}
