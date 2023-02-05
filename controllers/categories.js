const { fetchAllCategories, addNewCategory } = require('../models/categories')

const getAllCategories = (req, res, next) => {
    fetchAllCategories()
        .then((result) => {
            res.status(200).send({ categories: result })
        })
        .catch((err) => {
            next(err);
        });
}

const postCategory = (req, res, next) => {
    const { slug, description } = req.body;

    addNewCategory(slug, description)
        .then((result) => {
            res.status(201).send({ newCategory: result })
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { getAllCategories, postCategory }