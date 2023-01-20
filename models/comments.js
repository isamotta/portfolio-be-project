const db = require('../db/connection');

const removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]).then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, message: 'comment not found' })
        }
    })
}


module.exports = { removeComment };