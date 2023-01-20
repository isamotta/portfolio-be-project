const { removeComment } = require('../models/comments');

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then(() => {
        res.status(204).send({})
    }).catch((err) => {
        next(err)
    })
}

module.exports = { deleteComment };