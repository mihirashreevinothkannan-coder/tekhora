export const calculateProgress = (current, target) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
};

export const getLevelFromXP = (xp, levels) => {
    let currentLevel = levels[0];
    for (let i = 0; i < levels.length; i++) {
        if (xp >= levels[i].xpRequired) {
            currentLevel = levels[i];
        } else {
            break;
        }
    }
    return currentLevel;
};

export const calculateNextLevelProgress = (xp, currentLevel, levels) => {
    const nextLevelIndex = levels.findIndex(l => l.level === currentLevel.level) + 1;
    if (nextLevelIndex >= levels.length) return 100; // Max level

    const nextLevel = levels[nextLevelIndex];
    const xpIntoLevel = xp - currentLevel.xpRequired;
    const xpNeededForLevel = nextLevel.xpRequired - currentLevel.xpRequired;

    return (xpIntoLevel / xpNeededForLevel) * 100;
};
