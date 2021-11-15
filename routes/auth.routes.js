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
        check('password', 'Uncorrect password, minimum 6 symbols').isLength({
            min: 6,
        }),
        check('nickName', 'User nick name is missing').notEmpty(),
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

            const { email, password, nickName } = req.body;
            const candidateByMail = await User.findOne({ email });
            const candidateByNick = await User.findOne({ nickName });

            if (candidateByMail || candidateByNick) {
                candidateByMail &&
                    res.status(400).json({
                        errors: [
                            {
                                msg: 'User email already exists!',
                                value: email,
                                param: 'email',
                            },
                        ],
                    });

                candidateByNick &&
                    res.status(400).json({
                        errors: [
                            {
                                msg: 'User nick already exists!',
                                value: nickName,
                                param: 'nickName',
                            },
                        ],
                    });
            }

            const hashedPassword = await bcrypt.hash(password, 11);
            const user = new User({
                email,
                password: hashedPassword,
                nickName,
                avatar: null,
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

// /api/auth/check
router.get('/check', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Unauthorized! Token missing in the request',
                        validate: false,
                    },
                ],
            });
        }

        const token = req.headers.authorization;
        jwt.verify(token, config.get('jwtSecret'), async (err) => {
            if (err) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Token uncorrect',
                            validate: false,
                        },
                    ],
                });
            }

            return res.json({ message: 'Token correct', validate: true });
        });
    } catch (e) {
        res.status(500).json({ message: 'Something was wrong...' });
    }
});

module.exports = router;
