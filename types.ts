
export interface HistoryQuestion {
  id: string;
  event: string;
  year: number; 
  difficulty: 'easy' | 'medium' | 'hard';
  era: string;
  theme: 'steam' | 'war' | 'coldwar' | 'global' | 'revolution';
  bgImage: string;
}

export interface PlayerProgress {
  level: number;
  xp: number;
  totalAnswered: number;
  correctCount: number;
  maxCombo: number;
  unlockedAchievements: string[];
  lastPlayDate: string;
  totalCoins: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: PlayerProgress, sessionStats?: SessionStats) => boolean;
}

export interface SessionStats {
  score: number;
  combo: number;
  maxCombo: number;
  health: number;
  level: number;
  questionsAnswered: number;
  averageTime: number;
  coins: number;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  LEVEL_UP = 'LEVEL_UP'
}
