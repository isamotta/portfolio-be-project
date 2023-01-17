const express = require('express');
const { getAllCategories } = require('./controllers/categories');
const app = express();

app.get('/api/categories', getAllCategories);

app.use((req, res, next) => {
    res.status(404).send({ message: 'does not exist' });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: 'internal server error' });
});

app.listen(9090, () => {
    console.log(`listening on 9090...`);
});

module.exports = app;