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
      breakMinutes: 5,
      longBreakMinutes: 15,
      sessionsBeforeLongBreak: 4
    }
  };

  const [timeRemaining, setTimeRemaining] = useState(todo.timer?.timeRemaining || defaultTimer.timeRemaining);
  const [isActive, setIsActive] = useState(todo.timer?.isActive || defaultTimer.isActive);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          onUpdateTimer({
            ...defaultTimer,
            ...todo.timer,
            timeRemaining: newTime,
            isActive: newTime > 0
          });
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, todo.timer, onUpdateTimer]);

  return (
    <div className="flex items-center gap-2">
      <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
      <button onClick={() => setIsActive(!isActive)} className="btn btn-primary">
        {isActive ? 'Pause' : 'Start'}
      </button>
    </div>
  );
} 