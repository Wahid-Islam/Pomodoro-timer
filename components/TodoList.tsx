import { useState } from 'react';
import { Todo } from '@/types';
import TodoTimer from './TodoTimer';

interface TodoListProps {
  todos: Todo[];
  onAddTodo: (todo: Todo) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodoTimer: (id: string, timerData: Todo['timer']) => void;
}

export default function TodoList({ 
  todos, 
  onAddTodo, 
  onToggleTodo, 
  onDeleteTodo,
  onUpdateTodoTimer 
}: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo({
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
      });
      setNewTodoText('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-100"
        />
      </form>
      
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo.id)}
                className="w-5 h-5 bg-gray-700 rounded"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                {todo.text}
              </span>
              <button
                onClick={() => onDeleteTodo(todo.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
            <TodoTimer
              todo={todo}
              onUpdateTimer={(timerData: Todo['timer']) => onUpdateTodoTimer(todo.id, timerData)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
} 