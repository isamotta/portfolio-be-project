const express = require('express');
const { getAllCategories } = require('./controllers/categories')
const app = express();

app.get('/api/categories', getAllCategories)

app.use((err, req, res, next) => {
    res.status(500).send({ message: 'internal server error' })
})

module.exports = app;