
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(
        localStorage.getItem('loggedInUser')
    );

    const isAdmin = loggedInUser?.role === 'Admin';

    const logout = () => {
        localStorage.removeItem('loggedInUser');
        alert('You have logged out successfully!');
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <h2>📚 MyLibrary</h2>

            <p className="menu-title">MAIN MENU</p>

            <nav>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/books">Books</NavLink>

                {isAdmin && (
                    <>
                        <NavLink to="/transactions">
                            Transactions
                        </NavLink>

                        <NavLink to="/users">
                            Users
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                {loggedInUser && (
                    <>
                        <p>{loggedInUser.name}</p>
                        <p>Role: {loggedInUser.role}</p>
                    </>
                )}

                <button onClick={logout}>
                    Logout
                </button>

                <p>Library Management System</p>
            </div>
        </aside>
    );
}

export default Sidebar;
