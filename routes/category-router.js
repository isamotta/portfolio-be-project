const { getAllCategories, postCategory } = require('../controllers/categories');

const categoryRouter = require('express').Router();

categoryRouter.route('/')
    .get(getAllCategories)
    .post(postCategory)

module.exports = categoryRouter;