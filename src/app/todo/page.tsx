'use client';

import { useEffect, useState } from 'react';
import { Edit3, Check, Trash2 } from 'lucide-react';

type Status = 'pending' | 'in-progress' | 'completed';

interface Todo {
    _id: string;
    task: string;
    status: Status;
}

interface TodoItemProps {
    todo: Todo;
    onUpdateStatus: (todoId: string, status: Status) => Promise<boolean>;
    onUpdateText: (todoId: string, oldTask: string, newTask: string) => Promise<void>;
    onDelete: (todoId: string) => Promise<void>;
}

const STATUS_COLORS: Record<Status, string> = {
    'pending': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-300',
    'completed': 'bg-green-100 text-green-700 border-green-300',
};

function TodoItem({ todo, onUpdateStatus, onUpdateText, onDelete }: TodoItemProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(todo.task);
    const [status, setStatus] = useState<Status>(todo.status);

    useEffect(() => {
        setValue(todo.task);
    }, [todo.task]);

    const handleCheckbox = async () => {
        const newStatus = status === 'completed' ? 'pending' : 'completed';
        const updated = await onUpdateStatus(todo._id, newStatus);
        if (updated) setStatus(newStatus);
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Status;
        const updated = await onUpdateStatus(todo._id, newStatus);
        if (updated) setStatus(newStatus);
    };

    return (
        <li className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-grow">
                <input
                    type="checkbox"
                    checked={status === 'completed'}
                    onChange={handleCheckbox}
                    className="w-5 h-5 text-blue-600 border-2 border-blue-500 rounded-sm cursor-pointer"
                />
                {editing ? (
                    <input
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5"
                        autoFocus
                    />
                ) : (
                    <span className={`text-md ${status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.task}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className={`text-xs border px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || ''}`}
                >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                {editing ? (
                    <button
                        onClick={async () => {
                            await onUpdateText(todo._id, todo.task, value);
                            setEditing(false);
                        }}
                    >
                        <Check className='w-4 h-4' />
                    </button>
                ) : (
                    <button onClick={() => setEditing(true)}>
                        <Edit3 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                )}

                <button onClick={() => onDelete(todo._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
}

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTodos() {
            try {
                const res = await fetch('/api/todo');
                const data = await res.json();
                const mapped: Todo[] = data.todos.map((t: { _id: string; todo: string; status: Status }) => ({
                    _id: t._id,
                    task: t.todo,
                    status: t.status,
                }));
                setTodos(mapped);
            } catch (error) {
                console.error("Failed to fetch todos", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTodos();
    }, []);

    async function updateStatus(todoId: string, status: Status): Promise<boolean> {
        try {
            const res = await fetch(`/api/todo/${todoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            return res.ok;
        } catch (error) {
            console.error("Failed to update status", error);
            return false;
        }
    }

    async function updateText(todoId: string, oldTask: string, newTask: string): Promise<void> {
        try {
            const res = await fetch(`/api/todo/${todoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldTask, newTask }),
            });
            if (res.ok) {
                setTodos(prev =>
                    prev.map(t => t._id === todoId ? { ...t, task: newTask } : t)
                );
            }
        } catch (error) {
            console.error("Failed to update text", error);
        }
    }

    async function deleteTodo(todoId: string): Promise<void> {
        try {
            const res = await fetch(`/api/todo/${todoId}`, { method: 'DELETE' });
            if (res.ok) {
                setTodos(prev => prev.filter(t => t._id !== todoId));
            }
        } catch (error) {
            console.error("Failed to delete todo", error);
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-1 tracking-tight">Your Todos</h1>
                <p className="text-gray-500 text-sm">From your recent journal entries</p>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
                </div>
            ) : todos.length === 0 ? (
                <p className="text-gray-400 text-center mt-20">No todos yet. They'll appear here from your journal entries.</p>
            ) : (
                <ul className="space-y-4">
                    {todos.map(todo => (
                        <TodoItem
                            key={todo._id}
                            todo={todo}
                            onUpdateStatus={updateStatus}
                            onUpdateText={updateText}
                            onDelete={deleteTodo}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
