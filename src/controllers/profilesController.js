const express = require('express');
const router = express.Router();

const prisma = require('../utils/prisma.js');

router.post('/', async (req, res, next) => {
    if (!req.user.permissions.includes('profiles.create')) {
        next('unauthorized');
    }

    try {
        const { name, description, permissions } = req.body;

        const profile = await prisma.profile.create({
            data: {
                name: name,
                description: description,
                permissions: {
                    connect: permissions.map(permission => ({ id: permission }))
                }
            },
            include: {
                permissions: true,
            }
        });

        return res.status(201).json(profile);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
