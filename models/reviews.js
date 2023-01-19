const db = require('../db/connection');

const fetchAllReviews = () => {
    return db.query(`
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, 
    CAST((SELECT COUNT(comments.review_id) FROM comments WHERE comments.review_id = reviews.review_id) AS int)
    AS comment_count
    FROM reviews
    ORDER BY reviews.created_at DESC;
    `).then((result) => {
        return result.rows;
    })
}

const fecthReviewById = (review_id) => {
    const query = `SELECT * FROM reviews WHERE review_id = $1`
    return db.query(query, [review_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'review_id not found' })
        }
        return rows[0];
    })
}

const fecthCommentsByReviewId = (review_id) => {
    const query = `SELECT * FROM comments WHERE review_id = $1`;
    return db.query(query, [review_id]).then(({ rows }) => rows)
}

const addComment = (review_id, body, username) => {
    const query = `INSERT INTO comments (body, review_id, author) VALUES ($1, $2, (SELECT username FROM users WHERE users.username = $3)) RETURNING comment_id, body, review_id, author;`;
    return db.query(query, [body, review_id, username]).then(({ rows }) => {
        return rows[0];
    })
}

module.exports = { fetchAllReviews, fecthReviewById, fecthCommentsByReviewId, addComment };