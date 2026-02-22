import { NUTRITION_GOALS } from '../utils/constants';

// Business logic inside services/disciplineEngine.js
// 40% calorie compliance, 25% sugar control, 20% protein consistency, 15% recovery behavior

export const calculateDisciplineScore = ({ calories, sugar, protein, isRecovery }) => {
    let score = 0;

    // 1. Calorie Compliance (40%)
    // Perfect if within +/- 10% of baseline. Drops off otherwise.
    const calDiff = Math.abs(calories - NUTRITION_GOALS.baselineCalories);
    if (calDiff <= 200) {
        score += 40;
    } else if (calDiff <= 500) {
        score += 25;
    } else {
        score += 10;
    }

    // 2. Sugar Control (25%)
    // Max sugar is 30g
    if (sugar <= NUTRITION_GOALS.maxSugarGrams) {
        score += 25;
    } else if (sugar <= 50) {
        score += 15;
    } else {
        score += 5;
    }

    // 3. Protein Consistency (20%)
    if (protein >= NUTRITION_GOALS.proteinTarget * 0.9) {
        score += 20;
    } else if (protein >= NUTRITION_GOALS.proteinTarget * 0.5) {
        score += 10;
    } else {
        score += 0;
    }

    // 4. Recovery Behavior (15%)
    if (isRecovery) {
        score += 15;
    } else {
        // If they naturally did well, they don't need recovery, still get points
        if (score >= 60) score += 15;
    }

    let status = 'Slipped';
    let streakImpact = 'broken';

    if (score >= 85) {
        status = 'Excellent';
        streakImpact = 'increase';
    } else if (score >= 60) {
        status = 'Good';
        streakImpact = 'maintain';
    }

    return {
        score,
        status,
        streakImpact,
    };
};
