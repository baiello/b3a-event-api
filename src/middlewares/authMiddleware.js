const { verifyAndDecodeToken } = require('../utils/jwt.js');
const prisma = require('../utils/prisma.js');

async function authMiddleware(req, res, next) {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        const { id } = verifyAndDecodeToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });

        if (!user) {
            throw new Error();
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authMiddleware;