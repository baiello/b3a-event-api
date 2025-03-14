const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { z } = require('zod');

const { requestsLogging, validateEventCreationInput } = require('./midlewares.js');

const PORT = 3000;

const app = express();
const prisma = new PrismaClient();


/* -------------------------------------------
 * APP MIDDLEWARES
 * ------------------------------------------- */

app.use(express.json()); // for parsing application/json
app.use(requestsLogging);


/* -------------------------------------------
 * ENDPOINTS
 * ------------------------------------------- */

// Endpoint to create one event
app.post('/events', validateEventCreationInput, async (req, res) => {
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
app.get('/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ "error": error.message});
    }
});

// Endpoint to show one event details
app.get('/events/:id', async (req, res) => {
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
app.put('/events/:id', async (req, res) => {
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
app.delete('/events/:id', async (req, res) => {
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

/* -------------------------------------------
 * MISC
 * ------------------------------------------- */

app.use((err, req, res, next) => {
    console.log(err);

    if (err instanceof z.ZodError) {
        const zodErrors = err.issues.map(item => ({ message: `${item.path[0]}: ${item.message}`}))
        return res.status(400).json({ errors: zodErrors});
    }

    return res.status(500).send('Something broke!');
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
