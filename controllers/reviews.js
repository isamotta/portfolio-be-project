const { fetchAllReviews, fetchReviewById, fetchCommentsByReviewId, addComment, incrementVotes, fetchCategoryBySlug, addReview, fetchTotalCount, removeReviewById } = require('../models/reviews')

const getAllReviews = (req, res, next) => {
    const { category, sort_by, order, limit, p } = req.query;

    const promises = [fetchAllReviews(sort_by, order, limit, p, category), fetchTotalCount(category)];

    if (category) {
        promises.push(fetchCategoryBySlug(category));
    }

    Promise.all(promises)
        .then((values) => {
            res.status(200).send({ reviews: values[0], total_count: values[1] });
        })
        .catch((err) => {
            next(err);
        })
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
    const { limit, p } = req.query;

    Promise.all([fetchReviewById(review_id), fetchCommentsByReviewId(review_id, limit, p)])
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

const deleteReview = (req, res, next) => {
    const { review_id } = req.params;
    removeReviewById(review_id).then((result) => {
        res.status(204).send({});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getAllReviews, getReviewById, getCommentsById, postComment, patchVotes, postReview, deleteReview };