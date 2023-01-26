const getAllEndpoints = require('../controllers/endpoint');
const categoryRouter = require('./category-router');
const commentsRouter = require('./comments-router');
const reviewRouter = require('./review-router');
const usersRouter = require('./users-router');

const apiRouter = require('express').Router();

apiRouter.get('/', getAllEndpoints);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;