const express = require('express');
const getAllCategories = require('./controllers/categories');
const getAllReviews = require('./controllers/reviews');
const app = express();

app.get('/api/categories', getAllCategories);
app.get('/api/reviews', getAllReviews);

app.use((req, res, next) => {
    res.status(404).send({ message: 'does not exist' });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: 'internal server error' });
});

module.exports = app;