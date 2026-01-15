
import { HISTORY_DATA, GAME_CONFIG } from '../constants';
import { HistoryQuestion, SessionStats } from '../types';

export class TimeChallenge {
  public score: number = 0;
  public coins: number = 0;
  public timeRemaining: number = GAME_CONFIG.BASE_TIME;
  public combo: number = 0;
  public maxCombo: number = 0;
  public level: number = 1;
  public health: number = GAME_CONFIG.INITIAL_HEALTH;
  public totalTimeSpent: number = 0;
  public questionsAnswered: number = 0;
  
  private currentQuestion: HistoryQuestion | null = null;
  private answeredIds: Set<string> = new Set();

  constructor() {
    this.reset();
  }

  public reset() {
    this.score = 0;
    this.coins = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.level = 1;
    this.health = GAME_CONFIG.INITIAL_HEALTH;
    this.questionsAnswered = 0;
    this.totalTimeSpent = 0;
    this.answeredIds.clear();
  }

  public startChallenge() {
    this.reset();
    return this.getNextQuestion();
  }

  public getNextQuestion(): HistoryQuestion | null {
    const available = HISTORY_DATA.filter(q => !this.answeredIds.has(q.id));
    if (available.length === 0) {
      this.answeredIds.clear();
      return this.getNextQuestion();
    }
    const randomIndex = Math.floor(Math.random() * available.length);
    this.currentQuestion = available[randomIndex];
    this.timeRemaining = GAME_CONFIG.BASE_TIME;
    return this.currentQuestion;
  }

  public submitAnswer(userYear: number): { correct: boolean, actual: number, points: number, coinsEarned: number } {
    if (!this.currentQuestion) throw new Error("无活跃题目");
    const isCorrect = userYear === this.currentQuestion.year;
    let points = 0;
    let coinsEarned = 0;

    if (isCorrect) {
      this.answeredIds.add(this.currentQuestion.id);
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      points = this.calculatePoints(true, this.timeRemaining, this.combo);
      coinsEarned = 10 + Math.floor(this.combo * 2);
      this.score += points;
      this.coins += coinsEarned;
      this.questionsAnswered++;
      this.totalTimeSpent += (GAME_CONFIG.BASE_TIME - this.timeRemaining);
    } else {
      this.combo = 0;
      this.health -= 1;
      this.questionsAnswered++;
      this.totalTimeSpent += GAME_CONFIG.BASE_TIME;
    }

    return { correct: isCorrect, actual: this.currentQuestion.year, points, coinsEarned };
  }

  public calculatePoints(correct: boolean, timeLeft: number, combo: number): number {
    if (!correct) return 0;
    const base = GAME_CONFIG.BASE_SCORE;
    const timeBonus = Math.floor(timeLeft) * GAME_CONFIG.TIME_BONUS_RATE;
    const comboMultiplier = 1 + (combo - 1) * GAME_CONFIG.COMBO_BONUS_RATE;
    return Math.floor((base + timeBonus) * comboMultiplier);
  }

  public getSessionStats(): SessionStats {
    return {
      score: this.score,
      coins: this.coins,
      combo: this.combo,
      maxCombo: this.maxCombo,
      health: this.health,
      level: this.level,
      questionsAnswered: this.questionsAnswered,
      averageTime: this.questionsAnswered > 0 ? this.totalTimeSpent / this.questionsAnswered : 0
    };
  }
}
