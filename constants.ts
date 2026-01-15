
import { HistoryQuestion, Achievement } from './types';

export const SCHOOL_CREDIT = "成都七中东部学校历史组";

// 严格按照近现代世界史时间表出题，确保问法符合教材习惯
export const HISTORY_DATA: HistoryQuestion[] = [
  { id: 'w1', event: '英国“光荣革命”', year: 1688, difficulty: 'medium', era: '近代史', theme: 'revolution', bgImage: 'https://images.unsplash.com/photo-1547983331-f24224f6f415?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w2', event: '美国《独立宣言》发表', year: 1776, difficulty: 'easy', era: '近代史', theme: 'revolution', bgImage: 'https://images.unsplash.com/photo-1550985543-4982f671932f?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w3', event: '法国大革命爆发', year: 1789, difficulty: 'easy', era: '近代史', theme: 'revolution', bgImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w4', event: '瓦特改良蒸汽机', year: 1785, difficulty: 'medium', era: '近代史', theme: 'steam', bgImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w5', event: '《共产党宣言》发表', year: 1848, difficulty: 'easy', era: '近代史', theme: 'steam', bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w6', event: '俄国农奴制改革', year: 1861, difficulty: 'medium', era: '近代史', theme: 'steam', bgImage: 'https://images.unsplash.com/photo-1599727488219-da7bd1729007?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w7', event: '美国内战结束', year: 1865, difficulty: 'medium', era: '近代史', theme: 'steam', bgImage: 'https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w8', event: '德意志帝国统一', year: 1871, difficulty: 'hard', era: '近代史', theme: 'steam', bgImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w9', event: '巴黎公社建立', year: 1871, difficulty: 'medium', era: '近代史', theme: 'steam', bgImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w10', event: '第二次工业革命进入高峰', year: 1870, difficulty: 'hard', era: '近代史', theme: 'steam', bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w11', event: '第一次世界大战爆发', year: 1914, difficulty: 'easy', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w12', event: '俄国十月革命', year: 1917, difficulty: 'easy', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1520038410233-7141f77e47aa?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w13', event: '凡尔赛体系形成', year: 1919, difficulty: 'medium', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1503917988258-f19178c1f307?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w14', event: '苏俄新经济政策开始', year: 1921, difficulty: 'medium', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w15', event: '1929年世界经济危机爆发', year: 1929, difficulty: 'easy', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w16', event: '美国罗斯福新政开始', year: 1933, difficulty: 'medium', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1541339905195-06b297229567?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w17', event: '第二次世界大战全面爆发', year: 1939, difficulty: 'easy', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1442115653181-110291703a10?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w18', event: '布雷顿森林体系建立', year: 1944, difficulty: 'hard', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w19', event: '联合国正式成立', year: 1945, difficulty: 'easy', era: '现代史', theme: 'war', bgImage: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w20', event: '杜鲁门主义（冷战开始）', year: 1947, difficulty: 'medium', era: '当代史', theme: 'coldwar', bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w21', event: '北约组织(NATO)成立', year: 1949, difficulty: 'medium', era: '当代史', theme: 'coldwar', bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w22', event: '华约组织建立', year: 1955, difficulty: 'medium', era: '当代史', theme: 'coldwar', bgImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w23', event: '不结盟运动正式形成', year: 1961, difficulty: 'hard', era: '当代史', theme: 'coldwar', bgImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w24', event: '古巴导弹危机', year: 1962, difficulty: 'hard', era: '当代史', theme: 'coldwar', bgImage: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w25', event: '欧洲共同体成立', year: 1967, difficulty: 'hard', era: '当代史', theme: 'coldwar', bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w26', event: '苏联解体', year: 1991, difficulty: 'easy', era: '当代史', theme: 'global', bgImage: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w27', event: '欧洲联盟(EU)成立', year: 1993, difficulty: 'medium', era: '当代史', theme: 'global', bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w28', event: '世界贸易组织(WTO)正式运作', year: 1995, difficulty: 'easy', era: '当代史', theme: 'global', bgImage: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&q=80&w=1600' },
  { id: 'w29', event: '欧元正式进入流通', year: 2002, difficulty: 'hard', era: '当代史', theme: 'global', bgImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1600' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '世界史学徒', description: '累计回答正确10个题目', icon: '🌍', condition: (p) => p.correctCount >= 10 },
  { id: 'a2', title: '冷战观察员', description: '连续答对3道当代史题目', icon: '📡', condition: (_, s) => !!s && s.maxCombo >= 3 },
  { id: 'a3', title: '工业巨头', description: '平均答题时间少于4秒', icon: '⚙️', condition: (_, s) => !!s && s.questionsAnswered >= 5 && s.averageTime < 4 },
  { id: 'a4', title: '完美秩序', description: '满血完成5道题目', icon: '🕊️', condition: (_, s) => !!s && s.health === 3 && s.questionsAnswered >= 5 }
];

export const GAME_CONFIG = {
  BASE_TIME: 15,
  BASE_SCORE: 100,
  TIME_BONUS_RATE: 10,
  COMBO_BONUS_RATE: 0.15,
  INITIAL_HEALTH: 3,
  XP_PER_CORRECT: 25,
  MAX_LEVEL: 100
};
