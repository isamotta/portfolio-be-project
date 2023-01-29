const costumerErrorHandler = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else {
        next(err);
    }
}

const psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        res.status(400).send({ message: 'bad request' });
    } else {
        next(err);
    }
}

const psqlNotFound = (err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({ message: 'not found' });
    } else {
        next(err);
    }
}

const routeNotFound = (req, res, next) => {
    res.status(404).send({ message: 'route does not exist' });
}

const serverErrorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: 'internal server error' });
}

module.exports = { costumerErrorHandler, psqlErrorHandler, psqlNotFound, routeNotFound, serverErrorHandler }