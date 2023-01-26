const { getAllUsers } = require('../controllers/users');

const usersRouter = require('express').Router();

usersRouter.route('/')
    .get(getAllUsers)

module.exports = usersRouter