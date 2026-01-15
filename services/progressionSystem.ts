
import { PlayerProgress, Achievement, SessionStats } from '../types';
import { ACHIEVEMENTS, GAME_CONFIG } from '../constants';

const STORAGE_KEY = 'time_rift_guardian_save';

export class ProgressionSystem {
  private progress: PlayerProgress;

  constructor() {
    this.progress = this.loadProgress();
  }

  private loadProgress(): PlayerProgress {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse save data", e);
      }
    }
    // Added missing totalCoins property to the default return object to satisfy PlayerProgress interface
    return {
      level: 1,
      xp: 0,
      totalAnswered: 0,
      correctCount: 0,
      maxCombo: 0,
      unlockedAchievements: [],
      lastPlayDate: new Date().toISOString(),
      totalCoins: 0
    };
  }

  public saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
  }

  public updateAfterSession(session: SessionStats): { leveledUp: boolean, newAchievements: Achievement[] } {
    const xpGained = session.questionsAnswered * GAME_CONFIG.XP_PER_CORRECT + Math.floor(session.score / 10);
    this.progress.xp += xpGained;
    this.progress.totalAnswered += session.questionsAnswered;
    this.progress.correctCount += (session.questionsAnswered - (GAME_CONFIG.INITIAL_HEALTH - session.health));
    // Update totalCoins persistent progress from session stats
    this.progress.totalCoins += session.coins;
    
    if (session.maxCombo > this.progress.maxCombo) {
      this.progress.maxCombo = session.maxCombo;
    }

    const oldLevel = this.progress.level;
    this.progress.level = Math.min(GAME_CONFIG.MAX_LEVEL, Math.floor(Math.sqrt(this.progress.xp / 100)) + 1);
    
    const leveledUp = this.progress.level > oldLevel;
    const newAchievements = this.checkAchievements(session);
    
    this.progress.lastPlayDate = new Date().toISOString();
    this.saveProgress();
    
    return { leveledUp, newAchievements };
  }

  private checkAchievements(session: SessionStats): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    ACHIEVEMENTS.forEach(ach => {
      if (!this.progress.unlockedAchievements.includes(ach.id)) {
        if (ach.condition(this.progress, session)) {
          this.progress.unlockedAchievements.push(ach.id);
          newlyUnlocked.push(ach);
        }
      }
    });
    return newlyUnlocked;
  }

  public getProgress() {
    return this.progress;
  }
}
