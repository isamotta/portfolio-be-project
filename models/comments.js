const db = require('../db/connection');

const removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
        .then(({ rowCount }) => {
            if (rowCount === 0) {
                return Promise.reject({ status: 404, message: 'comment not found' });
            }
        });
}

const incrementVotes = (comment_id, inc_votes) => {
    const query = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2`;

    return db.query(query, [inc_votes, comment_id])
        .then(() => {
            return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
                .then(({ rows }) => {
                    if (rows.length === 0) {
                        return Promise.reject({ status: 404, message: 'comment_id not found' });
                    }
                    return rows[0];
                });
        });
}


module.exports = { removeComment, incrementVotes };