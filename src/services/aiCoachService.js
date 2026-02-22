import { calculateDisciplineScore } from './disciplineEngine';
import { NUTRITION_GOALS } from '../utils/constants';

export const aiCoachService = {
    getCoachMessage: ({ totals, disciplineScoreStatus }) => {
        const { calories, sugar, protein } = totals;

        if (disciplineScoreStatus === 'Excellent') {
            return "You're heavily armored today! Perfect discipline. Keep burning right!";
        }

        if (disciplineScoreStatus === 'Slipped') {
            return "Slipped a bit? A true warrior recovers immediately. Hit the recovery button!";
        }

        if (sugar > NUTRITION_GOALS.maxSugarGrams) {
            return "Sugar streak broken! Careful, too much sugar slows down the machine.";
        }

        if (protein < NUTRITION_GOALS.proteinTarget * 0.5) {
            return "Protein levels are low! Fuel your muscles before the day ends.";
        }

        if (calories > NUTRITION_GOALS.baselineCalories * 1.2) {
            return "Calories exceeding capacity. Time to optimize and hold the line.";
        }

        return "Steady progress. Discipline is doing what you hate, like you love it.";
    }
};
