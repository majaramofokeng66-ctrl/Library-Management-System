
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all books
router.get('/', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// ADD a book
router.post('/', (req, res) => {
    const { title, author, genre, isbn, quantity } = req.body;

    const sql = `
        INSERT INTO books (title, author, genre, isbn, quantity)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, author, genre, isbn, quantity], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: 'Book added successfully!',
            id: result.insertId
        });
    });
});

// UPDATE a book
router.put('/:id', (req, res) => {
    const { title, author, genre, isbn, quantity } = req.body;

    const sql = `
        UPDATE books
        SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ?
        WHERE id = ?
    `;

    db.query(sql, [title, author, genre, isbn, quantity, req.params.id],
    (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book updated successfully!' });
    });
});

// DELETE a book
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM books WHERE id = ?', [req.params.id],
    (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully!' });
    });
});

module.exports = router;
