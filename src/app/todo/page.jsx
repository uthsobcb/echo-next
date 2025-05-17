'use client';

import { useEffect, useState } from "react";
import { Edit3, Trash2 } from "lucide-react";

export default function TodoPage() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTodos() {
            const res = await fetch("/api/todo");
            const data = await res.json();
            // Add `completed` property for visual toggle (assumed backend doesn't track it)
            const todosWithState = data.todos.map(t => ({ ...t, completed: false }));
            setTodos(todosWithState);
            setLoading(false);
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

    const toggleCompleted = (index) => {
        const newTodos = [...todos];
        newTodos[index].completed = !newTodos[index].completed;
        setTodos(newTodos);
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-500" />
                </div>
            ) : (
                <ul className="space-y-4">
                    {todos.map((todo, index) => (
                        <TodoItem
                            key={index}
                            todo={todo}
                            onDelete={deleteTodo}
                            onUpdate={updateTodo}
                            index={index}
                            toggleCompleted={toggleCompleted}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

function TodoItem({ todo, onDelete, onUpdate, index, toggleCompleted }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(todo.task);

    return (
        <li className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-grow">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(index)}
                    className="w-5 h-5 rounded-sm border-2 border-purple-500 text-purple-600 focus:ring-0 cursor-pointer checked:bg-purple-600 checked:border-purple-600"
                />
                {editing ? (
                    <input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-500 px-1 py-0.5"
                        autoFocus
                    />
                ) : (
                    <span
                        className={`text-md ${todo.completed ? "line-through text-gray-400" : "text-gray-800"
                            }`}
                    >
                        {todo.task}
                    </span>
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
                        ✅
                    </button>
                ) : (
                    <>
                        <button onClick={() => setEditing(true)}>
                            <Edit3 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        </button>
                        <button onClick={() => onDelete(todo.moodId, todo.task)}>
                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}
