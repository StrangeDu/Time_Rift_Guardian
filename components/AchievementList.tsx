
import React from 'react';
import { PlayerProgress } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementListProps {
  progress: PlayerProgress;
}

export const AchievementList: React.FC<AchievementListProps> = ({ progress }) => {
  return (
    <div className="w-full max-w-xs px-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">成就馆</h3>
        <span className="text-[10px] text-slate-600 font-mono">
          {progress.unlockedAchievements.length}/{ACHIEVEMENTS.length}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = progress.unlockedAchievements.includes(ach.id);
          return (
            <div 
              key={ach.id}
              className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                isUnlocked 
                  ? 'bg-slate-800/80 border-yellow-500/30 shadow-sm' 
                  : 'bg-slate-900/40 border-slate-800/50 grayscale opacity-30'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/20 text-lg shrink-0">
                {ach.icon}
              </div>
              <span className={`text-[10px] font-bold leading-tight ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                {ach.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
