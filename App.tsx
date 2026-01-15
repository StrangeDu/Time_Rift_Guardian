
import React, { useState, useEffect, useRef } from 'react';
import { TimeChallenge } from './services/gameEngine';
import { ProgressionSystem } from './services/progressionSystem';
import { audioService } from './services/audioService';
import { GameState, HistoryQuestion, SessionStats, PlayerProgress } from './types';
import { QuestionDisplay } from './components/QuestionDisplay';
import { AnswerInput } from './components/AnswerInput';
import { GameStats } from './components/GameStats';
import { AchievementList } from './components/AchievementList';
import { RunnerGame } from './components/RunnerGame';
import { GAME_CONFIG, SCHOOL_CREDIT } from './constants';

const engine = new TimeChallenge();
const progression = new ProgressionSystem();

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [currentQuestion, setCurrentQuestion] = useState<HistoryQuestion | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.BASE_TIME);
  const [stats, setStats] = useState<SessionStats>(engine.getSessionStats());
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(progression.getProgress());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [actualYear, setActualYear] = useState<number | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const timerRef = useRef<number | null>(null);

  const startNewGame = () => {
    engine.reset();
    setStats(engine.getSessionStats());
    setGameState(GameState.PLAYING);
    setShowQuestion(false);
    setFeedback(null);
    setActualYear(null);
    audioService.startBGM();
  };

  const handleObstacle = () => {
    const q = engine.getNextQuestion();
    setCurrentQuestion(q);
    setTimeRemaining(GAME_CONFIG.BASE_TIME);
    setShowQuestion(true);
    setFeedback(null);
    setActualYear(null);
  };

  const handleAnswer = (year: number) => {
    if (gameState !== GameState.PLAYING || feedback) return;

    const result = engine.submitAnswer(year);
    setFeedback(result.correct ? 'correct' : 'wrong');
    setActualYear(result.actual);
    
    if (result.correct) {
      audioService.playCoinSound();
    } else {
      audioService.playHurtSound();
    }

    // 答错后直接呈现正确的时间，闪现5遍。设置足够长的展示时间 (3.5s) 容纳5次动画周期。
    const displayDuration = result.correct ? 800 : 3500;

    setTimeout(() => {
      setFeedback(null);
      setActualYear(null);
      if (engine.health <= 0) {
        handleGameOver();
      } else {
        setShowQuestion(false);
        setStats(engine.getSessionStats());
      }
    }, displayDuration);
  };

  const handleGameOver = () => {
    setGameState(GameState.GAMEOVER);
    audioService.stopBGM();
    const result = progression.updateAfterSession(engine.getSessionStats());
    setPlayerProgress(progression.getProgress());
    
    if (result.leveledUp) {
      setLastNotification(`等级提升！当前级别: LV.${progression.getProgress().level}`);
    } else if (result.newAchievements.length > 0) {
      setLastNotification(`达成成就: ${result.newAchievements[0].title}`);
    }
  };

  useEffect(() => {
    if (gameState === GameState.PLAYING && showQuestion && !feedback) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            handleAnswer(-99999);
            return GAME_CONFIG.BASE_TIME;
          }
          return prev - 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, showQuestion, feedback]);

  const backgroundStyle = {
    backgroundImage: currentQuestion ? `linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.98)), url("${currentQuestion.bgImage}")` : 'linear-gradient(rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.96))',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 2.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center text-slate-50 relative overflow-hidden font-sans select-none"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <header className="w-full bg-slate-950/70 backdrop-blur-3xl border-b border-white/5 px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 ring-4 ring-indigo-500/10">
            <span className="text-2xl">🏃</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-white/95 drop-shadow-lg">时间裂缝守护者</h1>
            <p className="text-[10px] text-indigo-400 font-black tracking-[0.2em] uppercase opacity-80">{SCHOOL_CREDIT}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-0.5">时空功勋</p>
            <p className="text-base font-black text-indigo-400 tracking-tighter">LEVEL.{playerProgress.level}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-1 ring-2 ring-white/5">
             <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${playerProgress.xp}`} alt="avatar" className="w-full h-full rounded-xl" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center p-8 z-10">
        {gameState === GameState.START && (
          <div className="text-center space-y-12">
            <div className="space-y-8">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="px-8 py-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[11px] font-black tracking-[0.4em] uppercase shadow-lg shadow-indigo-500/5">
                  世界近现代史 · 专项演练
                </div>
                <div className="text-center">
                  <span className="text-white/20 text-[10px] font-black tracking-[0.5em] uppercase block mb-2">Developed By</span>
                  <span className="text-white text-xl font-black tracking-[0.25em] drop-shadow-md">{SCHOOL_CREDIT}</span>
                </div>
              </div>
              
              <h2 className="text-8xl md:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] leading-[0.9]">
                时空<br/><span className="text-indigo-500">疾走</span>
              </h2>
              
              <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed tracking-widest bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl">
                穿越历史裂缝，守护真实时间线。<br/>
                奔跑中定位关键坐标，获取时空币奖励。
              </p>
            </div>
            
            <button 
              onClick={startNewGame}
              className="group relative px-24 py-7 bg-indigo-600 text-white font-black text-2xl rounded-full shadow-[0_20px_70px_rgba(79,70,229,0.5)] transition-all hover:scale-110 active:scale-95 overflow-hidden ring-8 ring-indigo-500/20"
            >
              <span className="relative z-10 tracking-[0.4em] ml-[0.4em]">启动疾走</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-indigo-950 font-black tracking-widest">ENTER RIFT</span>
            </button>

            <AchievementList progress={playerProgress} />
          </div>
        )}

        {gameState === GameState.PLAYING && (
          <div className="w-full flex flex-col items-center gap-0 animate-in fade-in zoom-in-95 duration-1000">
            <GameStats stats={stats} />
            
            <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transition-all duration-700">
              <RunnerGame 
                isRunning={gameState === GameState.PLAYING} 
                isPaused={showQuestion} 
                isHurt={feedback === 'wrong'}
                onObstacleReached={handleObstacle}
                coinsCount={stats.coins}
              />
              
              <div className="p-10 min-h-[460px] flex items-center justify-center relative bg-gradient-to-b from-transparent to-indigo-950/10">
                {!showQuestion ? (
                  <div className="text-center space-y-6 py-24 animate-pulse">
                    <p className="text-white/15 font-black tracking-[1.2em] uppercase text-3xl">穿梭中...</p>
                    <p className="text-indigo-400/50 text-xs font-black tracking-[0.4em] uppercase">前方有极高浓度的历史波动</p>
                  </div>
                ) : (
                  currentQuestion && (
                    <div className="w-full flex flex-col items-center gap-10 animate-in slide-in-from-bottom-16 duration-600">
                      <QuestionDisplay 
                        question={currentQuestion} 
                        timeRemaining={timeRemaining}
                        totalTime={GAME_CONFIG.BASE_TIME} 
                      />
                      <div className="relative w-full max-w-md">
                        <AnswerInput 
                          onSubmit={handleAnswer} 
                          combo={stats.combo}
                          feedback={feedback}
                        />
                        
                        {/* 仅在答错且有正确年份时，闪现正确答案 */}
                        {feedback === 'wrong' && actualYear !== null && (
                          <div className="absolute -bottom-36 inset-x-0 text-center z-50">
                            <div className="inline-block px-16 py-8 bg-red-600 text-white font-black rounded-[4rem] shadow-[0_0_80px_rgba(220,38,38,0.8)] border-4 border-red-400 animate-flash-5">
                              <p className="text-[14px] text-red-100 uppercase mb-3 tracking-[0.5em] font-black opacity-90 underline decoration-red-300 underline-offset-8">
                                正确时间节点
                              </p>
                              <p className="text-6xl tracking-tighter drop-shadow-2xl">
                                {actualYear > 0 ? actualYear : `公元前 ${Math.abs(actualYear)}`} 年
                              </p>
                              <div className="flex justify-center gap-2 mt-4 opacity-40">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white animate-pulse" style={{animationDelay: `${i*0.1}s`}}></div>)}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {feedback === 'correct' && (
                          <div className="absolute -bottom-16 inset-x-0 text-center text-green-400 font-black animate-bounce text-2xl tracking-[0.2em] drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                            轨道重合 · 记录成功! ✨
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === GameState.GAMEOVER && (
          <div className="text-center space-y-12 animate-in fade-in slide-in-from-top-8 duration-800">
            <h2 className="text-8xl font-black text-white/95 italic tracking-tighter uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">守护任务终结</h2>

            <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-16 max-w-xl mx-auto space-y-12 shadow-[0_50px_120px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">最终评分</p>
                  <p className="text-4xl font-mono font-black text-white">{stats.score}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">连击峰值</p>
                  <p className="text-4xl font-mono font-black text-indigo-400">{stats.maxCombo}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">收集币</p>
                  <p className="text-4xl font-mono font-black text-yellow-400">💰 {stats.coins}</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="flex justify-between text-[12px] font-black uppercase text-white/50 tracking-[0.3em]">
                  <span>时空同步程度</span>
                  <span className="text-indigo-400">{playerProgress.xp % 100}%</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden ring-1 ring-white/10 p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-[1.5s] rounded-full"
                    style={{ width: `${(playerProgress.xp % 100)}%` }}
                  />
                </div>
              </div>

              {lastNotification && (
                <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-[3rem] text-indigo-300 text-base font-black tracking-widest uppercase animate-pulse shadow-inner">
                  {lastNotification}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button 
                onClick={startNewGame}
                className="px-20 py-7 bg-white text-indigo-950 font-black rounded-full transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 text-xl tracking-widest"
              >
                再次进入裂缝
              </button>
              <button 
                onClick={() => setGameState(GameState.START)}
                className="px-20 py-7 bg-white/5 hover:bg-white/10 text-white font-black rounded-full transition-all border border-white/10 backdrop-blur-xl text-xl tracking-widest"
              >
                返回指挥部
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-16 text-center z-10">
        <p className="text-white/10 text-[11px] font-black uppercase tracking-[0.8em] mb-4 opacity-50">
          CHENGDU NO.7 EAST SCHOOL // HISTORY ARCHIVE // STABLE
        </p>
        <div className="flex flex-col items-center gap-2">
          <span className="text-indigo-400/30 text-[11px] font-black tracking-[0.4em] uppercase">学术指导与出品</span>
          <span className="text-indigo-400/70 text-base font-black tracking-[0.5em] uppercase drop-shadow-sm">{SCHOOL_CREDIT}</span>
        </div>
      </footer>

      <style>{`
        @keyframes flash-5 {
          0%, 14%, 28%, 42%, 56%, 70%, 100% { opacity: 1; transform: scale(1); }
          7%, 21%, 35%, 49%, 63% { opacity: 0.1; transform: scale(0.92); }
        }
        .animate-flash-5 {
          /* 3.5s total display duration / 5 cycles = 0.7s per cycle. */
          animation: flash-5 0.7s ease-in-out 5;
        }
      `}</style>
    </div>
  );
};

export default App;
