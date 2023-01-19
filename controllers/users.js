const { fetchAllUsers } = require('../models/users')

const getAllUsers = (req, res, next) => {
    fetchAllUsers().then((result) => {
        res.status(200).send({ users: result })
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getAllUsers };