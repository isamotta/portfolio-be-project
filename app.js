const express = require('express');
const getAllCategories = require('./controllers/categories');
const { getAllReviews, getReviewById } = require('./controllers/reviews');
const app = express();

app.get('/api/categories', getAllCategories);
app.get('/api/reviews', getAllReviews);
app.get('/api/reviews/:review_id', getReviewById)

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: 'bad request' });
    } else {
        next(err);
    }
})
app.use((req, res, next) => {
    res.status(404).send({ message: 'does not exist' });
});


app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: 'internal server error' });
});

module.exports = app;