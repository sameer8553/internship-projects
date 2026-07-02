// ======================================
// REACT TODO APP
// ======================================

const { useState, useEffect } = React;

// ======================================
// MAIN APP COMPONENT
// ======================================

function TodoApp() {
    // State
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState('all');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');

    // Load from localStorage on start
    useEffect(() => {
        let saved = localStorage.getItem('tasks');
        if (saved) {
            setTasks(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage when tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // ======================================
    // FUNCTIONS
    // ======================================

    // Add task
    function addTask() {
        let text = newTask.trim();
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        let newTaskObj = {
            id: Date.now(),
            text: text,
            completed: false
        };

        setTasks([...tasks, newTaskObj]);
        setNewTask('');
    }

    // Delete task
    function deleteTask(id) {
        let confirmDelete = confirm('Delete this task?');
        if (confirmDelete) {
            let updated = tasks.filter(function(task) {
                return task.id !== id;
            });
            setTasks(updated);
        }
    }

    // Toggle complete
    function toggleComplete(id) {
        let updated = tasks.map(function(task) {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(updated);
    }

    // Start editing
    function startEdit(id, text) {
        setEditId(id);
        setEditText(text);
    }

    // Save edit
    function saveEdit(id) {
        let text = editText.trim();
        if (text === '') {
            alert('Task cannot be empty!');
            return;
        }

        let updated = tasks.map(function(task) {
            if (task.id === id) {
                return { ...task, text: text };
            }
            return task;
        });

        setTasks(updated);
        setEditId(null);
        setEditText('');
    }

    // Cancel edit
    function cancelEdit() {
        setEditId(null);
        setEditText('');
    }

    // Get filtered tasks
    function getFilteredTasks() {
        if (filter === 'all') {
            return tasks;
        } else if (filter === 'active') {
            return tasks.filter(function(task) {
                return !task.completed;
            });
        } else if (filter === 'completed') {
            return tasks.filter(function(task) {
                return task.completed;
            });
        }
        return tasks;
    }

    // Count stats
    let total = tasks.length;
    let completed = tasks.filter(function(t) { return t.completed; }).length;
    let remaining = total - completed;

    // Get filtered tasks
    let filteredTasks = getFilteredTasks();

    // ======================================
    // RENDER
    // ======================================

    return (
        <div className="todo-app">
            {/* Header */}
            <div className="todo-header">
                <h1><i className="bi bi-check-circle"></i> My Tasks</h1>
                <p>Organize your day, get things done!</p>
            </div>

            {/* Add Form */}
            <div className="add-form">
                <input
                    type="text"
                    placeholder="Enter a new task..."
                    value={newTask}
                    onChange={function(e) { setNewTask(e.target.value); }}
                    onKeyPress={function(e) {
                        if (e.key === 'Enter') {
                            addTask();
                        }
                    }}
                />
                <button onClick={addTask}>
                    <i className="bi bi-plus-circle"></i> Add Task
                </button>
            </div>

            {/* Filter Buttons */}
            <div className="filter-btns">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={function() { setFilter('all'); }}
                >
                    <i className="bi bi-list"></i> All
                </button>
                <button
                    className={filter === 'active' ? 'active' : ''}
                    onClick={function() { setFilter('active'); }}
                >
                    <i className="bi bi-circle"></i> Active
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={function() { setFilter('completed'); }}
                >
                    <i className="bi bi-check-circle"></i> Completed
                </button>
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
                <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <h5>No tasks here!</h5>
                    <p>Add a new task to get started.</p>
                </div>
            ) : (
                <ul className="task-list">
                    {filteredTasks.map(function(task) {
                        let isEditing = editId === task.id;

                        return (
                            <li
                                key={task.id}
                                className={`task-item ${task.completed ? 'completed' : ''}`}
                            >
                                {/* Checkbox */}
                                <div
                                    className={`checkbox ${task.completed ? 'checked' : ''}`}
                                    onClick={function() { toggleComplete(task.id); }}
                                >
                                    {task.completed && <i className="bi bi-check"></i>}
                                </div>

                                {/* Task Text or Edit Input */}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="edit-input"
                                        value={editText}
                                        onChange={function(e) { setEditText(e.target.value); }}
                                        onKeyPress={function(e) {
                                            if (e.key === 'Enter') {
                                                saveEdit(task.id);
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span className="task-text">{task.text}</span>
                                )}

                                {/* Action Buttons */}
                                <div className="task-actions">
                                    {isEditing ? (
                                        <>
                                            <button
                                                className="btn-save"
                                                onClick={function() { saveEdit(task.id); }}
                                                title="Save"
                                            >
                                                <i className="bi bi-check-lg"></i>
                                            </button>
                                            <button
                                                className="btn-cancel"
                                                onClick={cancelEdit}
                                                title="Cancel"
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn-edit"
                                                onClick={function() { startEdit(task.id, task.text); }}
                                                title="Edit"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={function() { deleteTask(task.id); }}
                                                title="Delete"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Stats */}
            <div className="todo-stats">
                <div>
                    <i className="bi bi-list-task"></i> Total: <span>{total}</span>
                </div>
                <div>
                    <i className="bi bi-check-circle"></i> Completed: <span>{completed}</span>
                </div>
                <div>
                    <i className="bi bi-circle"></i> Remaining: <span>{remaining}</span>
                </div>
            </div>
        </div>
    );
}

// ======================================
// RENDER TO DOM
// ======================================

let root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TodoApp />);