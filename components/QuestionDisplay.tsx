
import React from 'react';
import { HistoryQuestion } from '../types';

interface QuestionDisplayProps {
  question: HistoryQuestion;
  timeRemaining: number;
  totalTime: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, timeRemaining, totalTime }) => {
  const progress = (timeRemaining / totalTime) * 100;
  const isUrgent = timeRemaining < 5;

  // 难度汉化映射
  const difficultyMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };

  return (
    <div className={`relative w-full max-w-lg bg-white/5 backdrop-blur-2xl rounded-2xl p-3 border border-white/20 shadow-lg transition-all duration-500 ${isUrgent ? 'ring-2 ring-red-500/50' : ''}`}>
      
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2 items-center">
          <span className="px-2 py-0.5 bg-white/10 text-white text-[9px] rounded-md font-black uppercase tracking-wider border border-white/10">
            {question.era}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider border border-white/10 ${
             question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
             question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
             'bg-purple-500/20 text-purple-400'
           }`}>
             {difficultyMap[question.difficulty]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-xs font-mono font-black ${isUrgent ? 'text-red-500' : 'text-blue-400'}`}>
            {timeRemaining.toFixed(1)}s
          </span>
        </div>
      </div>

      <div className="space-y-1 text-center py-1">
        <h2 className="text-lg md:text-2xl font-black leading-tight text-white drop-shadow-sm flex items-center justify-center min-h-[3rem]">
          {question.event}
        </h2>
        
        <div className="flex flex-col items-center gap-1 opacity-40">
           <div className="h-0.5 w-6 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
