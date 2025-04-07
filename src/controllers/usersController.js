const bcrypt = require('bcrypt');
const express = require('express');

const { createToken } = require('../utils/jwt.js');
const prisma = require('../utils/prisma.js');


const router = express.Router();


router.post('/register', (req, res, next) => {
    try {
        const {
            email,
            password,
            firstname,
            lastname,
            birthdate,
        } = req.body;

        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hash,
                    firstname,
                    lastname,
                    birthdate,
                },
            });

            return res.status(201).json(user);
        });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password, } = req.body;

        if (!email || !password) {
            throw new Error('Credentials are missing!');
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        bcrypt.compare(password, user.password)
            .then(result => {
                if (result) {
                    const token = createToken({ id: user.id });
                    return res.status(200).json({ token });
                } else {
                    next(new Error('Incorrect credentials.'));
                }
            });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
