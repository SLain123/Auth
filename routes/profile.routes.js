const { Router } = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = Router();

// /api/profile
router.get('/', async (req, res) => {
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
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'User not found',
                        },
                    ],
                });
            }

            const { nickName, avatar } = user;
            return res.json({
                message: 'User found',
                nickName,
                avatar,
            });
        });
    } catch (e) {
        res.status(500).json({ message: 'Something was wrong...' });
    }
});

// /api/profile
router.post(
    '/',
    [check('nickName', 'User nick name is missing').notEmpty()],
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
                const { nickName } = req.body;

                await User.findOneAndUpdate(
                    { _id: userId },
                    { nickName },
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

// /api/profile/avatar
router.post(
    '/avatar',
    [check('avatar', 'Avatar must be base64 format').notEmpty()],
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
                const { avatar } = req.body;

                await User.findOneAndUpdate(
                    { _id: userId },
                    { avatar },
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

module.exports = router;
