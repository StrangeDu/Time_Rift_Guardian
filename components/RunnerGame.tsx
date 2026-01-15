
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

      setDistance(prev => {
        const speed = isPaused ? 0.08 : 0.35; 
        const nextDist = prev + speed * deltaTime;
        if (nextDist >= nextObstacleRef.current) {
          onObstacleReached();
          nextObstacleRef.current += 1500; 
        }
        return nextDist;
      });

      const frameRate = isPaused ? 180 : 80;
      if (Math.floor(time / frameRate) % 4 !== characterFrame) {
        setCharacterFrame(Math.floor(time / frameRate) % 4);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, isPaused, onObstacleReached, characterFrame]);

  // 修改：高度改为 h-28 (112px)
  return (
    <div className="relative w-full h-28 md:h-56 overflow-hidden bg-slate-900/80 border-b border-white/5 transition-all duration-300 shrink-0">
      
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #818cf8 1.5px, transparent 1.5px)',
          backgroundSize: '120px 120px',
          transform: `translateX(${-distance * 0.1 % 120}px)`
        }}
      />

      {!isHurt && !isPaused && isRunning && (
        <div className="absolute inset-0 pointer-events-none">
          {[1,2,3].map(i => (
            <div 
              key={i} 
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-speed-line" 
              style={{
                top: `${i * 25}%`,
                width: `${60 + i * 15}px`,
                animationDelay: `${i * 0.1}s`,
                left: '110%'
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 w-full h-6 md:h-14 bg-slate-800/90 border-t-2 border-indigo-500/50">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #6366f1 0px, #6366f1 2px, transparent 2px, transparent 80px)',
            transform: `translateX(${-distance % 80}px)`
          }}
        />
      </div>

      <div 
        className={`absolute bottom-4 md:bottom-12 left-6 md:left-24 transition-all duration-300 z-30`}
        style={{ 
          transform: `scale(${isHurt ? 1.2 : 0.9})`, // 稍微缩小角色
        }}
      >
        <div className="relative">
           <span className="text-4xl md:text-7xl select-none block drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" style={{ transform: 'scaleX(-1)' }}>
             {isHurt ? '🤕' : isPaused ? '🏃' : ['🏃', '🏃‍♂️', '🏃', '🏃‍♀️'][characterFrame]}
           </span>
           
           {!isHurt && !isPaused && (
             <div className="absolute -bottom-1 -left-4 w-6 h-3 bg-white/10 rounded-full blur-md animate-ping" />
           )}
           
           {showCoin && (
             <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-3xl animate-coin-pop flex flex-col items-center">
               <span className="drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">💰</span>
             </div>
           )}
        </div>
      </div>

      <div 
        className="absolute bottom-6 md:bottom-14 right-0 w-12 md:w-28 h-20 md:h-44 flex flex-col items-center justify-center transition-all duration-300"
        style={{ 
          transform: `translateX(${(nextObstacleRef.current - distance - 500) * 2.8}px)`,
          opacity: Math.min(1, Math.max(0, 2 - Math.abs(nextObstacleRef.current - distance) / 600))
        }}
      >
        <div className="w-8 h-full bg-gradient-to-t from-red-600 via-indigo-600 to-transparent blur-3xl animate-pulse rounded-full opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-3xl md:text-6xl animate-bounce-slow drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">🧿</span>
        </div>
      </div>
      
      <div className="absolute top-2 left-2 flex gap-2">
        <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1">
          <span className="text-[8px] font-black text-indigo-400 tracking-wider">DIST</span>
          <span className="text-[10px] font-mono font-black text-white">{Math.floor(distance)}m</span>
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
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
