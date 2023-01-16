const express = require('express');
const { getAllCategories } = require('./controllers/categories')
const app = express();

app.get('/api/categories', getAllCategories)

module.exports = app;