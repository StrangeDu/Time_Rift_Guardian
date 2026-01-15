
import React, { useState, useRef, useEffect } from 'react';

interface AnswerInputProps {
  onSubmit: (year: number) => void;
  combo: number;
  feedback: 'correct' | 'wrong' | null;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, combo, feedback }) => {
  const [value, setValue] = useState('');
  const [isBC, setIsBC] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const num = parseInt(value);
    if (!isNaN(num)) {
      onSubmit(isBC ? -num : num);
      setValue('');
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [feedback]);

  return (
    <div className="w-full max-w-md space-y-3 md:space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        {/* 添加 px-1 和 overflow-hidden 保护 */}
        <div className={`flex items-center gap-1 p-1 bg-slate-800 rounded-xl border-2 transition-all duration-200 w-full overflow-hidden ${
          feedback === 'correct' ? 'border-green-500 bg-green-900/20' : 
          feedback === 'wrong' ? 'border-red-500 animate-shake bg-red-900/20' : 
          'border-slate-700 focus-within:border-blue-500'
        }`}>
          <button
            type="button"
            onClick={() => setIsBC(!isBC)}
            className={`px-2 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 whitespace-nowrap ${
              isBC ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {isBC ? '公元前' : '公元后'}
          </button>
          
          {/* 添加 min-w-0 确保 flex-1 能正确压缩输入框，防止按钮溢出 */}
          <input
            ref={inputRef}
            type="text"
            inputMode="none" 
            readOnly
            value={value}
            placeholder="年份"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-2xl font-mono text-center placeholder:text-slate-700 caret-transparent cursor-default select-none h-10"
          />
          
          <button
            type="submit"
            disabled={!value}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg font-bold transition-all shrink-0 text-sm tracking-wider whitespace-nowrap"
          >
            提交
          </button>
        </div>

        {combo > 1 && (
          <div className="absolute -top-10 right-0 animate-bounce pointer-events-none z-10">
            <span className="text-xl font-black text-yellow-400 italic drop-shadow-lg">
              {combo} COMBO!
            </span>
          </div>
        )}
      </form>

      <div className="grid grid-cols-5 gap-1.5 select-none touch-manipulation pb-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
          <button
            key={n}
            onClick={() => setValue(prev => prev.length < 5 ? prev + n : prev)}
            className="h-12 bg-slate-800 active:bg-slate-600 rounded-lg font-bold text-xl transition-all shadow-sm active:scale-95 border-b-2 border-slate-950 active:border-b-0 active:translate-y-[2px]"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setValue('')}
          className="col-span-2 h-12 bg-slate-700 active:bg-slate-600 rounded-lg font-bold text-sm text-slate-300 shadow-sm active:scale-95 border-b-2 border-slate-900 active:border-b-0 active:translate-y-[2px] tracking-widest"
        >
          清除
        </button>
        <button
          onClick={() => setValue(prev => prev.slice(0, -1))}
          className="col-span-3 h-12 bg-slate-700 active:bg-slate-600 rounded-lg font-bold text-sm text-slate-300 shadow-sm active:scale-95 border-b-2 border-slate-900 active:border-b-0 active:translate-y-[2px] tracking-widest"
        >
          退格
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};
