const { getAllReviews, getReviewById, patchVotes, getCommentsById, postComment, postReview } = require('../controllers/reviews');

const reviewRouter = require('express').Router();

reviewRouter.route("/")
    .get(getAllReviews)
    .post(postReview)
reviewRouter.route("/:review_id")
    .get(getReviewById)
    .patch(patchVotes)
reviewRouter.route("/:review_id/comments")
    .get(getCommentsById)
    .post(postComment)

module.exports = reviewRouter;