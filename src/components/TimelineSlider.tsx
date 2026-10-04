import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TimelineSliderProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
  milestones?: { year: number; label: string }[];
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  minYear,
  maxYear,
  currentYear,
  onYearChange,
  milestones = [],
}) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(600); // ms per year
  const intervalRef = useRef<number | null>(null);
  const currentYearRef = useRef(currentYear);

  useEffect(() => {
    currentYearRef.current = currentYear;
  }, [currentYear]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        const next = currentYearRef.current + 1;
        if (next >= maxYear) {
          onYearChange(maxYear);
          setIsPlaying(false);
        } else {
          onYearChange(next);
        }
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, maxYear, onYearChange, speed]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentYear >= maxYear) {
        onYearChange(minYear);
      }
      setIsPlaying(true);
    }
  };

  const handleResetToCurrent = () => {
    setIsPlaying(false);
    onYearChange(maxYear);
  };

  const handleResetToStart = () => {
    setIsPlaying(false);
    onYearChange(minYear);
  };

  const toggleSpeed = () => {
    setSpeed(prev => (prev === 600 ? 250 : prev === 250 ? 1000 : 600));
  };

  const yearSuffix = language === 'ja' ? '年' : '';
  const foundedLabel = language === 'ja' ? '創設' : 'Founded';
  const latestLabel = language === 'ja' ? '最新' : 'Present';

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 再生コントロール */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                {t('timelinePause')}
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                {t('timelinePlay')}
              </>
            )}
          </button>

          <button
            onClick={toggleSpeed}
            title={t('timelineSpeedTitle')}
            className="p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            {speed === 250 ? '2x' : speed === 600 ? '1x' : '0.5x'}
          </button>

          <button
            onClick={handleResetToStart}
            title={t('timelineReset')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* 年次表示 */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
              {t('timelineYear')}
            </span>
            <span className="text-2xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
              {currentYear}{yearSuffix}
            </span>
          </div>

          {currentYear !== maxYear && (
            <button
              onClick={handleResetToCurrent}
              className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
            >
              {t('timelineLatest')}
            </button>
          )}
        </div>
      </div>

      {/* スライダーバー */}
      <div className="relative pt-2 pb-1">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(e) => {
            setIsPlaying(false);
            onYearChange(Number(e.target.value));
          }}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        {/* 目盛り / 年表示 */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
          <span>{minYear}{yearSuffix} ({foundedLabel})</span>
          <span>{Math.round((minYear + maxYear) / 2)}{yearSuffix}</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">{maxYear}{yearSuffix} ({latestLabel})</span>
        </div>

        {/* 主要マイルストーン */}
        {milestones.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {milestones.map((m) => (
              <button
                key={m.year}
                onClick={() => {
                  setIsPlaying(false);
                  onYearChange(m.year);
                }}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                  currentYear === m.year
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {m.year}: {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

