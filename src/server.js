const express = require("express");
const { z } = require('zod');

const eventsController = require('./controllers/eventsController.js');
const profilesController = require('./controllers/profilesController.js');
const usersController = require('./controllers/usersController.js');

const authMiddleware = require("./middlewares/authMiddleware.js");
const { requestsLogging } = require('./midlewares.js');


const PORT = 3000;

const app = express();


/* -------------------------------------------
 * APP MIDDLEWARES
 * ------------------------------------------- */

app.use(requestsLogging);
app.use(express.json()); // for parsing application/json



app.use('/events', authMiddleware, eventsController);
app.use('/profiles', authMiddleware, profilesController);
app.use('/users', usersController);


/* -------------------------------------------
 * MISC
 * ------------------------------------------- */

app.use((err, req, res, next) => {
    if (err === 'unauthorized') {
        return res.status(403).send('Unauthorized');
    }

    if (err instanceof z.ZodError) {
        const zodErrors = err.issues.map(item => ({ message: `${item.path[0]}: ${item.message}`}))
        return res.status(400).json({ errors: zodErrors});
    }

    return res.status(500).send('Something broke!');
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
