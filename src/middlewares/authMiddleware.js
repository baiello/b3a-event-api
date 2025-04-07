const { verifyAndDecodeToken } = require('../utils/jwt.js');
const prisma = require('../utils/prisma.js');

async function authMiddleware(req, res, next) {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        const { id } = verifyAndDecodeToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                profiles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });

        if (!user) {
            throw new Error();
        }

        const userPermissions = new Set();
        user.profiles.forEach(profile => {
            profile.permissions.forEach(permission => {
                userPermissions.add(permission.permission);
            })
        });

        delete user.profiles;
        user.permissions = [...userPermissions];

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authMiddleware;