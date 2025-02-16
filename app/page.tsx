'use client';

import { useState } from 'react';
import Clock from '@/components/Clock';
import Timer from '@/components/Timer';
import TodoList from '@/components/TodoList';
import { Todo, TimerSettings } from '@/types';

const defaultSettings: TimerSettings = {
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [timerSettings, setTimerSettings] = useState(defaultSettings);
  const [sessionCount, setSessionCount] = useState(0);

  const handleTimerComplete = () => {
    setSessionCount(sessionCount + 1);
  };

  const handleAddTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleUpdateTodoTimer = (id: string, timerData: Todo['timer']) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, timer: timerData } : todo
    ));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <Clock />
        <Timer 
          settings={timerSettings}
          onComplete={handleTimerComplete}
          onUpdateSettings={setTimerSettings}
        />
        <TodoList
          todos={todos}
          onAddTodo={handleAddTodo}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodoTimer={handleUpdateTodoTimer}
        />
      </div>
    </div>
  );
}
