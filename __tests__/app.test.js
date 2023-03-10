const request = require('supertest');
const app = require('../app');
const db = require("../db/connection");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const { rows } = require('pg/lib/defaults');


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
                expect(body.message).toBe('route does not exist');
            })
    });
});

describe("GET - /api/categories", () => {
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
});

describe("POST - api/categories", () => {
    test('responds with a 201 status code and accepts a new category', () => {
        const newCategory = {
            slug: 'board',
            description: 'games to play with friends'
        };
        return request(app)
            .post('/api/categories')
            .send(newCategory)
            .expect(201)
            .then(({ body }) => {
                expect(body.newCategory.slug).toBe('board');
                expect(body.newCategory.description).toBe('games to play with friends');
            })
    });
    test('responds with a 400 status code when slug is missing in the passed body', () => {
        const newCategory = {
            description: 'games to play with friends'
        };
        return request(app)
            .post('/api/categories')
            .send(newCategory)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
});

describe('GET - /api/reviews', () => {
    test('responds with a 200 status code and with an array of review objects with owner, title, review_id, category, review_img_url, created_at, votes, designer, comment_count properties ', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                body.reviews.forEach(review => {
                    expect(typeof review.owner).toBe('string');
                    expect(typeof review.title).toBe('string');
                    expect(typeof review.review_id).toBe('number');
                    expect(typeof review.category).toBe('string');
                    expect(typeof review.review_img_url).toBe('string');
                    expect(typeof review.created_at).toBe('string');
                    expect(typeof review.votes).toBe('number');
                    expect(typeof review.designer).toBe('string');
                    expect(typeof review.comment_count).toBe('string');
                })
            })
    });
    test('responds with an array of all reviews sorted by date in descending order if no sort_by or order query is passed', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('created_at', { descending: true });
            })
    });
    test('accepts an order query and responds with an array of review objects sorted by date and ordered by query', () => {
        return request(app)
            .get('/api/reviews?order=asc')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('created_at');
            })
    });
    test('accepts a sort_by query and responds with an array of review objects sorted by query in descending order if no order is passed', () => {
        return request(app)
            .get('/api/reviews?sort_by=title')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('title', { descending: true });
            })
    });
    test('accepts a sort_by query and responds with an array of review objects sorted by query in descending order if no order is passed', () => {
        return request(app)
            .get('/api/reviews?sort_by=comment_count')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('comment_count', { descending: true });
            })
    });
    test('accepts a category query and responds with an array of reviews selected by the category', () => {
        return request(app)
            .get('/api/reviews?category=dexterity')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews.length).toBe(1);
                expect(body.reviews[0].title).toBe('Jenga');
            })
    });
    test('responds with a 400 status code when passed an invalid sort_by query', () => {
        return request(app)
            .get('/api/reviews?sort_by=name')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 400 status code when passed an invalid order query', () => {
        return request(app)
            .get('/api/reviews?order=asce')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 404 status code when passed a category that does not exist', () => {
        return request(app)
            .get('/api/reviews?category=dogs&cats')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('category not found');
            })
    });
    test('responds with a 200 status code when passed a category that does not have any reviews', () => {
        return request(app)
            .get('/api/reviews?category=children\'s games')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews.length).toBe(0);
            })
    });
    test('responds with 200 status code and a list with 10 reviews when no limit is specified', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                expect(body.total_count).toBe(13);
                expect(body.reviews.length).toBe(10);
            })
    });
    test('responds with 200 status code and five reviews when limit is passed as query with value of five', () => {
        return request(app)
            .get('/api/reviews?limit=5')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews.length).toBe(5);
            })
    });
    test('responds with 200 status code and pagination of two reviews when passed limit of two and page is specified', () => {
        return request(app)
            .get('/api/reviews?sort_by=title&order=asc&limit=2&p=1')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews[0].title).toBe('A truly Quacking Game; Quacks of Quedlinburg');
                expect(body.reviews[1].title).toBe('Agricola');
            })
    });
    test('responds with 200 status code and pagination of two reviews when passed limit of two and page is two', () => {
        return request(app)
            .get('/api/reviews?sort_by=title&order=asc&limit=2&p=2')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews[0].title).toBe('Build you own tour de Yorkshire');
                expect(body.reviews[1].title).toBe('Dolor reprehenderit');
            })
    });
});

