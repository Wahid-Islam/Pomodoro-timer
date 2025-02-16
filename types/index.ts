export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timer?: {
    isActive: boolean;
    currentPhase: 'work' | 'break' | 'longBreak';
    timeRemaining: number;
    settings: TimerSettings;
  };
}

export interface TimerSettings {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
} 