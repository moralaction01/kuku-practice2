import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Kuku Practice App - Educational Multiplication Practice
 * Design: Friendly, child-focused interface with bright colors and smooth interactions
 * Colors: Green (#10B981) primary, Orange (#F59E0B) accent, Blue (#93C5FD) support
 */

type DisplayMode = 'auto' | 'manual';
type SortMode = 'ascending' | 'descending' | 'random';

interface ProblemSet {
  segment: number;
  problems: Array<{ a: number; b: number }>;
}

export default function Home() {
  // State management
  const [selectedSegment, setSelectedSegment] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('manual');
  const [sortMode, setSortMode] = useState<SortMode>('ascending');
  const [speed, setSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Problem state
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [problemSet, setProblemSet] = useState<ProblemSet | null>(null);

  // Generate problem set for selected segment
  useEffect(() => {
    const problems = [];
    for (let i = 1; i <= 9; i++) {
      problems.push({ a: selectedSegment, b: i });
    }

    // Sort based on mode
    if (sortMode === 'descending') {
      problems.reverse();
    } else if (sortMode === 'random') {
      problems.sort(() => Math.random() - 0.5);
    }

    setProblemSet({ segment: selectedSegment, problems });
    setCurrentProblemIndex(0);
    setShowAnswer(false);
  }, [selectedSegment, sortMode]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || displayMode !== 'auto' || !problemSet) return;

    const speedMap: Record<number, number> = {
      0.5: 500,
      1: 1000,
      2: 2000,
      3: 3000,
    };

    const delay = speedMap[speed] || 1000;

    const timer = setTimeout(() => {
      if (showAnswer) {
        // Move to next problem
        if (currentProblemIndex < problemSet.problems.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1);
          setShowAnswer(false);
        } else {
          // End of set
          setIsPlaying(false);
          setCurrentProblemIndex(0);
          setShowAnswer(false);
        }
      } else {
        // Show answer
        setShowAnswer(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, displayMode, currentProblemIndex, showAnswer, problemSet, speed]);

  // Play sound effect
  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // Audio context not available
    }
  };

  // Handlers
  const handleNext = () => {
    if (!problemSet) return;

    if (!showAnswer) {
      setShowAnswer(true);
      playSound(800, 100);
    } else {
      if (currentProblemIndex < problemSet.problems.length - 1) {
        setCurrentProblemIndex(currentProblemIndex + 1);
        setShowAnswer(false);
        playSound(600, 100);
      } else {
        // End of set
        setCurrentProblemIndex(0);
        setShowAnswer(false);
        playSound(1200, 200);
      }
    }
  };

  const handleReset = () => {
    setCurrentProblemIndex(0);
    setShowAnswer(false);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (displayMode === 'manual') return;
    setIsPlaying(!isPlaying);
  };

  if (!problemSet) {
    return <div>Loading...</div>;
  }

  const currentProblem = problemSet.problems[currentProblemIndex];
  const answer = currentProblem.a * currentProblem.b;
  const progress = ((currentProblemIndex + 1) / problemSet.problems.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)' }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black" style={{ fontFamily: 'Fredoka' }}>
                🎯 フラッシュ九九
              </h1>
              <p className="text-green-100 text-sm mt-1">楽しく九九を練習しよう！</p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={20} />
                  <span className="text-sm font-semibold">音あり</span>
                </>
              ) : (
                <>
                  <VolumeX size={20} />
                  <span className="text-sm font-semibold">音なし</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Segment Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka' }}>
                段を選ぶ
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedSegment(num)}
                    className={`kuku-segment-button ${
                      selectedSegment === num
                        ? 'kuku-segment-button-active'
                        : 'kuku-segment-button-inactive'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Mode */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka' }}>
                モード
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="manual"
                    checked={displayMode === 'manual'}
                    onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-700">練習枠（手動）</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="auto"
                    checked={displayMode === 'auto'}
                    onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-700">自動フラッシュ</span>
                </label>
              </div>
            </div>

            {/* Sort Mode */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka' }}>
                表示パターン
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="ascending"
                    checked={sortMode === 'ascending'}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-700">あがり九九</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="descending"
                    checked={sortMode === 'descending'}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-700">さがり九九</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="random"
                    checked={sortMode === 'random'}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-700">ばらばら九九</span>
                </label>
              </div>
            </div>

            {/* Speed Control */}
            {displayMode === 'auto' && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Fredoka' }}>
                  速度
                </h2>
                <div className="space-y-2">
                  {[0.5, 1, 2, 3].map((s) => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="speed"
                        value={s}
                        checked={speed === s}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-4 h-4"
                      />
                      <span className="font-semibold text-gray-700">{s}秒</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Display */}
            <div className="kuku-problem-card">
              <p className="text-gray-600 text-center mb-4 font-semibold">問題</p>
              <div className="kuku-number-display text-green-600">
                {currentProblem.a} × {currentProblem.b}
              </div>
            </div>

            {/* Answer Display */}
            {showAnswer && (
              <div className="kuku-answer-card animate-in fade-in slide-in-from-bottom-4 duration-300">
                <p className="text-gray-600 text-center mb-4 font-semibold">答え</p>
                <div className="kuku-number-display text-orange-500">
                  {answer}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="kuku-progress-bar">
              <div className="kuku-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Status Info */}
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="kuku-badge kuku-badge-info">
                <span className="font-bold">{currentProblemIndex + 1}</span>
                <span>/</span>
                <span className="font-bold">{problemSet.problems.length}</span>
              </div>
              <div className="kuku-badge kuku-badge-success">
                <span className="font-bold">{selectedSegment}の段</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              {displayMode === 'manual' ? (
                <button
                  onClick={handleNext}
                  className="kuku-button-primary text-lg px-8 py-4"
                >
                  {showAnswer ? '次へ' : '答えを見る'}
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePlayPause}
                    className="kuku-button-primary text-lg px-8 py-4 flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={20} />
                        一時停止
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        開始
                      </>
                    )}
                  </button>
                </>
              )}
              <button
                onClick={handleReset}
                className="kuku-button-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                <RotateCcw size={20} />
                リセット
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <p className="text-blue-900 text-center font-semibold" style={{ fontFamily: 'Fredoka' }}>
                💡 毎日練習して、九九をマスターしよう！
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
