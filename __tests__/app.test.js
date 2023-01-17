const request = require('supertest');
const app = require('../app');
const db = require("../db/connection");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');;

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe("/not-a-route", () => {
    test('responds with a 404 status code when using an endpoint that does not exist', () => {
        return request(app)
            .get('/not-a-route')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('does not exist');
            })
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
                    expect(category).toHaveProperty('description');
                });
            })
    });
})

describe('/api/reviews', () => {
    test('responds with a 200 status code', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
    })
    test('responds with an array of review objects with owner, title, review_id, category, review_img_url, created_at, votes, designer, comment_count properties', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews.length).toBe(13)
                body.reviews.forEach(review => {
                    expect(review).toHaveProperty('owner');
                    expect(review).toHaveProperty('title');
                    expect(review).toHaveProperty('review_id');
                    expect(review).toHaveProperty('category');
                    expect(review).toHaveProperty('review_img_url');
                    expect(review).toHaveProperty('created_at');
                    expect(review).toHaveProperty('votes');
                    expect(review).toHaveProperty('designer');
                    expect(review).toHaveProperty('comment_count');
                })
            })
    });
    test('responds with an array of review objects sorted by date in descending order', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews[body.reviews.length - 1].review_id).toBe(13);
                expect(body.reviews[0].review_id).toBe(7);
            })
    });
})