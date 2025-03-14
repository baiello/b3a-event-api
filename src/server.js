const express = require("express");
const { z } = require('zod');

const eventsController = require('./controllers/eventsController.js');
const usersController = require('./controllers/usersController.js');

const { requestsLogging } = require('./midlewares.js');

const PORT = 3000;

const app = express();


/* -------------------------------------------
 * APP MIDDLEWARES
 * ------------------------------------------- */

app.use(express.json()); // for parsing application/json
app.use(requestsLogging);


app.use('/events', eventsController);
app.use('/users', usersController);


/* -------------------------------------------
 * MISC
 * ------------------------------------------- */

app.use((err, req, res, next) => {
    if (err instanceof z.ZodError) {
        const zodErrors = err.issues.map(item => ({ message: `${item.path[0]}: ${item.message}`}))
        return res.status(400).json({ errors: zodErrors});
    }

    return res.status(500).send('Something broke!');
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
