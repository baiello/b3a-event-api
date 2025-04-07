const { z } = require('zod');

/* -------------------------------------------
 * ZOD SCHEMAS
 * ------------------------------------------- */

const EventCreationSchema = z.object({
    title: z.string().min(3).trim(),
    description: z.string().min(10).trim(),
    date: z.string().datetime(),
});


/* -------------------------------------------
 * MIDDLEWARES
 * ------------------------------------------- */

function requestsLogging(req, res, next) {
    const requestStartDate = new Date();

    res.once("finish", () => {
        const requestHandlingTime = new Date() - requestStartDate;
        console.log(`[${requestStartDate.toISOString()}] ${req.method} ${req.url} - ${requestHandlingTime}ms`);
    });

    next();
}

function validateEventCreationInput(req, res, next) {
    EventCreationSchema.parse(req.body);
    next();
}


/* -------------------------------------------
 * EXPORTS
 * ------------------------------------------- */

module.exports = {
    requestsLogging,
    validateEventCreationInput,
}
