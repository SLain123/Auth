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
        check('email', 'Wrong email format').isEmail(),
        check('password', 'Uncorrect password, minimum 8 symbols').isLength({
            min: 8,
        }),
        check('firstName', 'User name is missing').notEmpty(),
        check('lastName', 'User surname is missing').notEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            const { email, password, firstName, lastName } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                res.status(400).json({
                    errors: [
                        {
                            msg: 'Username already exists!',
                            value: email,
                            param: 'email',
                        },
                    ],
                });
            }

            const hashedPassword = await bcrypt.hash(password, 11);
            const user = new User({
                email,
                password: hashedPassword,
                firstName,
                lastName,
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
        check('email', 'Type correct email').isEmail(),
        check('password', 'Type password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "User doesn't exist!",
                            value: email,
                            param: 'email',
                        },
                    ],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Password incorrect!',
                            value: email,
                            param: 'email',
                        },
                    ],
                });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1d' },
            );

            res.json({ token, userId: user.id, message: 'Success!' });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

// /api/auth/profile
router.get('/profile', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Unauthorized! Token missing in the request',
                    },
                ],
            });
        }

        const token = req.headers.authorization;
        jwt.verify(token, config.get('jwtSecret'), async (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Token uncorrect',
                        },
                    ],
                });
            }

            const { userId } = decoded;
            const user = await User.findOne({ userId });

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'User not found',
                        },
                    ],
                });
            }

            const { firstName, lastName } = user;
            return res.json({ message: 'User found', firstName, lastName });
        });
    } catch (e) {
        res.status(500).json({ message: 'Something was wrong...' });
    }
});

// /api/auth/profile/change
router.post(
    '/profile/change',
    [
        check('firstName', 'User name is missing').notEmpty(),
        check('lastName', 'User surname is missing').notEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            if (!req.headers.authorization) {
                return res.status(401).json({
                    errors: [
                        {
                            msg: 'Unauthorized! Token missing in the request',
                        },
                    ],
                });
            }

            const token = req.headers.authorization;
            jwt.verify(token, config.get('jwtSecret'), async (err, decoded) => {
                if (err) {
                    return res.status(400).json({
                        errors: [
                            {
                                msg: 'Token uncorrect',
                            },
                        ],
                    });
                }

                const { userId } = decoded;
                const { firstName, lastName } = req.body;

                await User.findOneAndUpdate(
                    { userId },
                    { firstName, lastName },
                    (err) => {
                        if (err) {
                            return res.status(400).json({
                                errors: [
                                    {
                                        msg: 'User not found',
                                    },
                                ],
                            });
                        } else {
                            return res.json({
                                message: 'User data has been changed',
                            });
                        }
                    },
                );
            });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

// /api/auth/upload
router.post('/upload', async (req, res) => {
    console.log(req.body);

    res.send(req.body);
});

module.exports = router;
