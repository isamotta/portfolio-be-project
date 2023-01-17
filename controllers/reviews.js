const { fetchAllReviews, fecthReviewById } = require('../models/reviews')

const getAllReviews = (req, res, next) => {
    fetchAllReviews().then((result) => {
        res.status(200).send({ reviews: result });
    }).catch((err) => {
        next(err);
    })
}

const getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    fecthReviewById(review_id).then((result) => {
        res.status(200).send({ review: result })
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getAllReviews, getReviewById };