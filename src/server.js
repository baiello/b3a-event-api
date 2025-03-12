const express = require("express");
const { PrismaClient } = require("@prisma/client")

const PORT = 3000;

const app = express();
const prisma = new PrismaClient();

app.use(express.json()) // for parsing application/json

// Endpoint to create one event
app.post('/events', async (req, res) => {
    try {
        const { title, description, date } = req.body;

        if (!title || !description || !date) {
            throw new Error("Input is missing");
        }

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

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
