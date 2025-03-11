const express = require("express");

const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
