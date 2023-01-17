const request = require('supertest');
const app = require('../app');
const db = require("../db/connection");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index'); const { expect } = require('@jest/globals');
;

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
    test('responds with a 200 status code and with an array of review objects with owner, title, review_id, category, review_img_url, created_at, votes, designer, comment_count properties', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews.length).toBe(13)
                body.reviews.forEach(review => {
                    expect(typeof review.owner).toBe('string');
                    expect(typeof review.title).toBe('string');
                    expect(typeof review.review_id).toBe('number');
                    expect(typeof review.category).toBe('string');
                    expect(typeof review.review_img_url).toBe('string');
                    expect(typeof review.created_at).toBe('string');
                    expect(typeof review.votes).toBe('number');
                    expect(typeof review.designer).toBe('string');
                    expect(typeof review.comment_count).toBe('number');
                })
            })
    });
    test('responds with an array of review objects sorted by date in descending order', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('created_at', { descending: true });
            })
    });
})

describe('/api/reviews/:review_id', () => {
    test('responds with a 200 status code and a review object with review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at properties', () => {
        return request(app)
            .get('/api/reviews/1')
            .expect(200)
            .then(({ body }) => {
                expect(typeof body.review[0].owner).toBe('string');
                expect(typeof body.review[0].title).toBe('string');
                expect(typeof body.review[0].review_id).toBe('number');
                expect(typeof body.review[0].category).toBe('string');
                expect(typeof body.review[0].review_img_url).toBe('string');
                expect(typeof body.review[0].created_at).toBe('string');
                expect(typeof body.review[0].votes).toBe('number');
                expect(typeof body.review[0].designer).toBe('string');
                expect(typeof body.review[0].review_body).toBe('string');
            })
    });
    test('responds with a 404 status code when review_id does not exist', () => {
        return request(app)
            .get('/api/reviews/3000')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('review_id not found');
            })
    });
    test('responds with a 400 status code when passed a review_id of the incorrect data type', () => {
        return request(app)
            .get('/api/reviews/hi')
            .expect(400)
            .then(({ body }) => {
                console.log(body)
                expect(body.message).toBe('bad request');
            })
    });
})