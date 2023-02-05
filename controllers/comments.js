const { removeComment, incrementVotes } = require('../models/comments');

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;

    removeComment(comment_id)
        .then(() => {
            res.status(204).send({})
        })
        .catch((err) => {
            next(err)
        });
}

const patchVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    incrementVotes(comment_id, inc_votes)
        .then((result) => {
            res.status(200).send({ comment: result });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { deleteComment, patchVotes };