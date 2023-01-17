const db = require('../db/connection');

const fetchAllCategories = () => {
    return db.query(`SELECT * FROM categories`).then(({ rows: categories }) => {
        return categories;
    })
}

module.exports = fetchAllCategories;