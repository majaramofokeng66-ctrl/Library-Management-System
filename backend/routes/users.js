
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// GET all users
router.get('/', (req, res) => {
    db.query(
        'SELECT id, name, membership_id, role FROM users',
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// USER LOGIN
router.post('/login', (req, res) => {
    const { membership_id, password } = req.body;

    if (!membership_id || !password) {
        return res.status(400).json({
            message: 'Enter your membership ID and password'
        });
    }

    db.query(
        'SELECT * FROM users WHERE membership_id = ?',
        [membership_id],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: 'Login failed'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: 'Invalid membership ID or password'
                });
            }

            const user = results[0];

            try {
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message: 'Invalid membership ID or password'
                    });
                }

                res.json({
                    message: 'Login successful!',
                    user: {
                        id: user.id,
                        name: user.name,
                        membership_id: user.membership_id,
                        role: user.role
                    }
                });

            } catch (error) {
                res.status(500).json({
                    message: 'Login failed'
                });
            }
        }
    );
});
// ADD a user
router.post('/', async (req, res) => {
    const { name, membership_id, role, password } = req.body;

    if (!name || !membership_id || !password) {
        return res.status(400).json({
            message: 'All fields, including password, are required'
        });
    }

    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, membership_id, role, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, membership_id, role || 'Member', hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Could not register user. Check if the membership ID already exists.'
                    });
                }

                res.status(201).json({
                    message: 'User registered successfully!',
                    id: result.insertId
                });
            }
        );

    } catch (err) {
        res.status(500).json({
            message: 'Registration failed'
        });
    }
});

// UPDATE a user
router.put('/:id', (req, res) => {
    const { name, membership_id, role } = req.body;

    const sql = `
        UPDATE users
        SET name = ?, membership_id = ?, role = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, membership_id, role, req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Could not update user'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json({
                message: 'User updated successfully!'
            });
        }
    );
});

// DELETE a user
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id],
    (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({ message: 'User deleted successfully!' });
    });
});

module.exports = router;
