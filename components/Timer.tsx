import { useState, useEffect } from 'react';
import { TimerSettings } from '@/types';

interface TimerProps {
  settings: TimerSettings;
  onComplete: () => void;
}

export default function Timer({ settings, onComplete }: TimerProps) {
  const [minutes, setMinutes] = useState(settings.workMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsRunning(false);
          onComplete();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(settings.workMinutes);
    setSeconds(0);
  };

  return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-6xl font-bold mb-4">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="space-x-4">
        <button
          onClick={toggleTimer}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
        >
          Reset
        </button>
      </div>
    </div>
  );
} 