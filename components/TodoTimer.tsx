import { useState, useEffect } from 'react';
import { Todo } from '@/types';

interface TodoTimerProps {
  todo: Todo;
  onUpdateTimer: (timerData: Todo['timer']) => void;
}

export default function TodoTimer({ todo, onUpdateTimer }: TodoTimerProps) {
  const defaultTimer = {
    isActive: false,
    currentPhase: 'work' as const,
    timeRemaining: 25 * 60,
    settings: {
      workMinutes: 25,
      breakMinutes: 5
    }
  };

  const [settings, setSettings] = useState(todo.timer?.settings || defaultTimer.settings);
  const [timeRemaining, setTimeRemaining] = useState(
    todo.timer?.timeRemaining || settings.workMinutes * 60
  );
  const [isActive, setIsActive] = useState(todo.timer?.isActive || false);
  const [showSettings, setShowSettings] = useState(false);
  const [breakCount, setBreakCount] = useState(todo.timer?.breakCount || 4);
  const [currentPhase, setCurrentPhase] = useState<'work' | 'break'>(todo.timer?.currentPhase || 'work');
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);

  const updateSettings = (key: keyof typeof settings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    const newTimeRemaining = key === 'workMinutes' ? value * 60 : timeRemaining;
    const newBreakCount = key === 'breakMinutes' ? value : breakCount;
    
    setSettings(newSettings);
    setTimeRemaining(newTimeRemaining);
    setBreakCount(newBreakCount);
    setIsActive(false);
    
    onUpdateTimer({
      isActive: false,
      currentPhase: 'work',
      settings: newSettings,
      timeRemaining: newTimeRemaining,
      breakCount: newBreakCount,
      totalPauseTime
    });
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(settings.workMinutes * 60);
    setBreakCount(4);
    setCurrentPhase('work');
    
    onUpdateTimer({
      isActive: false,
      currentPhase: 'work',
      settings,
      timeRemaining: settings.workMinutes * 60,
      breakCount: 4,
      totalPauseTime: 0
    });
  };

  const toggleTimer = () => {
    if (breakCount === 0 && !isActive) {
      resetTimer();
      return;
    }

    const newIsActive = !isActive;
    
    if (newIsActive) {
      if (pauseStartTime) {
        const pauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
        setTotalPauseTime(prev => prev + pauseDuration);
        setPauseStartTime(null);
      }
    } else {
      setPauseStartTime(Date.now());
    }

    if (!newIsActive && currentPhase === 'work') {
      const newBreakCount = breakCount > 0 ? breakCount - 1 : 0;
      setBreakCount(newBreakCount);
      onUpdateTimer({
        isActive: newIsActive,
        currentPhase,
        settings,
        timeRemaining,
        breakCount: newBreakCount,
        totalPauseTime
      });
    } else {
      onUpdateTimer({
        isActive: newIsActive,
        currentPhase,
        settings,
        timeRemaining,
        breakCount,
        totalPauseTime
      });
    }
    
    setIsActive(newIsActive);
  };

  const handleTimerComplete = () => {
    if (timeRemaining === 0) {
      if (currentPhase === 'work') {
        setCurrentPhase('break');
        setTimeRemaining(settings.breakMinutes * 60);
        setIsActive(false);
        
        onUpdateTimer({
          isActive: false,
          currentPhase: 'break',
          settings,
          timeRemaining: settings.breakMinutes * 60,
          breakCount,
          totalPauseTime
        });
      } else {
        setCurrentPhase('work');
        setTimeRemaining(settings.workMinutes * 60);
        setIsActive(false);
        
        onUpdateTimer({
          isActive: false,
          currentPhase: 'work',
          settings,
          timeRemaining: settings.workMinutes * 60,
          breakCount,
          totalPauseTime
        });
      }
    }
  };

  const formatPauseTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            handleTimerComplete();
          }
          onUpdateTimer({
            isActive: newTime > 0,
            currentPhase,
            settings,
            timeRemaining: newTime,
            breakCount,
            totalPauseTime
          });
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, settings, onUpdateTimer, currentPhase, breakCount, totalPauseTime]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xl">
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </span>
        <button 
          onClick={toggleTimer} 
          className={`btn ${breakCount === 0 && !isActive ? 'btn-destructive' : 'btn-primary'}`}
        >
          {isActive ? 'Pause' : breakCount === 0 ? 'Stop' : 'Start'}
        </button>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-secondary"
        >
          ⚙️
        </button>
        <div className="text-sm text-gray-400 flex flex-col">
          <span>{currentPhase === 'work' ? 'Work' : 'Break'} • {breakCount} breaks left</span>
          <span>Total pause: {formatPauseTime(totalPauseTime)}</span>
        </div>
      </div>

      {showSettings && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-700 rounded-lg text-sm">
          <label className="flex items-center justify-between gap-2">
            Work:
            <input
              type="number"
              min="1"
              max="120"
              value={settings.workMinutes}
              onChange={(e) => updateSettings('workMinutes', parseInt(e.target.value))}
              className="w-16 px-2 py-1 bg-gray-600 rounded"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            Break:
            <input
              type="number"
              min="1"
              max="30"
              value={settings.breakMinutes}
              onChange={(e) => updateSettings('breakMinutes', parseInt(e.target.value))}
              className="w-16 px-2 py-1 bg-gray-600 rounded"
            />
          </label>
        </div>
      )}
    </div>
  );
} 