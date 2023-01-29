const { fetchAllReviews, fetchReviewById, fetchCommentsByReviewId, addComment, incrementVotes, fetchCategoryBySlug, addReview } = require('../models/reviews')

const getAllReviews = (req, res, next) => {
    const { category, sort_by, order } = req.query;
    if (category) {
        Promise.all([fetchAllReviews(sort_by, order, category), fetchCategoryBySlug(category)]).then((values) => {
            res.status(200).send({ reviews: values[0] });
        }).catch((err) => {
            next(err);
        })
    } else {
        fetchAllReviews(sort_by, order, category).then((reviews) => {
            res.status(200).send({ reviews });
        }).catch((err) => {
            next(err);
        })
    }
}

const getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewById(review_id)
        .then((result) => {
            res.status(200).send({ review: result });
        })
        .catch((err) => {
            next(err);
        })
}

const getCommentsById = (req, res, next) => {
    const { review_id } = req.params;
    Promise.all([fetchReviewById(review_id), fetchCommentsByReviewId(review_id)])
        .then((values) => {
            res.status(200).send({ comments: values[1] })
        })
        .catch((err) => {
            next(err);
        })
}

const postComment = (req, res, next) => {
    const { review_id } = req.params;
    const { body, username } = req.body;
    addComment(review_id, body, username)
        .then((result) => {
            res.status(201).send({ newComment: result });
        })
        .catch((err) => {
            next(err);
        })
}

const patchVotes = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;

    incrementVotes(review_id, inc_votes)
        .then((result) => {
            res.status(200).send({ review: result });
        })
        .catch((err) => {
            next(err);
        })
}

const postReview = (req, res, next) => {
    const { owner, title, review_body, designer, category, review_img_url } = req.body
    addReview(owner, title, review_body, designer, category, review_img_url)
        .then((result) => {
            res.status(201).send({ newReview: result })
        })
        .catch((err) => {
            next(err);
        })
}

module.exports = { getAllReviews, getReviewById, getCommentsById, postComment, patchVotes, postReview };