'use client';

import { useState } from 'react';
import Timer from '@/components/Timer';
import TodoList from '@/components/TodoList';
import { Todo, TimerSettings } from '@/types';
import Clock from '@/components/Clock';

const defaultSettings: TimerSettings = {
  workMinutes: 25,
  breakMinutes: 5
};

export default function Home() {
  const [title, setTitle] = useState('My Pomodoro Session');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sessionCount, setSessionCount] = useState(0);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  const handleTimerComplete = () => {
    setSessionCount(sessionCount + 1);
    // Add logic for switching between work and break periods
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
      <div className="max-w-4xl mx-auto">
        <Clock />
        <h1 className="text-2xl font-bold mb-8 text-center">Pomodoro Tasks</h1>
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
