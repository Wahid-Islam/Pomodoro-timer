'use client';

import { useState } from 'react';
import TodoList from '@/components/TodoList';
import { Todo } from '@/types';
import Clock from '@/components/Clock';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

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
