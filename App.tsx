
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

  const handleShare = async () => {
    const shareData = {
      title: '时间裂缝守护者',
      text: `我在历史时间裂缝中坚持到了 LV.${playerProgress.level}，获得了 ${stats.score} 分！快来挑战我吧！`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setLastNotification('链接已复制到剪贴板！快去粘贴分享吧！');
        setTimeout(() => setLastNotification(null), 3000);
      }
    } catch (err) {
      console.log('分享已取消');
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
      className="h-[100dvh] flex flex-col items-center text-slate-50 relative overflow-hidden font-sans select-none"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <header className="w-full bg-slate-950/70 backdrop-blur-3xl border-b border-white/5 px-4 py-2 flex justify-between items-center sticky top-0 z-50 shrink-0 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-lg">🏃</span>
          </div>
          <div>
            {/* 恢复标题 */}
            <h1 className="text-xs md:text-sm font-black tracking-wide text-white/95">时间守护者</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">LV.{playerProgress.level}</p>
          </div>
          <div className="w-8 h-8 rounded-lg border border-white/10 bg-slate-900 shadow-lg p-0.5">
             <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${playerProgress.xp}`} alt="avatar" className="w-full h-full rounded-md" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-start p-3 z-10 overflow-hidden">
        {gameState === GameState.START && (
          <div className="w-full h-full flex flex-col items-center justify-between py-6 md:py-8">
            
            <div className="space-y-4 text-center mt-4">
               {/* 这里的 pill 改为 "世界近现代史 · 专项演练" */}
              <div className="inline-flex flex-col items-center gap-2">
                <div className="px-5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-black tracking-[0.2em] uppercase">
                  世界近现代史 · 专项演练
                </div>
                <span className="text-white/40 text-[9px] font-black tracking-[0.2em]">{SCHOOL_CREDIT}</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-[0.9]">
                时空<br/><span className="text-indigo-500">疾走</span>
              </h2>
              
              <p className="text-slate-400 max-w-xs mx-auto text-xs leading-relaxed tracking-wider bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                穿越历史裂缝，守护真实时间线。<br/>
                定位关键坐标，获取时空币。
              </p>
            </div>
            
            <button 
              onClick={startNewGame}
              className="group relative px-16 py-5 bg-indigo-600 text-white font-black text-xl rounded-full shadow-[0_15px_50px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 overflow-hidden ring-4 ring-indigo-500/20"
            >
              <span className="relative z-10 tracking-[0.3em] ml-1">启动疾走</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>

            {/* 成就列表容器 */}
            <div className="w-full flex justify-center pb-4">
               <AchievementList progress={playerProgress} />
            </div>
          </div>
        )}

        {gameState === GameState.PLAYING && (
          <div className="w-full h-full flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
            <GameStats stats={stats} />
            
            <div className="flex-1 w-full bg-slate-900/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              <RunnerGame 
                isRunning={gameState === GameState.PLAYING} 
                isPaused={showQuestion} 
                isHurt={feedback === 'wrong'}
                onObstacleReached={handleObstacle}
                coinsCount={stats.coins}
              />
              
              <div className="flex-1 relative bg-gradient-to-b from-transparent to-indigo-950/10 flex items-center justify-center p-2">
                {!showQuestion ? (
                  <div className="text-center space-y-2 animate-pulse mb-8">
                    <p className="text-white/15 font-black tracking-[0.8em] uppercase text-2xl">穿梭中...</p>
                  </div>
                ) : (
                  currentQuestion && (
                    <div className="w-full flex flex-col items-center gap-4 animate-in slide-in-from-bottom-8 duration-500 px-1">
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
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === GameState.GAMEOVER && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-6 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-5xl font-black text-white/95 italic tracking-tighter uppercase drop-shadow-xl">任务终结</h2>
             
             <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 space-y-6 shadow-2xl">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">评分</p>
                  <p className="text-3xl font-mono font-black text-white">{stats.score}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">连击</p>
                  <p className="text-3xl font-mono font-black text-indigo-400">{stats.maxCombo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">收集</p>
                  <p className="text-3xl font-mono font-black text-yellow-400">{stats.coins}</p>
                </div>
              </div>
              
              {lastNotification && (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs font-black tracking-widest uppercase text-center">
                  {lastNotification}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 justify-center items-center w-full max-w-sm">
               <button 
                  onClick={startNewGame}
                  className="w-full py-4 bg-white text-indigo-950 font-black rounded-2xl shadow-lg active:scale-95 text-lg tracking-widest transition-transform"
                >
                  再次进入
                </button>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setGameState(GameState.START)}
                  className="flex-1 py-3 bg-white/5 text-white font-black rounded-xl border border-white/10 text-sm tracking-widest active:scale-95 transition-transform"
                >
                  返回
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 py-3 bg-green-600/20 text-green-400 font-black rounded-xl border border-green-500/30 text-sm tracking-widest flex items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <span>🚀</span> 分享
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {feedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-4">
           {feedback === 'wrong' && actualYear !== null && (
              // 移除了 animate-flash-5，改为 animate-in fade-in zoom-in
              <div className="inline-block px-8 py-6 bg-red-600 text-white font-black rounded-[2rem] shadow-[0_0_80px_rgba(220,38,38,0.9)] border-4 border-red-400 animate-in fade-in zoom-in duration-300 backdrop-blur-md">
                <p className="text-[10px] text-red-100 uppercase mb-2 tracking-[0.4em] font-black text-center">
                  正确时间节点
                </p>
                <p className="text-5xl tracking-tighter drop-shadow-2xl text-center">
                  {actualYear > 0 ? actualYear : `公元前 ${Math.abs(actualYear)}`}
                </p>
              </div>
           )}
           
           {feedback === 'correct' && (
              <div className="px-8 py-4 bg-green-500/90 text-white font-black rounded-full shadow-[0_0_50px_rgba(34,197,94,0.6)] backdrop-blur-md animate-bounce text-2xl tracking-[0.2em] border border-green-300">
                记录成功! ✨
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default App;
