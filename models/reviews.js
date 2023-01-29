const db = require('../db/connection');

const fetchAllReviews = (sort_by = 'created_at', order = 'desc', category) => {
    const accepetedSortBy = ['title', 'designer', 'owner', 'review_img_url', 'review_body', 'category', 'created_at', 'review_id', 'votes'];

    const accepetedOrder = ['asc', 'desc'];

    const queryValues = [];

    let queryStr = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, 
    CAST((SELECT COUNT(comments.review_id) FROM comments WHERE comments.review_id = reviews.review_id) AS int)
    AS comment_count
    FROM reviews `;

    if (category) {
        queryStr += `WHERE category = $1 `;
        queryValues.push(category);
    }

    queryStr += `ORDER BY ${sort_by} ${order}`;

    if (!accepetedSortBy.includes(sort_by) || !accepetedOrder.includes(order)) {
        return Promise.reject({ status: 400, message: 'bad request' })
    }
    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    })
}

const fetchCategoryBySlug = (category) => {
    return db.query(`SELECT * FROM categories WHERE slug = $1`, [category]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'category not found' });
        }
        return rows;
    })
}

const fetchReviewById = (review_id) => {
    const query = `SELECT *, CAST((SELECT COUNT(comments.review_id) FROM comments WHERE comments.review_id = reviews.review_id) AS int) AS comment_count FROM reviews WHERE review_id = $1`;

    return db.query(query, [review_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'review_id not found' })
        }
        return rows[0];
    })
}

const fetchCommentsByReviewId = (review_id) => {
    const query = `SELECT * FROM comments WHERE review_id = $1`;
    return db.query(query, [review_id]).then(({ rows }) => rows)
}

const addComment = (review_id, body, username) => {
    const query = `INSERT INTO comments (body, review_id, author) VALUES ($1, $2, (SELECT username FROM users WHERE users.username = $3)) RETURNING comment_id, body, review_id, author;`;
    return db.query(query, [body, review_id, username]).then(({ rows }) => {
        return rows[0];
    })
}

const incrementVotes = (review_id, inc_votes) => {
    const query = `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2`;
    return db.query(query, [inc_votes, review_id])
        .then(() => {
            return db.query(`SELECT review_id, title, designer, owner, review_img_url, review_body, category, votes FROM reviews WHERE review_id = $1`, [review_id])
                .then(({ rows }) => {
                    if (rows.length === 0) {
                        return Promise.reject({ status: 404, message: 'review_id not found' })
                    }
                    return rows[0]
                })
        })
}

const addReview = (owner, title, review_body, designer, category, review_img_url) => {
    const query = `INSERT INTO reviews (title, review_body, designer, review_img_url, owner, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING review_id, votes, created_at;`;
    return db.query(query, [title, review_body, designer, review_img_url, owner, category]).then(({ rows }) => {
        return rows[0];
    })
}

module.exports = { fetchCommentsByReviewId, fetchReviewById, fetchAllReviews, fetchCategoryBySlug, addComment, incrementVotes, addReview };