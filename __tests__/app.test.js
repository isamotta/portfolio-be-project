const request = require('supertest');
const app = require('../app');
const db = require("../db/connection");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index')

beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
    return db.end()
})

describe("/not-a-route", () => {
    test('responds with a 404 status code when using an API that does not exist', () => {
        return request(app)
            .get('/not-a-route')
            .expect(404);
    });
})
describe("/api/categories", () => {
    test('responds with a 200 status code and all the categories with a slug and a description property', () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body }) => {
                expect(body.categories.length).toBe(4);
                body.categories.forEach(category => {
                    expect(category).toHaveProperty('slug');
                    expect(category).toHaveProperty('description')
                });
            })
    });
})