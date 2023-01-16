const { fetchAllCategories } = require('../models/categories')

const getAllCategories = (req, res, next) => {
    fetchAllCategories().then((result) => {
        res.status(200).send({ categories: result })
    })
}

module.exports = { getAllCategories }