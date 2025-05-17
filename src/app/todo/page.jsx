'use client';

import { useEffect, useState } from "react";

export default function TodoPage() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTodos() {
            const res = await fetch("/api/todo");
            const data = await res.json();
            setTodos(data.todos);
            setLoading(false);
            console.log("todo", data);
        }
        fetchTodos();
    }, []);

    async function deleteTodo(moodId, task) {
        await fetch(`/api/todo/${moodId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task }),
        });
        setTodos(todos.filter(t => !(t.task === task && t.moodId === moodId)));
    }

    async function updateTodo(moodId, oldTask, newTask) {
        const res = await fetch(`/api/todo/${moodId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldTask, newTask }),
        });
        if (res.ok) {
            setTodos(todos.map(t => t.task === oldTask && t.moodId === moodId ? { ...t, task: newTask } : t));
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Your Todos from Journal</h1>
            <ul className="space-y-4">
                {todos.map((todo, index) => (
                    <TodoItem key={index} todo={todo} onDelete={deleteTodo} onUpdate={updateTodo} />
                ))}
            </ul>
        </div>
    );
}

function TodoItem({
    todo,
    onDelete,
    onUpdate,
}) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(todo.task);

    return (
        <li className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded">
            {editing ? (
                <input
                    className="flex-grow mr-2 px-2 py-1 border rounded"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            ) : (
                <span className="flex-grow">{todo.task}</span>
            )}
            <div className="flex gap-2 ml-4">
                {editing ? (
                    <>
                        <button
                            className="text-green-600"
                            onClick={() => {
                                onUpdate(todo.moodId, todo.task, value);
                                setEditing(false);
                            }}
                        >
                            Save
                        </button>
                        <button className="text-gray-600" onClick={() => setEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button className="text-blue-600" onClick={() => setEditing(true)}>Edit</button>
                        <button className="text-red-600" onClick={() => onDelete(todo.moodId, todo.task)}>Delete</button>
                    </>
                )}
            </div>
        </li>
    );
}
