'use client';

import { useEffect, useState } from 'react';
import { Edit3, Check } from 'lucide-react';

function StatusBadge({ status }) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-300',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-300',
        'completed': 'bg-green-100 text-green-700 border-green-300',
    };

    return (
        <span className={`text-xs px-2 py-0.5 border rounded-full ${colors[status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
            {status}
        </span>
    );
}

function TodoItem({ todo, onUpdateStatus, onDelete, onUpdateText }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(todo.task);
    const [status, setStatus] = useState(todo.status);

    const handleMarkAsDone = async () => {
        const updated = await onUpdateStatus(todo.moodId, todo.task, 'completed');
        if (updated) setStatus('completed');
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        const updated = await onUpdateStatus(todo.moodId, todo.task, newStatus);
        if (updated) setStatus(newStatus);
    };
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-300',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-300',
        'completed': 'bg-green-100 text-green-700 border-green-300',
    };

    return (
        <li className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-grow">
                <input
                    type="checkbox"
                    checked={status === 'completed'}
                    onChange={handleMarkAsDone}
                    className="w-5 h-5 text-blue-600 border-2 border-blue-500 rounded-sm cursor-pointer"
                />
                {editing ? (
                    <input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5"
                        autoFocus
                    />
                ) : (
                    <span className={`text-md ${status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.task}
                    </span>
                )}
            </div>

            {/* <span className={`text-xs px-2 py-0.5 border rounded-full ${colors[status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}> */}

            <div className="flex items-center gap-2">
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className={`text-xs border px-2 py-0.5 rounded-full ${colors[status] || ''}`}
                >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                {/* <StatusBadge status={status} /> */}

                {editing ? (
                    <button
                        onClick={async () => {
                            await onUpdateText(todo.moodId, todo.task, value);
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
            </div>
        </li>
    );
}

export default function TodoPage() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTodos() {
            const res = await fetch('/api/todo');
            const data = await res.json();
            const todosWithState = data.todos.map(t => ({
                ...t,
                task: t.todo,
                moodId: t._id,
            }));
            setTodos(todosWithState);
            setLoading(false);
        }
        fetchTodos();
    }, []);

    async function updateStatus(moodId, task, status) {
        const res = await fetch(`/api/todo/${moodId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldTask: task, newTask: task, status }),
        });
        return res.ok;
    }

    async function updateText(moodId, oldTask, newTask) {
        const res = await fetch(`/api/todo/${moodId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldTask, newTask }),
        });
        if (res.ok) {
            setTodos(prev =>
                prev.map(t =>
                    t.task === oldTask && t.moodId === moodId
                        ? { ...t, task: newTask }
                        : t
                )
            );
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
            ) : (
                <ul className="space-y-4">
                    {todos.map((todo, index) => (
                        <TodoItem
                            key={index}
                            todo={todo}
                            onUpdateStatus={updateStatus}
                            onUpdateText={updateText}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
