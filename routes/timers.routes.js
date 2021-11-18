const { Router } = require('express');
const Timer = require('../models/Timer');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const router = Router();
const auth = require('../middleware/auth.middleware');

// /api/timer
router.post(
    '/',
    [
        check('label', 'You need specify timer name').notEmpty(),
        check('total', 'You need send total timer time').notEmpty(),
    ],
    auth,
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            const { label, total } = req.body;
            const user = await User.findOne({ _id: req.user.userId });

            if (!user) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'User not found',
                        },
                    ],
                });
            }

            const timer = new Timer({
                label,
                total,
                startTime: new Date(),
                ownerId: user._id,
                ownerNick: user.nickName,
            });

            await timer.save();

            res.status(201).json({ message: 'Timer was create' });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

// /api/timer
router.get('/', auth, async (req, res) => {
    try {
        const timerList = await Timer.find({ ownerId: req.user.userId });

        if (!timerList || !timerList.length) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Timers were not found or do not exist',
                    },
                ],
            });
        }

        res.status(201).json({ message: 'Timers was found', timerList });
    } catch (e) {
        res.status(500).json({ message: 'Something was wrong...' });
    }
});

module.exports = router;
