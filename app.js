const express = require('express');
const getAllCategories = require('./controllers/categories');
const { getAllReviews, getReviewById, getCommentsById, postComment, patchVotes } = require('./controllers/reviews');
const { getAllUsers } = require('./controllers/users');
const { deleteComment } = require('./controllers/comments')
const app = express();

app.use(express.json());

app.get('/api/categories', getAllCategories);
app.get('/api/reviews', getAllReviews);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/reviews/:review_id/comments', getCommentsById);
app.post('/api/reviews/:review_id/comments', postComment);
app.patch('/api/reviews/:review_id', patchVotes);
app.get('/api/users', getAllUsers);
app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({ message: 'bad request' });
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({ message: 'review_id not found' });
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