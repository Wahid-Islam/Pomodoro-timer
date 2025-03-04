import { useEffect, useRef, useState } from 'react';
import { Todo } from '@/types';

interface TodoTimerProps {
  todo: Todo;
  onUpdateTimer: (timerData: Todo['timer']) => void;
}

const ALARM_SOUNDS = [
  { id: 'bell', name: 'Bell', path: '/alarms/bell.mp3' },
  { id: 'digital', name: 'Digital', path: '/alarms/digital.mp3' },
  { id: 'classic', name: 'Classic', path: '/alarms/alarm.mp3' },
  
];

export default function TodoTimer({ todo, onUpdateTimer }: TodoTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'work' | 'break'>('work');
  const [breakCount, setBreakCount] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ workMinutes: 25, breakMinutes: 1 });
  const [selectedAlarm, setSelectedAlarm] = useState(ALARM_SOUNDS[0].id);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const selectedSound = ALARM_SOUNDS.find(sound => sound.id === selectedAlarm);
    audioRef.current = new Audio(selectedSound?.path);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedAlarm]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      audioRef.current?.play().catch(console.error);
      setIsAlarmPlaying(true);
      setIsActive(false);
      
      if (currentPhase === 'work' && breakCount > 0) {
        setCurrentPhase('break');
        setTimeRemaining(settings.breakMinutes * 60);
        setBreakCount(count => count - 1);
      } else {
        setCurrentPhase('work');
        setTimeRemaining(settings.workMinutes * 60);
      }
    }
    return () => clearInterval(interval);
  }, [timeRemaining, isActive, currentPhase, breakCount, settings]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlarmPlaying(false);
  };

  const updateSettings = (key: keyof typeof settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'workMinutes' && currentPhase === 'work') {
      setTimeRemaining(value * 60);
    } else if (key === 'breakMinutes' && currentPhase === 'break') {
      setTimeRemaining(value * 60);
    }
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) {
      return 'text-red-500';
    }
    return 'text-white';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className={`font-mono text-4xl font-bold ${getTimerColor()} transition-colors`}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </span>
        <div className="flex flex-col gap-2">
          <button 
            onClick={toggleTimer} 
            className={`btn ${isActive ? 'btn-destructive' : 'btn-primary'}`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-secondary"
          >
            ⚙️
          </button>
          {isAlarmPlaying && (
            <button 
              onClick={stopAlarm}
              className="btn btn-destructive"
            >
              Stop Alarm
            </button>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {currentPhase === 'work' ? 'Work' : 'Break'} • {breakCount} breaks left
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
          <label className="flex items-center justify-between gap-2">
            Alarm:
            <select
              value={selectedAlarm}
              onChange={(e) => setSelectedAlarm(e.target.value)}
              className="w-32 px-2 py-1 bg-gray-600 rounded"
            >
              {ALARM_SOUNDS.map(sound => (
                <option key={sound.id} value={sound.id}>
                  {sound.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
} 