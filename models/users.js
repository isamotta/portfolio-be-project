const db = require("../db/connection");

const fetchAllUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
}

module.exports = { fetchAllUsers };