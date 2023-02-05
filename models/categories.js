const db = require('../db/connection');

const fetchAllCategories = () => {
    return db.query(`SELECT * FROM categories`).then(({ rows: categories }) => {
        return categories;
    })
}

const addNewCategory = (slug, description) => {
    return db.query(`INSERT INTO categories (slug, description) VALUES ($1, $2) RETURNING *`, [slug, description]).then(({ rows }) => rows[0]);
}

module.exports = { fetchAllCategories, addNewCategory };