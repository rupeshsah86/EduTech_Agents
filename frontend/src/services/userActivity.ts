// User Activity & Profile History Tracking Service
export interface HistoryItem {
  id: string;
  query: string;
  category: string;
  agentName: string;
  timestamp: string;
  dateStr: string;
}

export interface UserActivity {
  activeStreak: number;
  totalActiveDays: number;
  lastActiveDate: string;
  activeDates: string[];
  history: HistoryItem[];
  academicGoal: string;
  targetSubject: string;
  bio: string;
  avatarPreset: string;
  totalSearchesCount: number;
}

const STORAGE_KEY = 'eduverse_user_activity_v1';

class UserActivityService {
  private activity: UserActivity;

  constructor() {
    this.activity = this.loadActivity();
    this.recordTodayActivity();
  }

  private loadActivity(): UserActivity {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultData: UserActivity = {
      activeStreak: 1,
      totalActiveDays: 1,
      lastActiveDate: todayStr,
      activeDates: [todayStr],
      history: [
        {
          id: 'hist_init_1',
          query: 'Data Structures & Algorithms Roadmap',
          category: 'Code & DSA',
          agentName: 'CodeMentor AI',
          timestamp: '10:00 AM',
          dateStr: todayStr,
        },
        {
          id: 'hist_init_2',
          query: 'Operating System Deadlocks & banker algorithm',
          category: 'Exam Prep',
          agentName: 'ExamAce AI',
          timestamp: '09:45 AM',
          dateStr: todayStr,
        },
        {
          id: 'hist_init_3',
          query: 'SQL Joins & Relational Database Design',
          category: 'DBMS & SQL',
          agentName: 'ConceptClear AI',
          timestamp: '09:15 AM',
          dateStr: todayStr,
        },
      ],
      academicGoal: 'Computer Science & Engineering',
      targetSubject: 'DSA, Operating Systems & System Design',
      bio: 'Socratic learner mastering CS algorithms, AI agents & system design.',
      avatarPreset: 'purple',
      totalSearchesCount: 3,
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultData, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load user activity from storage:', e);
    }

    return defaultData;
  }

  private saveActivity() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.activity));
      window.dispatchEvent(new CustomEvent('user-activity-updated', { detail: this.activity }));
    } catch (e) {
      console.warn('Failed to save user activity:', e);
    }
  }

  public recordTodayActivity() {
    const todayStr = new Date().toISOString().split('T')[0];
    const dates = new Set(this.activity.activeDates || []);

    if (!dates.has(todayStr)) {
      dates.add(todayStr);
      this.activity.activeDates = Array.from(dates);
      this.activity.totalActiveDays = dates.size;

      // Streak calculation
      if (this.activity.lastActiveDate) {
        const lastDate = new Date(this.activity.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          this.activity.activeStreak += 1;
        } else if (diffDays > 1) {
          this.activity.activeStreak = 1;
        }
      } else {
        this.activity.activeStreak = 1;
      }

      this.activity.lastActiveDate = todayStr;
      this.saveActivity();
    }
  }

  public logSearch(query: string, category: string = 'General', agentName: string = 'Master AI'): HistoryItem {
    const cleanQuery = query.trim();
    if (!cleanQuery) return this.activity.history[0];

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: HistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      query: cleanQuery,
      category,
      agentName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: todayStr,
    };

    // Deduplicate identical top query
    const filtered = this.activity.history.filter((h) => h.query.toLowerCase() !== cleanQuery.toLowerCase());
    this.activity.history = [newEntry, ...filtered].slice(0, 50); // Keep top 50
    this.activity.totalSearchesCount = (this.activity.totalSearchesCount || 0) + 1;

    this.recordTodayActivity();
    this.saveActivity();
    return newEntry;
  }

  public updateProfileData(data: Partial<Pick<UserActivity, 'academicGoal' | 'targetSubject' | 'bio' | 'avatarPreset'>>) {
    this.activity = { ...this.activity, ...data };
    this.saveActivity();
    return this.activity;
  }

  public clearHistory() {
    this.activity.history = [];
    this.saveActivity();
  }

  public getActivity(): UserActivity {
    return { ...this.activity };
  }
}

export const userActivityService = new UserActivityService();