describe('POST - /api/reviews', () => {
    test('responds with a 201 status code and accepts a review', () => {
        const newReview = {
            owner: 'philippaclaire9',
            title: 'noughts and crosses',
            review_body: 'good for children',
            designer: 'Jenna K',
            category: "children's games",
            review_img_url: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/tic-tac-toe-noughts-and-crosses-game-elena-sysoeva.jpg'
        };
        return request(app)
            .post('/api/reviews')
            .send(newReview)
            .expect(201)
            .then(({ body }) => {
                expect(body.newReview).toHaveProperty('created_at');
                expect(body.newReview.review_id).toBe(14)
                expect(body.newReview.votes).toBe(0)
                expect(body.newReview.comment_count).toBe(0)
                expect(body.newReview.owner).toBe('philippaclaire9');
                expect(body.newReview.title).toBe('noughts and crosses');
                expect(body.newReview.review_body).toBe('good for children');
                expect(body.newReview.designer).toBe('Jenna K');
                expect(body.newReview.category).toBe("children's games");
                expect(body.newReview.review_img_url).toBe('https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/tic-tac-toe-noughts-and-crosses-game-elena-sysoeva.jpg');
            })
    });
    test('responds with a default review_img_url if not provided', () => {
        const newReview = {
            owner: 'philippaclaire9',
            title: 'noughts and crosses',
            review_body: 'good for children',
            designer: 'Jenna K',
            category: "children's games"
        };
        return request(app)
            .post('/api/reviews')
            .send(newReview)
            .expect(201)
            .then(({ body }) => {
                expect(body.newReview.review_img_url).toBe('https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?w=700&h=700');
            })
    });
    test('responds with a 404 status code when given an owner thats does not exist', () => {
        const newReview = {
            owner: 'isa',
            title: 'noughts and crosses',
            review_body: 'good for children',
            designer: 'Jenna K',
            category: "children's games"
        };
        return request(app)
            .post('/api/reviews')
            .send(newReview)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('not found')
            })
    });
    test('responds with a 404 status code when given a category thats does not exist', () => {
        const newReview = {
            owner: 'philippaclaire9',
            title: 'noughts and crosses',
            review_body: 'good for children',
            designer: 'Jenna K',
            category: "boards game"
        };
        return request(app)
            .post('/api/reviews')
            .send(newReview)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('not found')
            })
    });
    test('responds with a 400 status code when key is missing in the passed body', () => {
        const newReview = {
            owner: 'philippaclaire9',
            review_body: 'good for children',
            review_img_url: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/tic-tac-toe-noughts-and-crosses-game-elena-sysoeva.jpg'
        };
        return request(app)
            .post('/api/reviews')
            .send(newReview)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
});

describe('GET - /api/reviews/:review_id', () => {
    test('responds with a 200 status code and a review object with review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at and comment_count properties', () => {
        return request(app)
            .get('/api/reviews/1')
            .expect(200)
            .then(({ body }) => {
                const reviewObj = {
                    review_id: 1,
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                        'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    votes: 1
                }

                expect(body.review).toMatchObject(reviewObj);
            })
    });
    test('responds with a review object with a comment_count property', () => {
        return request(app)
            .get('/api/reviews/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.review.comment_count).toBe(0);
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
                expect(body.message).toBe('bad request');
            })
    });
});

describe('DELETE - /api/reviews/:review_id', () => {
    test('responds with a 204 status code', () => {
        return request(app)
            .delete('/api/reviews/1')
            .expect(204)
            .then(() => {
                db.query(`SELECT * FROM reviews WHERE review_id = 1;`).then(({ rows }) => rows)
                expect(rows).toBe(0);
            });
    });
    test('responds with a 404 status code when passed a review_id that does not exist', () => {
        return request(app)
            .delete('/api/reviews/154658')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('review not found');
            })
    });
    test('responds with a 400 status code when passed an invalid review_id', () => {
        return request(app)
            .delete('/api/reviews/my-review')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
});

