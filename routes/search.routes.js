const { Router } = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const router = Router();

// /api/search/user
router.post(
    '/user',
    [check('searchWord', 'Search word (user nick name) is missing').notEmpty()],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Data uncorrect!',
                });
            }

            const { searchWord } = req.body;
            const result = await User.find({
                nickName: { $regex: `^${searchWord}`, $options: 'i' },
            });

            if (!result || !result.length) {
                return res
                    .status(200)
                    .json({ message: 'User was not found.', users: [] });
            }

            return res.json({ message: 'User/s found.', users: result });
        } catch (e) {
            res.status(500).json({ message: 'Something was wrong...' });
        }
    },
);

module.exports = router;
