const express = require('express');
const { costumerErrorHandler, psqlErrorHandler, psqlNotFound, routeNotFound, serverErrorHandler } = require('./erros');
const apiRouter = require('./routes/api-router');
const app = express();

app.use(express.json());

app.use('/api', apiRouter)

app.use(costumerErrorHandler)
app.use(psqlErrorHandler)
app.use(psqlNotFound)
app.use(routeNotFound);
app.use(serverErrorHandler);

module.exports = app;