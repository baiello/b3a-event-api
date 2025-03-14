const { verifyAndDecodeToken } = require('../utils/jwt.js');

function authMiddleware(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1];
    verifyAndDecodeToken(token);
    next();
}

module.exports = authMiddleware;