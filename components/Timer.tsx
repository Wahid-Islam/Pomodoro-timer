import { useState, useEffect } from 'react';
import { TimerSettings } from '@/types';

interface TimerProps {
  settings: TimerSettings;
  onComplete: () => void;
  onUpdateSettings: (settings: TimerSettings) => void;
}

export default function Timer({ settings, onComplete, onUpdateSettings }: TimerProps) {
  const [minutes, setMinutes] = useState(settings.workMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
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

  const handleSettingsUpdate = (field: keyof TimerSettings, value: number) => {
    onUpdateSettings({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="text-6xl font-mono font-bold mb-4">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      {isEditing ? (
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <label className="block text-gray-400 mb-1">Work Minutes</label>
            <input
              type="number"
              value={settings.workMinutes}
              onChange={(e) => handleSettingsUpdate('workMinutes', parseInt(e.target.value))}
              className="w-20 px-2 py-1 bg-gray-700 rounded text-center"
              min="1"
              max="60"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Break Minutes</label>
            <input
              type="number"
              value={settings.breakMinutes}
              onChange={(e) => handleSettingsUpdate('breakMinutes', parseInt(e.target.value))}
              className="w-20 px-2 py-1 bg-gray-700 rounded text-center"
              min="1"
              max="30"
            />
          </div>
        </div>
      ) : null}

      <div className="space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="btn btn-primary"
          disabled={isEditing}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary"
          disabled={isRunning}
        >
          {isEditing ? 'Done' : 'Settings'}
        </button>
      </div>
    </div>
  );
} 