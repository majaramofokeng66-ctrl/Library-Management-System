
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [membership_id, setMembershipId] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        membership_id,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem(
                    'loggedInUser',
                    JSON.stringify(data.user)
                );

                alert('Welcome, ' + data.user.name);

                navigate('/');
            } else {
                alert(data.message || 'Login failed');
            }

        } catch (error) {
            alert('Could not connect to server');
        }
    };

    return (
        <div className="page">
            <div className="table-container">
                <h1>Library Login</h1>
                <p>Enter your membership details to continue.</p>

                <form onSubmit={handleLogin} className="book-form">
                    <input
                        type="text"
                        placeholder="Membership ID"
                        value={membership_id}
                        onChange={e => setMembershipId(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
