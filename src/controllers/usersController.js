const bcrypt = require('bcrypt');
const express = require('express');

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

module.exports = router;