describe('GET - /api/reviews/:review_id/comments', () => {
    test('responds with a 200 status code and an array of comments object of the given review_id with comment_id, votes, created_at, author, body, review_id properties', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments.length).toBe(3);
                comments.forEach(comment => {
                    expect(typeof comment.review_id).toBe('number');
                    expect(typeof comment.comment_id).toBe('number');
                    expect(typeof comment.votes).toBe('number');
                    expect(typeof comment.created_at).toBe('string');
                    expect(typeof comment.author).toBe('string');
                    expect(typeof comment.body).toBe('string');
                })
            })
    });
    test('responds with a 404 status code when given review_id does not exist', () => {
        return request(app)
            .get('/api/reviews/302/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('review_id not found');
            })
    });
    test('responds with a 200 status code when given a valid review_id that does not have comments', () => {
        return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments.length).toBe(0);
            })
    });
    test('responds with a 400 status code when passed a review_id of the incorrect data type', () => {
        return request(app)
            .get('/api/reviews/hi/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with 200 status code and a list with two comments when limit is specified', () => {
        return request(app)
            .get('/api/reviews/2/comments?limit=2')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(2);
            })
    });
    test('responds with 200 status code and pagination of two comments when passed limit of two and page is specified', () => {
        return request(app)
            .get('/api/reviews/2/comments?limit=2&p=2')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments[0].body).toBe('Now this is a story all about how, board games turned my life upside down');
            })
    });
});

describe('POST - /api/reviews/:review_id/comments', () => {
    test('responds with a 201 status code and accepts a comment', () => {
        return request(app)
            .post('/api/reviews/1/comments')
            .send({ username: 'philippaclaire9', body: 'love this game!' })
            .expect(201)
            .then(({ body }) => {
                expect(body).toHaveProperty('newComment');
                expect(body.newComment).toEqual({
                    comment_id: 7,
                    body: 'love this game!',
                    review_id: 1,
                    author: 'philippaclaire9'
                })
            })
    });
    test('responds with a 404 status code when given a review_id does not exist', () => {
        return request(app)
            .post('/api/reviews/456251/comments')
            .send({ username: 'philippaclaire9', body: 'love this game!' })
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('not found')
            })
    });
    test('responds with a 400 status code when given a username thats does not exist', () => {
        return request(app)
            .post('/api/reviews/1/comments')
            .send({ username: 'isa', body: 'love this game!' })
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
    test('responds with a 400 status code when passed an invalid review_id', () => {
        return request(app)
            .post('/api/reviews/dogs/comments')
            .send({ username: 'philippaclaire9', body: 'love this game!' })
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
    test('responds with a 400 status code when no body is passed', () => {
        return request(app)
            .post('/api/reviews/1/comments')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
    test('responds with a 400 status code when key is missing in the passed body', () => {
        return request(app)
            .post('/api/reviews/1/comments')
            .send({ username: 'philippaclaire9' })
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
});

describe('PATCH - /api/reviews/:review_id', () => {
    test('responds with a 200 status code and a review object with votes property incremented', () => {
        return request(app)
            .patch('/api/reviews/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveProperty('review');
                expect(body.review).toEqual({
                    review_id: 1,
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                        'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    votes: 2
                })
            })
    });
    test('adds the new amount of votes in the database', () => {
        return request(app)
            .patch('/api/reviews/1')
            .send({ inc_votes: 4 })
            .expect(200)
            .then(() => {
                return request(app)
                    .get('/api/reviews/1')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.review.votes).toBe(5)
                    })
            })
    });
    test('responds with a 200 status code and a review object with votes property decremented', () => {
        return request(app)
            .patch('/api/reviews/1')
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.review.votes).toBe(0)
            })
    });
    test('responds with a 404 status code when given a review_id does not exist', () => {
        return request(app)
            .patch('/api/reviews/45632')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('review_id not found');
            })
    });
    test('responds with a 400 status code when given an invalid review_id', () => {
        return request(app)
            .patch('/api/reviews/isa')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 400 status code when no increment votes is passed', () => {
        return request(app)
            .patch('/api/reviews/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 400 status code when passed an invalid increment votes', () => {
        return request(app)
            .patch('/api/reviews/1')
            .send({ inc_votes: 'one' })
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 200 status code ignoring additional properties passed', () => {
        return request(app)
            .patch('/api/reviews/1')
            .send({ inc_votes: 1, username: 'isa' })
            .expect(200)
            .then(({ body }) => {
                expect(body.review.votes).toBe(2);
            })
    });
});

