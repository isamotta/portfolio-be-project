const { fetchAllUsers, fetchUserByUsername } = require('../models/users')

const getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then((result) => {
            res.status(200).send({ users: result })
        })
        .catch((err) => {
            next(err);
        });
}

const getUserByUsername = (req, res, next) => {
    const { username } = req.params;

    fetchUserByUsername(username)
        .then((result) => {
            res.status(200).send({ user: result })
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { getAllUsers, getUserByUsername };