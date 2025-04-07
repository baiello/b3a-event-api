const express = require('express');
const router = express.Router();

const prisma = require('../utils/prisma.js');

const { validateEventCreationInput } = require('../midlewares.js')

// Endpoint to create one event
router.post('/', validateEventCreationInput, async (req, res) => {
    if (!req.user.permissions.includes('events.create')) {
        next('unauthorized');
    }

    try {
        const { title, description, date } = req.body;

        const event = await prisma.event.create({
            data: {
                title: title,
                description: description,
                date: (new Date(date)).toISOString(),
            }
        });

        return res.status(201).json(event);
    } catch (error) {
        return res.status(500).json({ "error": error.message});
    }
});

// Endpoint to list all events
router.get('/', async (req, res, next) => {
    if (!req.user.permissions.includes('events.list')) {
        next('unauthorized');
    }

    try {
        const events = await prisma.event.findMany();
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ "error": error.message});
    }
});

// Endpoint to show one event details
router.get('/:id', async (req, res) => {
    if (!req.user.permissions.includes('events.retrieve')) {
        next('unauthorized');
    }

    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(id),
            }
        });

        return (!event)
            ? res.status(404).json({ "error": "Resource not found" })
            : res.status(200).json(event);
    } catch (error) {
        return res.status(500).json({ "error": error.message});
    }
});

// Endpoint to update one event
router.put('/:id', async (req, res) => {
    if (!req.user.permissions.includes('events.update')) {
        next('unauthorized');
    }

    try {
        const { id } = req.params;

        const { title, description, date } = req.body;

        const event = await prisma.event.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title: title,
                description: description,
                date: date && (new Date(date)).toISOString(),
            }
        });

        return (!event)
            ? res.status(404).json({ "error": "Resource not found" })
            : res.status(200).json(event);
    } catch (error) {
        return res.status(500).json({ "error": error.message});
    }
});

// Endpoint to delete one event
router.delete('/:id', async (req, res) => {
    if (!req.user.permissions.includes('events.delete')) {
        next('unauthorized');
    }

    try {
        const { id } = req.params;

        const event = await prisma.event.delete({
            where: {
                id: parseInt(id),
            }
        });

        return (!event)
            ? res.status(404).json({ "error": "Resource not found" })
            : res.status(204).send(); // 204 => No content
    } catch (error) {
        return res.status(500).json({ "error": error.message});
    }
});

// Endpoint to subscribe a user to one event
router.post('/:id/join', async (req, res, next) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.update({
            where: {
                id: parseInt(id),
            },
            data: {
                users: {
                    connect: {
                        id: req.user.id
                    },
                },
            },
            include: {
                users: true, // Include all users in the returned object
            },
        });

        return res.status(201).json(event);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
