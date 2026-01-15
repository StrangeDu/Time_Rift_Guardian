
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
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`flex items-center gap-2 p-1 bg-slate-800 rounded-xl border-2 transition-all duration-200 ${
          feedback === 'correct' ? 'border-green-500 bg-green-900/20' : 
          feedback === 'wrong' ? 'border-red-500 animate-shake bg-red-900/20' : 
          'border-slate-700 group-focus-within:border-blue-500'
        }`}>
          <button
            type="button"
            onClick={() => setIsBC(!isBC)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              isBC ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {isBC ? '公元前' : '公元后'}
          </button>
          <input
            ref={inputRef}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="输入年份..."
            className="flex-1 bg-transparent border-none outline-none text-2xl font-mono text-center placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={!value}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg font-bold transition-all"
          >
            提交
          </button>
        </div>

        {combo > 1 && (
          <div className="absolute -top-12 right-0 animate-bounce">
            <span className="text-3xl font-black text-yellow-400 italic drop-shadow-lg">
              {combo} COMBO!
            </span>
          </div>
        )}
      </form>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
          <button
            key={n}
            onClick={() => setValue(prev => prev + n)}
            className="h-12 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-xl active:scale-95 transition-all"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setValue('')}
          className="col-span-2 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm"
        >
          清除
        </button>
        <button
          onClick={() => setValue(prev => prev.slice(0, -1))}
          className="col-span-3 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm"
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
