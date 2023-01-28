const { deleteComment, patchVotes } = require('../controllers/comments');

const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id')
    .delete(deleteComment)
    .patch(patchVotes)

module.exports = commentsRouter;