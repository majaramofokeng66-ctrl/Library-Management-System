
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import Login from './pages/Login';

import './App.css';

// Check whether a user is logged in
function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Check whether the user is an Admin
function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <div className="app-layout">
                                <Sidebar />
                                <main className="main-content">
                                    <Dashboard />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/books"
                    element={
                        <ProtectedRoute>
                            <div className="app-layout">
                                <Sidebar />
                                <main className="main-content">
                                    <Books />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <AdminRoute>
                            <div className="app-layout">
                                <Sidebar />
                                <main className="main-content">
                                    <Users />
                                </main>
                            </div>
                        </AdminRoute>
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <AdminRoute>
                            <div className="app-layout">
                                <Sidebar />
                                <main className="main-content">
                                    <Transactions />
                                </main>
                            </div>
                        </AdminRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
