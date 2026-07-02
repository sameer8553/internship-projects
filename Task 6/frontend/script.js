const { useState, useEffect } = React;

const API_URL = 'http://localhost:5000/api/users';

function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', age: '' });
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ name: '', email: '', age: '' });
    const [error, setError] = useState('');

    function fetchUsers() {
        setLoading(true);
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUsers(data.data);
                } else {
                    setError('Failed to fetch users');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Failed to connect to server');
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    function addUser(e) {
        e.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim();
        const age = parseInt(formData.age);

        if (!name || !email || !age) {
            alert('Please fill all fields');
            return;
        }

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, age })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUsers([...users, data.data]);
                setFormData({ name: '', email: '', age: '' });
                setError('');
            } else {
                setError(data.error || data.errors?.join(', '));
            }
        })
        .catch(error => {
            console.error('Error adding user:', error);
            setError('Failed to add user');
        });
    }

    function deleteUser(id) {
        if (!confirm('Delete this user?')) return;

        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUsers(users.filter(user => user.id !== id));
                setError('');
            } else {
                setError(data.error);
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            setError('Failed to delete user');
        });
    }

    function startEdit(user) {
        setEditId(user.id);
        setEditData({
            name: user.name,
            email: user.email,
            age: user.age
        });
    }

    function saveEdit(id) {
        const name = editData.name.trim();
        const email = editData.email.trim();
        const age = parseInt(editData.age);

        if (!name || !email || !age) {
            alert('Please fill all fields');
            return;
        }

        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, age })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUsers(users.map(user => user.id === id ? data.data : user));
                setEditId(null);
                setEditData({ name: '', email: '', age: '' });
                setError('');
            } else {
                setError(data.error || data.errors?.join(', '));
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            setError('Failed to update user');
        });
    }

    function cancelEdit() {
        setEditId(null);
        setEditData({ name: '', email: '', age: '' });
    }

    return (
        <div className="app-container">
            <div className="header">
                <h1><i className="bi bi-people"></i> User Management</h1>
                <p>Add, view, update, and delete users</p>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    <i className="bi bi-exclamation-triangle"></i> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <form className="user-form" onSubmit={addUser}>
                <div className="row g-2">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Age"
                            value={formData.age}
                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn-submit">
                            <i className="bi bi-plus-circle"></i> Add
                        </button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="loading">
                    <i className="bi bi-hourglass-split"></i> Loading...
                </div>
            ) : users.length === 0 ? (
                <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <h5>No users found</h5>
                    <p>Add your first user above!</p>
                </div>
            ) : (
                <div className="user-list">
                    {users.map(user => {
                        const isEditing = editId === user.id;

                        return (
                            <div key={user.id} className="user-item">
                                <div className="user-info">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={editData.name}
                                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                placeholder="Name"
                                            />
                                            <input
                                                type="email"
                                                className="edit-input"
                                                value={editData.email}
                                                onChange={e => setEditData({ ...editData, email: e.target.value })}
                                                placeholder="Email"
                                            />
                                            <input
                                                type="number"
                                                className="edit-input"
                                                value={editData.age}
                                                onChange={e => setEditData({ ...editData, age: e.target.value })}
                                                placeholder="Age"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span className="name"><i className="bi bi-person"></i> {user.name}</span>
                                            <span className="email"><i className="bi bi-envelope"></i> {user.email}</span>
                                            <span className="age"><i className="bi bi-calendar"></i> {user.age} years</span>
                                        </>
                                    )}
                                </div>

                                <div className="user-actions">
                                    {isEditing ? (
                                        <>
                                            <button className="btn-edit" onClick={() => saveEdit(user.id)} title="Save">
                                                <i className="bi bi-check-lg"></i>
                                            </button>
                                            <button className="btn-delete" onClick={cancelEdit} title="Cancel">
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn-edit" onClick={() => startEdit(user)} title="Edit">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn-delete" onClick={() => deleteUser(user.id)} title="Delete">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-3 text-center text-muted small">
                Total Users: <strong>{users.length}</strong>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('✅ User Management App Loaded!');