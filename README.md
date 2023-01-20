# Northcoders House of Games API

This is an API of games reviews, written using Node.js (minimum version 19.3) and postgreSQL (minimum version 12.12).

## Background

I am building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Host link

You can find the hosted version [here](https://nc-games-be-project.onrender.com)

## Available Endpoints

To check all the available endpoints click [here](https://nc-games-be-project.onrender.com/api)

## Installation

Clone this repo down on to you local machine https://github.com/isamotta/portfolio-be-project.git

You will need to have install:

> node
> postgreSQL
> dotenv
> express
> pg
> pg-format
> jest
> jest-sorted
> supertest

## To connect the database locally

The database used is PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

You'll need to create the environment variables in order to successfully connect to the two databases locally. You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment.

## Testing

To test run the command: **npm run test**
