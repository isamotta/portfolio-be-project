# Northcoders House of Games API

## Overview

This service exposes an API for games reviews. As a user, you can create reviews that belongs to given category, which can receive comments and votes by other users.

## Host

Documentation for the use of the API can be found [here](https://nc-games-be-project.onrender.com/api)

## How to run the service

### Requirements

It's required to install the following tools in order to run it locally:

- [Node](https://nodejs.org/en/download/) version >= 19.3
- [PostgreSQL](https://www.postgresql.org/) version >= 12.12
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://expressjs.com/)
- [node-postgres](https://node-postgres.com/)
- [pg-format](https://www.npmjs.com/package/pg-format)
- [jest](https://www.npmjs.com/package/jest)
- [jest-sorted](https://www.npmjs.com/package/jest-sorted)
- [supertest](https://www.npmjs.com/package/supertest)


### Database configuration

It's necessary to create the environment variables in order to successfully connect to the local database. Add a new file called ```.env``` to the root folder with the following content: 

```
PGDATABASE=nc_games
```

### Running

Execute the following command:

```
node listen.js
```

## Running local tests

Execute the following command:

```
npm test
```
