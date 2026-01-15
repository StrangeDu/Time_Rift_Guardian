
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

  return (
    <div className={`relative w-full max-w-lg bg-white/5 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 ${isUrgent ? 'ring-2 ring-red-500/50' : ''}`}>
      
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white/10 text-white text-[10px] rounded-full font-black uppercase tracking-[0.2em] border border-white/10 shrink-0">
          {question.era}
        </span>
        <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end">
          <span className={`text-base md:text-lg font-mono font-black ${isUrgent ? 'text-red-500' : 'text-blue-400'}`}>
            {timeRemaining.toFixed(1)}s
          </span>
          <div className="w-20 md:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ${isUrgent ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 text-center mb-4">
        {/* 移动端 text-2xl，桌面端 text-4xl，防止文字过大撑破屏幕 */}
        <h2 className="text-2xl md:text-4xl font-black leading-snug tracking-tight text-white drop-shadow-sm min-h-[3.5rem] flex items-center justify-center">
          {question.event}
        </h2>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/40 text-xs md:text-sm font-medium tracking-widest uppercase">
            请输入此事件发生的年份
          </p>
          <div className="h-px w-12 bg-white/20"></div>
        </div>
      </div>

      <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-max">
         <span className={`px-3 py-0.5 md:px-4 md:py-1 rounded-full text-[9px] md:text-[10px] font-black tracking-widest border border-white/10 shadow-lg ${
           question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
           question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
           'bg-purple-500/20 text-purple-400'
         }`}>
           难度: {question.difficulty.toUpperCase()}
         </span>
      </div>
    </div>
  );
};
