
import React, { useEffect, useState, useRef } from 'react';

interface RunnerGameProps {
  isRunning: boolean;
  isPaused: boolean; 
  isHurt: boolean;
  onObstacleReached: () => void;
  coinsCount: number;
}

export const RunnerGame: React.FC<RunnerGameProps> = ({ isRunning, isPaused, isHurt, onObstacleReached, coinsCount }) => {
  const [distance, setDistance] = useState(0);
  const [characterFrame, setCharacterFrame] = useState(0);
  const [showCoin, setShowCoin] = useState(false);
  const lastTimeRef = useRef<number>(0);
  const nextObstacleRef = useRef<number>(600);
  const prevCoinsRef = useRef(coinsCount);

  // 金币奖励动画逻辑
  useEffect(() => {
    if (coinsCount > prevCoinsRef.current) {
      setShowCoin(true);
      const timer = setTimeout(() => setShowCoin(false), 1200);
      prevCoinsRef.current = coinsCount;
      return () => clearTimeout(timer);
    }
    prevCoinsRef.current = coinsCount;
  }, [coinsCount]);

  useEffect(() => {
    let animationFrameId: number;
    const animate = (time: number) => {
      if (!isRunning) {
        lastTimeRef.current = time;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = time - (lastTimeRef.current || time);
      lastTimeRef.current = time;

      // 核心要求：答题时小人也要动。
      // distance 持续增加，背景向左滚动，营造向右奔跑的视觉效果。
      setDistance(prev => {
        const speed = isPaused ? 0.08 : 0.35; // 答题时减速但不停下
        const nextDist = prev + speed * deltaTime;
        if (nextDist >= nextObstacleRef.current) {
          onObstacleReached();
          nextObstacleRef.current += 1500; 
        }
        return nextDist;
      });

      // 动作帧率更新
      const frameRate = isPaused ? 180 : 80;
      if (Math.floor(time / frameRate) % 4 !== characterFrame) {
        setCharacterFrame(Math.floor(time / frameRate) % 4);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, isPaused, onObstacleReached, characterFrame]);

  return (
    <div className="relative w-full h-40 md:h-56 overflow-hidden bg-slate-900/80 rounded-t-[2rem] md:rounded-t-[3rem] border-x border-t border-white/10 shadow-inner transition-all duration-300">
      
      {/* 远景层：星空 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #818cf8 1.5px, transparent 1.5px)',
          backgroundSize: '120px 120px',
          transform: `translateX(${-distance * 0.1 % 120}px)`
        }}
      />

      {/* 速度线：只在快速奔跑时显示 */}
      {!isHurt && !isPaused && isRunning && (
        <div className="absolute inset-0 pointer-events-none">
          {[1,2,3,4,5,6].map(i => (
            <div 
              key={i} 
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-speed-line" 
              style={{
                top: `${i * 15}%`,
                width: `${60 + i * 15}px`,
                animationDelay: `${i * 0.1}s`,
                left: '110%'
              }}
            />
          ))}
        </div>
      )}

      {/* 地面：从右往左滚，模拟向右跑 */}
      <div className="absolute bottom-0 w-full h-10 md:h-14 bg-slate-800/90 border-t-4 border-indigo-500/50">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #6366f1 0px, #6366f1 2px, transparent 2px, transparent 80px)',
            transform: `translateX(${-distance % 80}px)`
          }}
        />
      </div>

      {/* 角色：固定在左侧区域，面向右侧 */}
      <div 
        className={`absolute bottom-8 md:bottom-12 left-12 md:left-24 transition-all duration-300 z-30`}
        style={{ 
          transform: `scale(${isHurt ? 1.5 : 1})`,
        }}
      >
        <div className="relative">
           {/* 核心修正：使用 scaleX(-1) 将默认向左的跑步 Emoji 水平翻转，使其向右跑 */}
           <span className="text-6xl md:text-7xl select-none block drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" style={{ transform: 'scaleX(-1)' }}>
             {isHurt ? '🤕' : isPaused ? '🏃' : ['🏃', '🏃‍♂️', '🏃', '🏃‍♀️'][characterFrame]}
           </span>
           
           {!isHurt && !isPaused && (
             <div className="absolute -bottom-1 -left-6 w-8 h-4 bg-white/10 rounded-full blur-md animate-ping" />
           )}
           
           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/60 blur-md rounded-full" />

           {/* 金币奖励特效 */}
           {showCoin && (
             <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-5xl animate-coin-pop flex flex-col items-center">
               <span className="drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">💰</span>
               <span className="text-yellow-400 font-black text-xl">+COINS</span>
             </div>
           )}
        </div>
      </div>

      {/* 时空裂缝：从右侧飞来 */}
      <div 
        className="absolute bottom-10 md:bottom-14 right-0 w-20 md:w-28 h-32 md:h-44 flex flex-col items-center justify-center transition-all duration-300"
        style={{ 
          transform: `translateX(${(nextObstacleRef.current - distance - 500) * 2.8}px)`,
          opacity: Math.min(1, Math.max(0, 2 - Math.abs(nextObstacleRef.current - distance) / 600))
        }}
      >
        <div className="w-12 h-full bg-gradient-to-t from-red-600 via-indigo-600 to-transparent blur-3xl animate-pulse rounded-full opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-5xl md:text-6xl animate-bounce-slow drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">🧿</span>
        </div>
      </div>
      
      {/* 顶部 HUD */}
      <div className="absolute top-4 left-4 md:top-6 md:left-8 flex gap-2 md:gap-4">
        <div className="bg-black/70 backdrop-blur-xl px-3 py-1.5 md:px-5 md:py-2.5 rounded-2xl border border-white/10 flex items-center gap-2 md:gap-3 shadow-2xl ring-1 ring-white/5">
          <span className="text-[9px] md:text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase">深度</span>
          <span className="text-sm md:text-base font-mono font-black text-white">{Math.floor(distance)}<span className="text-[10px] ml-0.5 opacity-50">M</span></span>
        </div>
        <div className="bg-yellow-600/20 backdrop-blur-xl px-3 py-1.5 md:px-5 md:py-2.5 rounded-2xl border border-yellow-500/30 flex items-center gap-2 md:gap-3 shadow-2xl ring-1 ring-yellow-500/10">
          <span className="text-[9px] md:text-[10px] font-black text-yellow-500 tracking-[0.2em] uppercase">收纳</span>
          <span className="text-sm md:text-base font-mono font-black text-yellow-400">💰 {coinsCount}</span>
        </div>
      </div>

      <style>{`
        @keyframes speed-line {
          from { transform: translateX(0); }
          to { transform: translateX(-2500px); }
        }
        .animate-speed-line {
          animation: speed-line 0.4s linear infinite;
        }
        @keyframes coin-pop {
          0% { transform: translate(-50%, 20px) scale(0); opacity: 0; }
          20% { transform: translate(-50%, -40px) scale(1.4); opacity: 1; }
          100% { transform: translate(-50%, -150px) scale(0.8); opacity: 0; }
        }
        .animate-coin-pop {
          animation: coin-pop 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
