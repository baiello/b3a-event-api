const jwt = require('jsonwebtoken');

function createToken(data = {}) {
    const token = jwt.sign(
        data,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return token;
}

module.exports = {
    createToken,
}
