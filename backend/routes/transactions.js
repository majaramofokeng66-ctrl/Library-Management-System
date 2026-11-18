
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all transactions
router.get('/', (req, res) => {
    db.query(
        'SELECT * FROM transactions ORDER BY transaction_date DESC',
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// ADD stock to a book
router.post('/stock', async (req, res) => {
    const { book_id, quantity } = req.body;

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
            message: 'Enter a valid quantity'
        });
    }

    let connection;

    try {
        connection = await db.promise().getConnection();
        await connection.beginTransaction();

        const [books] = await connection.query(
            'SELECT * FROM books WHERE id = ? FOR UPDATE',
            [book_id]
        );

        if (books.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Book not found' });
        }

        const book = books[0];

        await connection.query(
            'UPDATE books SET quantity = quantity + ? WHERE id = ?',
            [Number(quantity), book_id]
        );

        await connection.query(
            `INSERT INTO transactions
            (book_id, book_title, transaction_type, quantity)
            VALUES (?, ?, 'Stock Added', ?)`,
            [book_id, book.title, Number(quantity)]
        );

        await connection.commit();

        res.json({ message: 'Stock added successfully!' });

    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Could not add stock' });
    } finally {
        if (connection) connection.release();
    }
});

// BORROW a book
router.post('/borrow', async (req, res) => {
    const { book_id, quantity } = req.body;

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
            message: 'Enter a valid quantity'
        });
    }

    let connection;

    try {
        connection = await db.promise().getConnection();
        await connection.beginTransaction();

        const [books] = await connection.query(
            'SELECT * FROM books WHERE id = ? FOR UPDATE',
            [book_id]
        );

        if (books.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Book not found' });
        }

        const book = books[0];

        if (book.quantity < Number(quantity)) {
            await connection.rollback();
            return res.status(400).json({
                message: 'Not enough books available'
            });
        }

        await connection.query(
            'UPDATE books SET quantity = quantity - ? WHERE id = ?',
            [Number(quantity), book_id]
        );

        await connection.query(
            `INSERT INTO transactions
            (book_id, book_title, transaction_type, quantity)
            VALUES (?, ?, 'Borrowed', ?)`,
            [book_id, book.title, Number(quantity)]
        );

        await connection.commit();

        res.json({ message: 'Book borrowed successfully!' });

    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Could not borrow book' });
    } finally {
        if (connection) connection.release();
    }
});

// RETURN a borrowed book
router.post('/return', async (req, res) => {
    const { book_id, quantity } = req.body;

    if (
        !Number.isInteger(Number(book_id)) ||
        Number(book_id) <= 0 ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) <= 0
    ) {
        return res.status(400).json({
            message: 'Enter a valid book and quantity'
        });
    }

    let connection;

    try {
        connection = await db.promise().getConnection();
        await connection.beginTransaction();

        const [books] = await connection.query(
            'SELECT * FROM books WHERE id = ? FOR UPDATE',
            [Number(book_id)]
        );

        if (books.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        const book = books[0];

        // Calculate how many copies are still borrowed
        const [results] = await connection.query(
            `SELECT COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'Borrowed' THEN quantity
                        WHEN transaction_type = 'Returned' THEN -quantity
                        ELSE 0
                    END
                ), 0
            ) AS outstanding
            FROM transactions
            WHERE book_id = ?`,
            [Number(book_id)]
        );

        const outstanding = Number(results[0].outstanding);

        if (outstanding < Number(quantity)) {
            await connection.rollback();
            return res.status(400).json({
                message: 'Cannot return more copies than have been borrowed'
            });
        }

        // Increase the available book quantity
        await connection.query(
            'UPDATE books SET quantity = quantity + ? WHERE id = ?',
            [Number(quantity), Number(book_id)]
        );

        // Record the return
        await connection.query(
            `INSERT INTO transactions
            (book_id, book_title, transaction_type, quantity)
            VALUES (?, ?, 'Returned', ?)`,
            [Number(book_id), book.title, Number(quantity)]
        );

        await connection.commit();

        res.json({
            message: 'Book returned successfully!'
        });

    } catch (err) {
        if (connection) await connection.rollback();

        res.status(500).json({
            message: 'Could not return book'
        });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
