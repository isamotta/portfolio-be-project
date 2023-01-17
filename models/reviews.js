const db = require('../db/connection');

const fetchAllReviews = () => {
    return db.query(`
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, 
    (SELECT COUNT(comments.review_id) FROM comments WHERE comments.review_id = reviews.review_id) 
    AS comment_count 
    FROM reviews
    ORDER BY reviews.created_at DESC;
    `).then((result) => {
        return result.rows;
    })
}

module.exports = fetchAllReviews;