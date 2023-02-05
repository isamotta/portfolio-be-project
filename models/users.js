const db = require("../db/connection");

const fetchAllUsers = () => {
    return db.query(`SELECT * FROM users;`)
        .then(({ rows }) => rows);
}

const fetchUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: 'username not found' });
            }

            return rows[0];
        });
}

module.exports = { fetchAllUsers, fetchUserByUsername };