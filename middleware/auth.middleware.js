const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized! Token missing in the request',
            });
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Unauthorized! Token missing or uncorrect',
        });
    }
};
