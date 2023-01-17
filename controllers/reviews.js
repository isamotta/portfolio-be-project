const fetchAllReviews = require('../models/reviews')

const getAllReviews = (req, res, next) => {
    fetchAllReviews().then((result) => {
        res.status(200).send({ reviews: result });
    }).catch((err) => {
        next(err);
    })
}

module.exports = getAllReviews;