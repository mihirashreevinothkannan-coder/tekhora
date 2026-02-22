// Simulated SQLite Data Layer using LocalStorage

const DB_KEY = 'discipline_db';

// Initial structure
const initialDb = {
    users: [],
    daily_logs: [],
    meals: [],
    streaks: [],
    recovery_sessions: []
};

// Helper to get/set DB
const getDb = () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : initialDb;
};

const setDb = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Get current date string (YYYY-MM-DD)
export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const dbService = {
    resetDatabase: () => {
        localStorage.removeItem(DB_KEY);
    },

    getCurrentUser: () => {
        const db = getDb();
        return db.users[0] || null; // Assume single user for demo
    },

    createUser: (profileData) => {
        const db = getDb();

        // Calculate targets based on basic formulas (Demo logic)
        let bmr = 10 * Number(profileData.weight) + 6.25 * Number(profileData.height) - 5 * Number(profileData.age);
        bmr += profileData.gender === 'Male' ? 5 : -161; // basic Mifflin-St Jeor

        const activityMultipliers = {
            'Sedentary': 1.2,
            'Lightly Active': 1.375,
            'Very Active': 1.725
        };
        const tdee = bmr * (activityMultipliers[profileData.activity] || 1.2);

        let calorieTarget = tdee;
        if (profileData.goal === 'Lose Weight') calorieTarget -= 500;
        if (profileData.goal === 'Build Muscle') calorieTarget += 300;

        const user = {
            id: generateId(),
            ...profileData,
            calorieTarget: Math.round(calorieTarget),
            proteinTarget: Math.round(Number(profileData.weight) * (profileData.goal === 'Build Muscle' ? 2 : 1.2)),
            sugarThreshold: 35, // grams
            xp: 0,
            level: 1
        };

        db.users = [user]; // overwrite in demo

        // Init streak
        db.streaks = [{
            userId: user.id,
            calorieStreak: 0,
            sugarStreak: 0,
            proteinScore: 0,
            recoveryStreak: 0
        }];

        setDb(db);
        return user;
    },

    updateUserXp: (db, userId, xpGained) => {
        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return;

        let newXp = db.users[userIndex].xp + xpGained;
        let newLevel = db.users[userIndex].level;

        while (newXp >= 100) {
            newLevel++;
            newXp -= 100;
        }

        db.users[userIndex].xp = newXp;
        db.users[userIndex].level = newLevel;
    },

    getOrCreateDailyLog: (db, userId, date) => {
        let log = db.daily_logs.find(l => l.userId === userId && l.date === date);
        if (!log) {
            log = {
                id: generateId(),
                userId,
                date,
                totalCalories: 0,
                totalProtein: 0,
                totalSugar: 0,
                disciplineScore: 100
            };
            db.daily_logs.push(log);
        }
        return log;
    },

    calculateDailyTotals: (date = getTodayStr()) => {
        const db = getDb();
        const user = db.users[0];
        if (!user) return null;

        const log = dbService.getOrCreateDailyLog(db, user.id, date);
        const dailyMeals = db.meals.filter(m => m.logId === log.id);

        log.totalCalories = dailyMeals.reduce((sum, m) => sum + m.calories, 0);
        log.totalProtein = dailyMeals.reduce((sum, m) => sum + m.protein, 0);
        log.totalSugar = dailyMeals.reduce((sum, m) => sum + m.sugar, 0);

        setDb(db);
        dbService.updateStreaks(date);
        return log;
    },

    addMeal: (mealData) => {
        const db = getDb();
        const user = db.users[0];
        if (!user) return null;

        const date = getTodayStr();
        const log = dbService.getOrCreateDailyLog(db, user.id, date);

        const meal = {
            id: generateId(),
            logId: log.id,
            ...mealData
        };

        db.meals.push(meal);
        setDb(db);

        // Recalculate will also check for recovery session creation
        dbService.calculateDailyTotals(date);
        return meal;
    },

    updateStreaks: (date) => {
        const db = getDb();
        const user = db.users[0];
        if (!user) return;

        const log = db.daily_logs.find(l => l.userId === user.id && l.date === date);
        if (!log) return;

        let streak = db.streaks.find(s => s.userId === user.id);

        // Give XP based on today's state (Demo only calculates it as delta, but let's just 
        // evaluate the state and assign XP safely. In a real app we'd track "already awarded").
        // For hackathon: we just simulate changes smoothly.

        // Calorie logic
        if (log.totalCalories <= user.calorieTarget + 50) {
            streak.calorieStreak++;
            // award xp logic handled dynamically in UI or separate function
        } else {
            streak.calorieStreak = 0;
            // create recovery session if over
            const extraCalories = log.totalCalories - user.calorieTarget;
            const existingSession = db.recovery_sessions.find(r => r.logId === log.id);
            if (!existingSession && extraCalories > 50) {
                db.recovery_sessions.push({
                    id: generateId(),
                    logId: log.id,
                    extraCalories,
                    requiredMinutes: Math.ceil(extraCalories / 7),
                    completed: false,
                    compensationPercent: 40
                });
            }
        }

        // Sugar logic
        if (log.totalSugar < user.sugarThreshold) {
            streak.sugarStreak++;
        } else {
            streak.sugarStreak = 0;
        }

        // Protein Logic
        if (log.totalProtein >= user.proteinTarget) {
            streak.proteinScore += 10;
        } else {
            streak.proteinScore -= 5;
        }

        setDb(db);
    },

    applyRecovery: (sessionId) => {
        const db = getDb();
        const session = db.recovery_sessions.find(s => s.id === sessionId);
        if (!session || session.completed) return false;

        session.completed = true;

        const user = db.users[0];
        if (user) {
            dbService.updateUserXp(db, user.id, 15); // +15 XP for recovery
            let streak = db.streaks.find(s => s.userId === user.id);
            if (streak) streak.recoveryStreak++;
        }

        setDb(db);
        return true;
    },

    getDashboardData: () => {
        const db = getDb();
        const user = db.users[0];
        if (!user) return null;

        const date = getTodayStr();
        const log = dbService.getOrCreateDailyLog(db, user.id, date);
        const streak = db.streaks.find(s => s.userId === user.id) || { calorieStreak: 0, sugarStreak: 0, proteinScore: 0 };
        const pendingRecovery = db.recovery_sessions.find(s => s.logId === log.id && !s.completed);

        return {
            user,
            log,
            streak,
            pendingRecovery,
            recentMeals: db.meals.filter(m => m.logId === log.id).slice(-3)
        };
    },

    getWeeklyAnalytics: () => {
        const db = getDb();
        const user = db.users[0];
        if (!user) return [];

        // Return last 7 days of logs
        const sortedLogs = db.daily_logs
            .filter(l => l.userId === user.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7);

        // If not enough data, just return mocks for demo
        if (sortedLogs.length < 2) {
            return [
                { date: 'Mon', cal: 1800, pro: 80, sug: 20 },
                { date: 'Tue', cal: 1950, pro: 90, sug: 40 },
                { date: 'Wed', cal: +sortedLogs[0]?.totalCalories || 2100, pro: sortedLogs[0]?.totalProtein || 60, sug: sortedLogs[0]?.totalSugar || 35 },
            ];
        }

        return sortedLogs.map(l => ({
            date: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
            cal: l.totalCalories,
            pro: l.totalProtein,
            sug: l.totalSugar
        }));
    }
};
