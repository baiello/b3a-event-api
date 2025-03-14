const jwt = require('jsonwebtoken');

function createToken(data = {}) {
    const token = jwt.sign(
        data,
        process.env.JWT_SECRET,
        { expiresIn: "20s" }
    );

    return token;
}

function verifyAndDecodeToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    createToken,
    verifyAndDecodeToken,
}
