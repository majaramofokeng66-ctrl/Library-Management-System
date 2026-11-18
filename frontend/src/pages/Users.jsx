
import { useEffect, useState } from 'react';

function Users() {
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
    name: '',
    membership_id: '',
    password: '',
    role: 'Member'
});

    const [editingId, setEditingId] = useState(null);

    const loadUsers = () => {
        fetch('http://localhost:5000/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addUser = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (response.ok) {
            alert('User registered successfully!');

            setForm({
    name: '',
    membership_id: '',
    password: '',
    role: 'Member'
});

            loadUsers();
        } else {
            alert(data.message || 'Could not register user');
        }
    };

  <input
    type="password"
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    required
    minLength="6"
/>
    const editUser = (user) => {
    setEditingId(user.id);

    setForm({
        name: user.name,
        membership_id: user.membership_id,
        role: user.role
    });
};

const updateUser = async (e) => {
    e.preventDefault();

    const response = await fetch(
        `http://localhost:5000/api/users/${editingId}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        }
    );

    const data = await response.json();

    if (response.ok) {
        alert('User updated successfully!');

        setEditingId(null);

        setForm({
            name: '',
            membership_id: '',
            role: 'Member'
        });

        loadUsers();
    } else {
        alert(data.message || 'Could not update user');
    }
};

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;

        const response = await fetch(
            `http://localhost:5000/api/users/${id}`,
            { method: 'DELETE' }
        );

        if (response.ok) {
            loadUsers();
        } else {
            alert('Could not delete user');
        }
    };

    return (
        <div className="page">
            <h1>User Management</h1>
            <p>Register and manage library members.</p>

            <div className="table-container">
                <h2>Register New User</h2>

                <form
                    onSubmit={editingId ? updateUser : addUser}
                    className="book-form"
                >
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="membership_id"
                        placeholder="Membership ID"
                        value={form.membership_id}
                        onChange={handleChange}
                        required
                    />

                    <input
    type="password"
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    required
    minLength="6"
/>

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <button type="submit">
    {editingId ? 'Save Changes' : 'Add User'}
</button>

{editingId && (
    <button
        type="button"
        className="delete-btn"
        onClick={() => {
            setEditingId(null);
            setForm({
                name: '',
                membership_id: '',
                role: 'Member'
            });
        }}
    >
        Cancel
    </button>
)}
                </form>
            </div>

            <div className="table-container">
                <h2>Registered Users</h2>

                {users.length === 0 ? (
                    <p>No users registered yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Membership ID</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.membership_id}</td>
                                    <td>{user.role}</td>
                                    <td>
    <button onClick={() => editUser(user)}>
        Edit
    </button>

    <button
        className="delete-btn"
        onClick={() => deleteUser(user.id)}
    >
        Delete
    </button>
</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Users;