describe('GET - /api/users', () => {
    test('responds with a 200 status code and an array of users object with username, name and avatar_url properties', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body.users.length).toBe(4)
                body.users.forEach(user => {
                    expect(typeof user.name).toBe('string');
                    expect(typeof user.username).toBe('string');
                    expect(typeof user.avatar_url).toBe('string');
                })
            })
    });
});

describe('GET - /api/users/:username', () => {
    test('responds with a 200 status code and a user object with username, avatar_url and name properties', () => {
        return request(app)
            .get('/api/users/mallionaire')
            .expect(200)
            .then(({ body }) => {
                const userObj = {
                    username: 'mallionaire',
                    name: 'haz',
                    avatar_url:
                        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                }
                expect(body.user).toEqual(userObj)
            })
    });
    test('responds with a 404 status code when passed a username that does not exist', () => {
        return request(app)
            .get('/api/users/isa')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('username not found');
            })
    });
});

describe('DELETE - /api/comments/:comment_id', () => {
    test('responds with a 204 status code', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204)
            .then(() => {
                db.query(`SELECT * FROM comments WHERE comment_id = 1;`).then(({ rows }) => rows)
                expect(rows).toBe(0);
            });
    });
    test('responds with a 404 status code when passed a comment_id that does not exist', () => {
        return request(app)
            .delete('/api/comments/45625')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('comment not found');
            })
    });
    test('responds with a 400 status code when passed an invalid comment_id', () => {
        return request(app)
            .delete('/api/comments/mycomment')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request')
            })
    });
});

describe('PATCH - /api/comments/:comment_id', () => {
    test('responds with a 200 status code and a comment object with votes property incremented', () => {
        return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.comment.votes).toBe(17);
            })
    });
    test('responds with a 200 status code and a comment object with votes property decremented', () => {
        return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({ body }) => {
                expect(body.comment.votes).toBe(11)
            })
    });
    test('responds with a 404 status code when given a comment_id that does not exist', () => {
        return request(app)
            .patch('/api/comments/45632')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('comment_id not found');
            })
    });
    test('responds with a 400 status code when given an invalid comment_id', () => {
        return request(app)
            .patch('/api/comments/isa')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 400 status code when no increment votes is passed', () => {
        return request(app)
            .patch('/api/comments/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 400 status code when passed an invalid increment votes', () => {
        return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'one' })
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('bad request');
            })
    });
    test('responds with a 200 status code ignoring additional properties passed', () => {
        return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 1, username: 'isa' })
            .expect(200)
            .then(({ body }) => {
                expect(body.comment.votes).toBe(17);
            })
    });
});

describe('GET - /api', () => {
    test('responds with a JSON object with all the available endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.availableEndpoints).toHaveProperty("GET /api");
                expect(body.availableEndpoints).toHaveProperty("GET /api/categories");
                expect(body.availableEndpoints).toHaveProperty("POST /api/categories");
                expect(body.availableEndpoints).toHaveProperty("GET /api/reviews");
                expect(body.availableEndpoints).toHaveProperty("POST /api/reviews");
                expect(body.availableEndpoints).toHaveProperty("GET /api/reviews/:review_id");
                expect(body.availableEndpoints).toHaveProperty("PATCH /api/reviews/:review_id");
                expect(body.availableEndpoints).toHaveProperty("DELETE /api/reviews/:review_id");
                expect(body.availableEndpoints).toHaveProperty("GET /api/reviews/:review_id/comments");
                expect(body.availableEndpoints).toHaveProperty("POST /api/reviews/:review_id/comments");
                expect(body.availableEndpoints).toHaveProperty("GET /api/users");
                expect(body.availableEndpoints).toHaveProperty("GET /api/users/:username");
                expect(body.availableEndpoints).toHaveProperty("DELETE /api/comments/:comment_id");
                expect(body.availableEndpoints).toHaveProperty("PATCH /api/comments/:comment_id");
            })
    });
});