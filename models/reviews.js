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
        return rows;
    })
}

module.exports = { fetchAllReviews, fecthReviewById };