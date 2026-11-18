
import { useEffect, useState } from 'react';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [books, setBooks] = useState([]);

    const [bookId, setBookId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const loadData = () => {
        fetch('http://localhost:5000/api/books')
            .then(res => res.json())
            .then(data => setBooks(data));

        fetch('http://localhost:5000/api/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleTransaction = async (type) => {
        if (!bookId) {
            alert('Please select a book');
            return;
        }

        const response = await fetch(
            `http://localhost:5000/api/transactions/${type}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: Number(bookId),
                    quantity: Number(quantity)
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            setQuantity(1);
            loadData();
        } else {
            alert(data.message || 'Transaction failed');
        }
    };

    return (
        <div className="page">
            <h1>Transactions</h1>
            <p>Manage book borrowing, returns and stock additions.</p>

            <div className="table-container">
                <h2>New Transaction</h2>

                <div className="book-form">
                    <select
                        value={bookId}
                        onChange={e => setBookId(e.target.value)}
                    >
                        <option value="">Select a book</option>

                        {books.map(book => (
                            <option key={book.id} value={book.id}>
                                {book.title} (Available: {book.quantity})
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        placeholder="Quantity"
                    />

                    <button onClick={() => handleTransaction('stock')}>
                        Add Stock
                    </button>

                    <button
    className="delete-btn"
    onClick={() => handleTransaction('borrow')}
>
    Borrow Book
</button>

<button
    onClick={() => handleTransaction('return')}
>
    Return Book
</button>
                </div>
            </div>

            <div className="table-container">
                <h2>Transaction History</h2>

                {transactions.length === 0 ? (
                    <p>No transactions recorded yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map(item => (
                                <tr key={item.id}>
                                    <td>{item.book_title}</td>
                                    <td>{item.transaction_type}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        {new Date(
                                            item.transaction_date
                                        ).toLocaleString()}
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

export default Transactions;
