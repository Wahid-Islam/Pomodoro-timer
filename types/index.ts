export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timer?: {
    isActive: boolean;
    currentPhase: 'work' | 'break';
    timeRemaining: number;
    settings: TimerSettings;
    breakCount: number;
    totalPauseTime: number;
  };
}

export interface TimerSettings {
  workMinutes: number;
  breakMinutes: number;
} 