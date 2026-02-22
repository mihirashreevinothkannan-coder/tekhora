import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useNutritionStore } from '../store/useNutritionStore';
import { streakService } from '../services/streakService';
import { xpService } from '../services/xpService';

export const useRecovery = () => {
    const [isRecovering, setIsRecovering] = useState(false);
    const { streak, setStreak, addXp } = useUserStore();
    const { setRecoveryMode } = useNutritionStore();

    const handleRecovery = async () => {
        setIsRecovering(true);
        try {
            // Partially rescue streak using mock api service
            const newStreak = await streakService.recoverStreak(streak);
            setStreak(newStreak);

            // Award recovery XP
            addXp(xpService.getRecoveryXp());

            // Mark day as in recovery mode so discipline score reflects it
            setRecoveryMode(true);

        } catch (error) {
            console.error('Recovery failed', error);
        } finally {
            setIsRecovering(false);
        }
    };

    return {
        isRecovering,
        handleRecovery,
    };
};
