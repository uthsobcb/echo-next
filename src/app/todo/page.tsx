'use client';

import { useEffect, useState } from 'react';
import { Edit3, Check, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setValue(todo.task);
    }, [todo.task]);

    const handleCheckbox = async () => {
        const newStatus = status === 'completed' ? 'pending' : 'completed';
        setUpdating(true);
        const updated = await onUpdateStatus(todo._id, newStatus);
        if (updated) setStatus(newStatus);
        setUpdating(false);
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as Status;
        setUpdating(true);
        const updated = await onUpdateStatus(todo._id, newStatus);
        if (updated) setStatus(newStatus);
        setUpdating(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        await onDelete(todo._id);
        setDeleting(false);
    };

    return (
        <li className={`flex items-center justify-between gap-4 p-3 rounded-xl transition-all ${status === 'completed' ? 'opacity-60' : ''} ${deleting ? 'opacity-30 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 flex-grow min-w-0">
                <input
                    type="checkbox"
                    checked={status === 'completed'}
                    onChange={handleCheckbox}
                    disabled={updating}
                    className="w-5 h-5 text-indigo-600 border-2 border-indigo-400 rounded cursor-pointer shrink-0 accent-indigo-600"
                />
                {editing ? (
                    <input
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500 px-1 py-0.5 text-sm"
                        autoFocus
                    />
                ) : (
                    <span className={`text-sm truncate ${status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.task}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={updating}
                    className={`text-xs border px-2 py-0.5 rounded-full cursor-pointer ${STATUS_COLORS[status] || ''}`}
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
                        className="text-green-600 hover:text-green-700 transition"
                        aria-label="Save edit"
                    >
                        <Check className='w-4 h-4' />
                    </button>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Edit todo"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                )}

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-400 hover:text-red-600 transition disabled:opacity-40"
                    aria-label="Delete todo"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
}

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTodos() {
            try {
                const res = await fetch('/api/todo');
                const data = await res.json();

                if (!res.ok) {
                    setFetchError(data.error || 'Failed to load todos.');
                    return;
                }

                const mapped: Todo[] = (data.todos || []).map((t: { _id: string; todo: string; status: Status }) => ({
                    _id: t._id,
                    task: t.todo,
                    status: t.status,
                }));
                setTodos(mapped);
            } catch (error) {
                console.error("Failed to fetch todos", error);
                setFetchError('Could not connect to the server. Please try again.');
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
            if (!res.ok) {
                toast.error('Failed to update status.');
                return false;
            }
            return true;
        } catch (error) {
            toast.error('Could not reach the server.');
            return false;
        }
    }

    async function updateText(todoId: string, oldTask: string, newTask: string): Promise<void> {
        if (!newTask.trim() || newTask === oldTask) return;
        try {
            const res = await fetch(`/api/todo/${todoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldTask, newTask }),
            });
            if (res.ok) {
                setTodos(prev => prev.map(t => t._id === todoId ? { ...t, task: newTask } : t));
                toast.success('Todo updated.');
            } else {
                toast.error('Failed to update todo.');
            }
        } catch (error) {
            toast.error('Could not reach the server.');
        }
    }

    async function deleteTodo(todoId: string): Promise<void> {
        try {
            const res = await fetch(`/api/todo/${todoId}`, { method: 'DELETE' });
            if (res.ok) {
                setTodos(prev => prev.filter(t => t._id !== todoId));
                toast.success('Todo deleted.');
            } else {
                toast.error('Failed to delete todo.');
            }
        } catch (error) {
            toast.error('Could not reach the server.');
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-indigo-600 mb-1 tracking-tight">Your Todos</h1>
                <p className="text-gray-500 text-sm">Auto-generated from your journal entries</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-500" />
                </div>
            ) : fetchError ? (
                <div className="flex flex-col items-center gap-3 mt-20 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                    <p className="text-red-500 font-medium">{fetchError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-indigo-600 hover:underline font-medium"
                    >
                        Try again
                    </button>
                </div>
            ) : todos.length === 0 ? (
                <div className="flex flex-col items-center gap-4 mt-20 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-indigo-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No todos yet.</p>
                    <p className="text-gray-400 text-sm max-w-xs">
                        Echo auto-generates todos from your journal entries.{" "}
                        <a href="/entry" className="text-indigo-500 hover:text-indigo-600 font-semibold underline underline-offset-2">
                            Write an entry
                        </a>{" "}
                        to get started.
                    </p>
                </div>
            ) : (
                <ul className="space-y-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 divide-y divide-gray-50">
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
