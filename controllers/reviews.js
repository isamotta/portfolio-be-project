const { fetchAllReviews, fecthReviewById, fecthCommentsByReviewId } = require('../models/reviews')

const getAllReviews = (req, res, next) => {
    fetchAllReviews().then((result) => {
        res.status(200).send({ reviews: result });
    }).catch((err) => {
        next(err);
    })
}

const getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    fecthReviewById(review_id)
        .then(([result]) => {
            res.status(200).send({ review: result });
        })
        .catch((err) => {
            next(err);
        })
}

const getCommentsById = (req, res, next) => {
    const { review_id } = req.params;
    Promise.all([fecthReviewById(review_id), fecthCommentsByReviewId(review_id)])
        .then((values) => {
            res.status(200).send({ comments: values[1] })
        })
        .catch((err) => {
            next(err);
        })
}

module.exports = { getAllReviews, getReviewById, getCommentsById };