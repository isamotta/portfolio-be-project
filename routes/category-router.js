const getAllCategories = require('../controllers/categories');

const categoryRouter = require('express').Router();

categoryRouter.route('/')
    .get(getAllCategories)

module.exports = categoryRouter;