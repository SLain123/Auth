const { Router } = require('express');
const Timer = require('../models/Timer');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const router = Router();
const auth = require('../middleware/auth.middleware');

// /api/timer/create
router.post(
    '/create',
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
            if (total <= 999 || total > 360000000) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Time must be more then 0 and less then 100 hours',
                });
            }

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
                activateDate: new Date(),
                timeToEnd: null,
                restTime: 0,
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

// /api/timer/all
router.get('/all', auth, async (req, res) => {
    try {
        const timerList = await Timer.find({ ownerId: req.user.userId });

        if (!timerList || !timerList.length) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Timers were not found or do not exist',
                    },
                ],
                timerList: [],
            });
        }

        res.status(201).json({ message: 'Timers was found', timerList });
    } catch (e) {
        res.status(500).json({ message: 'Something was wrong...' });
    }
});

// /api/timer
router.post(
    '/',
    [check('timerId', 'You need specify timer id')],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            const timer = await Timer.findOne({ _id: req.body.timerId });

            if (!timer) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Timer was not found or do not exist',
                        },
                    ],
                });
            }

            res.status(201).json({ message: 'Timers was found', timer });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

// /api/timer/control
router.post(
    '/control',
    [
        check('timerId', 'You need specify timer id').notEmpty(),
        check(
            'actOption',
            'You need specify which action need to do',
        ).notEmpty(),
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

            const { timerId, actOption } = req.body;
            const timer = await Timer.findOne({ _id: timerId });

            if (!timer) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Timer doesn not exist',
                        },
                    ],
                });
            }

            if (timer.ownerId !== req.user.userId) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: `The timer has not match this user`,
                        },
                    ],
                });
            }

            const result = await Timer.findOneAndUpdate(
                { _id: timerId },
                {
                    timeToEnd:
                        actOption === 'play'
                            ? new Date(
                                  new Date().getTime() +
                                      (timer.restTime
                                          ? timer.restTime
                                          : timer.total),
                              )
                            : null,
                    restTime:
                        actOption === 'pause' && timer.timeToEnd
                            ? timer.timeToEnd.getTime() - new Date().getTime()
                            : 0,
                    activateDate: new Date(),
                },
            );

            if (!result) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `The timer has not been changed. Something went wrong with action ${actOption}`,
                        },
                    ],
                });
            }

            return res.json({
                message: `Action ${actOption} has been completed `,
            });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

// /api/timer
router.delete(
    '/',
    [check('timerId', 'You need specify timer id').notEmpty()],
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

            const timer = await Timer.findOne({ _id: req.body.timerId });

            if (!timer) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Timer doesn not exist',
                        },
                    ],
                });
            }

            if (timer.ownerId !== req.user.userId) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: `The timer has not match this user`,
                        },
                    ],
                });
            }

            const timerAfterDeleted = await Timer.deleteOne({
                _id: req.body.timerId,
            });

            if (!timerAfterDeleted.deletedCount) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Timer was not found or do not exist',
                        },
                    ],
                });
            }

            res.status(201).json({ message: 'Timer was remove' });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

// /api/timer/change
router.post(
    '/change',
    [
        check('timerId', 'You need specify timer id').notEmpty(),
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

            const { timerId, label, total } = req.body;
            const timer = await Timer.findOne({ _id: timerId });

            if (!timer) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: 'Timer doesn not exist',
                        },
                    ],
                });
            }

            if (timer.ownerId !== req.user.userId) {
                return res.status(404).json({
                    errors: [
                        {
                            msg: `The timer has not match this user`,
                        },
                    ],
                });
            }

            const result = await Timer.findOneAndUpdate(
                { _id: timerId },
                {
                    label,
                    total,
                    restTime: 0,
                    timeToEnd: null,
                    activateDate: new Date(),
                },
            );

            if (!result) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `The timer has not been changed. Something went wrong, check timerId`,
                        },
                    ],
                });
            }

            res.status(201).json({
                message: 'Timer was change',
                timer: {
                    _id: result._doc._id,
                    activateDate: new Date(),
                    ownerId: result._doc.ownerId,
                    ownerNick: result._doc.ownerNick,
                    label,
                    total,
                    restTime: 0,
                    timeToEnd: null,
                },
            });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

module.exports = router;
