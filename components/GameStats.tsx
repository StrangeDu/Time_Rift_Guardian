
import React from 'react';
import { SessionStats } from '../types';

interface GameStatsProps {
  stats: SessionStats;
}

export const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  return (
    // 使用 flex-nowrap + overflow-x-auto 实现单行横向滚动
    // h-14 固定高度确保不占用额外空间
    <div className="w-full max-w-4xl flex gap-2 px-0 overflow-x-auto no-scrollbar py-1 shrink-0">
      
      <div className="min-w-[5rem] bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col justify-center shrink-0">
        <p className="text-white/40 text-[8px] uppercase font-black tracking-widest">分数</p>
        <p className="text-sm font-mono font-black text-white leading-none">{stats.score}</p>
      </div>

      <div className="min-w-[5rem] bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col justify-center shrink-0">
        <p className="text-white/40 text-[8px] uppercase font-black tracking-widest">金币</p>
        <p className="text-sm font-mono font-black text-yellow-400 leading-none">💰{stats.coins}</p>
      </div>

      <div className="min-w-[6rem] bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col justify-center shrink-0">
        <p className="text-white/40 text-[8px] uppercase font-black tracking-widest mb-0.5">生命值</p>
        <div className="flex gap-0.5">
          {[1, 2, 3].map(i => (
            <span key={i} className={`text-xs transition-all ${i <= stats.health ? 'grayscale-0' : 'grayscale opacity-20'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      <div className="min-w-[4rem] bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col justify-center shrink-0">
        <p className="text-white/40 text-[8px] uppercase font-black tracking-widest">连击</p>
        <p className="text-sm font-mono font-black text-indigo-400 leading-none">{stats.combo}</p>
      </div>

      <div className="min-w-[5rem] bg-slate-900/60 px-3 py-1.5 rounded-xl border border-white/5 flex flex-col justify-center shrink-0">
        <p className="text-white/40 text-[8px] uppercase font-black tracking-widest">进度</p>
        <p className="text-sm font-mono font-black text-purple-400 leading-none">#{stats.questionsAnswered + 1}</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
