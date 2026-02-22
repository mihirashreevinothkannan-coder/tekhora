import { XP_REWARDS } from '../utils/constants';

export const xpService = {
    calculateDailyXp: ({ isPerfect, isGood, proteinGoalMet, sugarUnderLimit }) => {
        let totalXp = 0;

        if (isPerfect) totalXp += XP_REWARDS.perfectDay;
        else if (isGood) totalXp += XP_REWARDS.goodDay;

        if (proteinGoalMet) totalXp += XP_REWARDS.proteinGoal;
        if (sugarUnderLimit) totalXp += XP_REWARDS.sugarUnder;

        return totalXp;
    },

    getRecoveryXp: () => {
        return XP_REWARDS.recoveryRun;
    }
};
