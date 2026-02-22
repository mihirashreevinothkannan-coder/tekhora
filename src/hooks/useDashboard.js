import { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { calculateDisciplineScore } from '../services/disciplineEngine';
import { aiCoachService } from '../services/aiCoachService';
import { aiService } from '../services/aiService';
import { NUTRITION_GOALS } from '../utils/constants';

// Business logic isolated in hooks/services
export const useDashboard = () => {
    const { user, xp, streak, levelIndex, addXp, setLevelIndex } = useUserStore();
    const { totals, isRecoveryMode, setDisciplineScore } = useNutritionStore();

    const [coachMessage, setCoachMessage] = useState('Checking systems...');
    const [currentScore, setCurrentScore] = useState(100);
    const [scoreStatus, setScoreStatus] = useState('Excellent');

    // Calculate score and message whenever totals changes
    useEffect(() => {
        const { score, status } = calculateDisciplineScore({
            ...totals,
            isRecovery: isRecoveryMode,
        });

        setCurrentScore(score);
        setScoreStatus(status);
        setDisciplineScore(score);

        // Update AI Coach Message
        const defaultMsg = aiCoachService.getCoachMessage({ totals, disciplineScoreStatus: status });
        setCoachMessage('Analyzing...');

        aiService.generateCoachMessage({
            totals,
            score,
            status,
            defaultMessage: defaultMsg
        }).then(msg => setCoachMessage(msg));
    }, [totals, isRecoveryMode, setDisciplineScore]);

    // Derived state to pass to view
    const progressMetrics = useMemo(() => ({
        calorieProgress: Math.min((totals.calories / NUTRITION_GOALS.baselineCalories) * 100, 100),
        sugarRatio: totals.sugar / NUTRITION_GOALS.maxSugarGrams, // Can exceed 1
        proteinProgress: Math.min((totals.protein / NUTRITION_GOALS.proteinTarget) * 100, 100),
    }), [totals]);

    return {
        user,
        xp,
        streak,
        levelIndex,
        totals,
        coachMessage,
        currentScore,
        scoreStatus,
        progressMetrics,
        isRecoveryMode,
    };
};
