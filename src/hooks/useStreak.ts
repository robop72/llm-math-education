import { useState, useCallback } from 'react';

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string; // YYYY-MM-DD
  streakFreezeCount: number;
  dailyGoalMet: boolean;
  messagesCompletedToday: number;
  totalXP: number;
}

const STORAGE_KEY = 'voxii-streak';
const DAILY_GOAL = 5;
const MILESTONES = [7, 30, 100];

function today(): string {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
}

function defaultData(): StreakData {
  return {
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: '',
    streakFreezeCount: 0,
    dailyGoalMet: false,
    messagesCompletedToday: 0,
    totalXP: 0,
  };
}

function load(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    return defaultData();
  }
}

function save(data: StreakData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function dateDiffDays(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

export function useStreak() {
  const [data, setData] = useState<StreakData>(load);
  const [milestone, setMilestone] = useState<number | null>(null);

  const recordMessage = useCallback(() => {
    setData(prev => {
      const t = today();
      let updated = { ...prev };

      if (prev.last_activity_date !== t) {
        // New day — reset daily counters
        updated.messagesCompletedToday = 0;
        updated.dailyGoalMet = false;

        if (prev.last_activity_date === '') {
          // First ever session
          updated.current_streak = 0;
        } else {
          const diff = dateDiffDays(prev.last_activity_date, t);
          if (diff === 1) {
            // Consecutive day — streak continues
          } else if (diff > 1) {
            // Missed days — use freeze or reset
            if (prev.streakFreezeCount > 0) {
              updated.streakFreezeCount = prev.streakFreezeCount - 1;
            } else {
              updated.current_streak = 0;
            }
          }
        }
        updated.last_activity_date = t;
      }

      // Count this message
      updated.messagesCompletedToday += 1;
      updated.totalXP += 10;

      // Check if daily goal just met
      if (!updated.dailyGoalMet && updated.messagesCompletedToday >= DAILY_GOAL) {
        updated.dailyGoalMet = true;
        updated.current_streak += 1;
        if (updated.current_streak > updated.longest_streak) {
          updated.longest_streak = updated.current_streak;
        }

        // Check milestone — find the highest milestone just crossed
        const hit = MILESTONES.filter(m => updated.current_streak === m).at(-1) ?? null;
        if (hit !== null) {
          // Trigger milestone outside of setState via a microtask
          setTimeout(() => setMilestone(hit), 0);
        }
      }

      save(updated);
      return updated;
    });
  }, []);

  const dismissMilestone = useCallback(() => setMilestone(null), []);

  const addFreeze = useCallback(() => {
    setData(prev => {
      const updated = { ...prev, streakFreezeCount: prev.streakFreezeCount + 1 };
      save(updated);
      return updated;
    });
  }, []);

  return { data, milestone, recordMessage, dismissMilestone, addFreeze };
}
