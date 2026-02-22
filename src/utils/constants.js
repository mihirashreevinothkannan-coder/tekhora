export const NUTRITION_GOALS = {
    baselineCalories: 2000,
    maxSugarGrams: 30, // threshold
    proteinTarget: 120, // grams
};

export const LEVELS = [
    { level: 1, xpRequired: 0, title: 'Novice' },
    { level: 2, xpRequired: 500, title: 'Apprentice' },
    { level: 3, xpRequired: 1500, title: 'Disciplined' },
    { level: 4, xpRequired: 3000, title: 'Warrior' },
    { level: 5, xpRequired: 5000, title: 'Master' },
];

export const XP_REWARDS = {
    perfectDay: 100,
    goodDay: 50,
    proteinGoal: 20,
    sugarUnder: 20,
    recoveryRun: 150,
};
