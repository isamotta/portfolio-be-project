const { getAllUsers, getUserByUsername } = require('../controllers/users');

const usersRouter = require('express').Router();

usersRouter.route('/')
    .get(getAllUsers)
usersRouter.route('/:username')
    .get(getUserByUsername)

module.exports = usersRouter