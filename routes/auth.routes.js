const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Wrong email format').isEmail,
        check('password', 'Uncorrect password, minimum 8 symbols').isLength({
            min: 8,
        }),
        check(
            'firstName',
            'You need specify your name, minimum 3 symbols',
        ).isLength({ min: 3 }),
        check(
            'lastName',
            'You need specify your last name, minimum 3 symbols',
        ).isLength({ min: 3 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            const { email, password, firstName, lastName } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                res.status(400).json({ message: 'Email already exists!' });
            }

            const hashedPassword = await bcrypt.hash(password, 11);
            const user = new User({
                email,
                firstName,
                lastName,
                password: hashedPassword,
            });

            await user.save();

            res.status(201).json({ message: 'User was create!' });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Type correct email').normalizeEmail().isEmail(),
        check('password', 'Type password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "User doesn't exist!" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Password incorrect!' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' },
            );

            res.json({ token, userId: user.id });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

router.get('/test', () => console.log('test'));

module.exports = router;
