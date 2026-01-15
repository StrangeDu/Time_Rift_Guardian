
import React from 'react';
import { SessionStats } from '../types';

interface GameStatsProps {
  stats: SessionStats;
}

export const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-5 gap-3 px-4 py-6">
      <div className="bg-slate-900/80 p-4 rounded-3xl border border-white/5 backdrop-blur-xl shadow-xl">
        <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-1">修正分数</p>
        <p className="text-xl font-mono font-black text-white">{stats.score.toLocaleString()}</p>
      </div>

      <div className="bg-slate-900/80 p-4 rounded-3xl border border-white/5 backdrop-blur-xl shadow-xl">
        <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-1">时空币</p>
        <p className="text-xl font-mono font-black text-yellow-400">💰 {stats.coins}</p>
      </div>

      <div className="bg-slate-900/80 p-4 rounded-3xl border border-white/5 backdrop-blur-xl shadow-xl">
        <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-1">守护值</p>
        <div className="flex gap-1.5 mt-1">
          {[1, 2, 3].map(i => (
            <span key={i} className={`text-lg transition-all duration-300 ${i <= stats.health ? 'grayscale-0 scale-100' : 'grayscale opacity-20 scale-75'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 p-4 rounded-3xl border border-white/5 backdrop-blur-xl shadow-xl">
        <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-1">极限连击</p>
        <p className="text-xl font-mono font-black text-indigo-400">{stats.combo}</p>
      </div>

      <div className="bg-slate-900/80 p-4 rounded-3xl border border-white/5 backdrop-blur-xl shadow-xl">
        <p className="text-white/40 text-[9px] uppercase font-black tracking-widest mb-1">断层进度</p>
        <p className="text-xl font-mono font-black text-purple-400">Node.{stats.questionsAnswered + 1}</p>
      </div>
    </div>
  );
};
