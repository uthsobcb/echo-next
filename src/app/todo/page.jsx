'use client';

import { useEffect, useState } from 'react';
import { Edit3, Trash2, Check } from 'lucide-react';


function ConfirmModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Mark as Done?</h2>
                <p className="text-sm text-gray-600 mb-6">This will delete the todo. Are you sure?</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function TodoItem({ todo, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(todo.task);
    const [showModal, setShowModal] = useState(false);

    const handleCheckboxClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete(todo.moodId, todo.task);
        setShowModal(false);
    };

    return (
        <>
            <li className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-grow">
                    <div
                        role="checkbox"
                        onClick={handleCheckboxClick}
                        className="w-5 h-5 border-2 border-blue-500 rounded-sm cursor-pointer hover:bg-blue-100"
                    />
                    {editing ? (
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5"
                            autoFocus
                        />
                    ) : (
                        <span className="text-md text-gray-800">{todo.task}</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {editing ? (
                        <button
                            onClick={() => {
                                onUpdate(todo.moodId, todo.task, value);
                                setEditing(false);
                            }}
                        >
                            <Check className='w-4 h-4' />
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setEditing(true)}>
                                <Edit3 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                            </button>
                        </>
                    )}
                </div>
            </li>

            <ConfirmModal
                isOpen={showModal}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowModal(false)}
            />
        </>
    );
}

export default function TodoPage() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTodos() {
            const res = await fetch('/api/todo');
            const data = await res.json();
            const todosWithState = data.todos.map(t => ({ ...t, completed: false }));
            setTodos(todosWithState);
            setLoading(false);
        }
        fetchTodos();
    }, []);

    async function deleteTodo(moodId, task) {
        await fetch(`/api/todo/${moodId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task }),
        });
        setTodos(prev => prev.filter(t => !(t.task === task && t.moodId === moodId)));
    }

    async function updateTodo(moodId, oldTask, newTask) {
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
                            onDelete={deleteTodo}
                            onUpdate={updateTodo}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
