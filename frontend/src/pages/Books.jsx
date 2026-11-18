
import { useEffect, useState } from 'react';

function Books() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        quantity: ''
    });

    const [editingId, setEditingId] = useState(null);

    const loadBooks = () => {
        fetch('http://localhost:5000/api/books')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addBook = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                quantity: Number(form.quantity)
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Book added successfully!');
            setForm({
                title: '',
                author: '',
                genre: '',
                isbn: '',
                quantity: ''
            });
            loadBooks();
        } else {
            alert(data.message || 'Could not add book');
        }
    };

    const editBook = (book) => {
    setEditingId(book.id);

    setForm({
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        quantity: book.quantity
    });
};

    const updateBook = async (e) => {
    e.preventDefault();

    const response = await fetch(
        `http://localhost:5000/api/books/${editingId}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                quantity: Number(form.quantity)
            })
        }
    );

    const data = await response.json();

    if (response.ok) {
        alert('Book updated successfully!');

        setEditingId(null);
        setForm({
            title: '',
            author: '',
            genre: '',
            isbn: '',
            quantity: ''
        });

        loadBooks();
    } else {
        alert(data.message || 'Could not update book');
    }
};


    const deleteBook = async (id) => {
        if (!window.confirm('Delete this book?')) return;

        const response = await fetch(
            `http://localhost:5000/api/books/${id}`,
            { method: 'DELETE' }
        );

        if (response.ok) {
            loadBooks();
        } else {
            alert('Could not delete book');
        }
    };

    return (
        <div className="page">
            <h1>Book Management</h1>
            <p>Add and manage library books.</p>

            <div className="table-container">
                <h2>Add New Book</h2>

                <form
                    onSubmit={editingId ? updateBook : addBook}
                    className="book-form"
                >
                    <input name="title" placeholder="Book Title"
                        value={form.title} onChange={handleChange} required />

                    <input name="author" placeholder="Author"
                        value={form.author} onChange={handleChange} required />

                    <input name="genre" placeholder="Genre"
                        value={form.genre} onChange={handleChange} required />

                    <input name="isbn" placeholder="ISBN"
                        value={form.isbn} onChange={handleChange} required />

                    <input name="quantity" type="number" min="0"
                        placeholder="Initial Quantity"
                        value={form.quantity} onChange={handleChange} required />

                    <button type="submit">
    {editingId ? 'Save Changes' : 'Add Book'}
</button>

{editingId && (
    <button
        type="button"
        className="delete-btn"
        onClick={() => {
            setEditingId(null);
            setForm({
                title: '',
                author: '',
                genre: '',
                isbn: '',
                quantity: ''
            });
        }}
    >
        Cancel
    </button>
)}
                </form>
            </div>

            <div className="table-container">
                <h2>Book List</h2>

                {books.length === 0 ? (
                    <p>No books registered yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>ISBN</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.quantity}</td>
                                    <td>
    <button onClick={() => editBook(book)}>
        Edit
    </button>

    <button
        className="delete-btn"
        onClick={() => deleteBook(book.id)}
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

export default Books;
