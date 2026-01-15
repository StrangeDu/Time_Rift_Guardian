
import React from 'react';
import { PlayerProgress, Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementListProps {
  progress: PlayerProgress;
}

export const AchievementList: React.FC<AchievementListProps> = ({ progress }) => {
  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">成就馆</h3>
        <span className="text-sm text-slate-400">
          已解锁: {progress.unlockedAchievements.length} / {ACHIEVEMENTS.length}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = progress.unlockedAchievements.includes(ach.id);
          return (
            <div 
              key={ach.id}
              className={`p-4 rounded-xl border text-center transition-all ${
                isUnlocked 
                  ? 'bg-slate-800 border-yellow-500 shadow-lg shadow-yellow-900/20' 
                  : 'bg-slate-900 border-slate-800 grayscale opacity-40'
              }`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <p className="text-xs font-bold text-slate-200 truncate">{ach.title}</p>
              {isUnlocked && <p className="text-[10px] text-slate-400 mt-1">{ach.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
