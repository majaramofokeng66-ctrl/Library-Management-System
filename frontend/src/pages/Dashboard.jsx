
import { useEffect, useState } from 'react';

function Dashboard() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.log(err));

        fetch('http://localhost:5000/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.log(err));
    }, []);

    const totalBooks = books.reduce(
        (total, book) => total + Number(book.quantity), 0
    );

    const lowStock = books.filter(
        book => Number(book.quantity) < 2
    ).length;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome to your library management system.</p>

            <div className="stats">
                <div className="stat-card">
                    <h3>Total Books</h3>
                    <h2>{totalBooks}</h2>
                </div>

                <div className="stat-card">
                    <h3>Book Titles</h3>
                    <h2>{books.length}</h2>
                </div>

                <div className="stat-card">
                    <h3>Registered Users</h3>
                    <h2>{users.length}</h2>
                </div>

                <div className="stat-card warning">
                    <h3>Low Stock Books</h3>
                    <h2>{lowStock}</h2>
                </div>
            </div>

            <div className="table-container">
                <h2>Book Availability</h2>

                {books.length === 0 ? (
                    <p>No books registered yet. Go to Books to add your first book.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.quantity}</td>
                                    <td>
                                        {book.quantity < 2
                                            ? 'Low Stock'
                                            : 'Available'}
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

export default Dashboard;
