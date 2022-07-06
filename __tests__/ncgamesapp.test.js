const app = require("../ncgamesapp.js");
const request = require("supertest");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return connection.end();
});
describe("GET:/api/categories", () => {
  it("GET api/categories responds with correct number of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toHaveLength(4);
      });
  });
  it("GET api/categories responds with correct categories", () => {
    const expectedObj = {
      slug: "euro game",
      description: "Abstact games that involve little luck",
    };
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories[0]).toEqual(expectedObj);
        body.categories.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
  it("GET api/badroute respons with 404 error", () => {
    return request(app).get("/api/badroute").expect(404);
  });
});
describe("GET:/api/reviews/:review_id", () => {
  it("GET /api/reviews/:review_id responds with object of a corresponding review", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toHaveProperty("review_id");
        expect(body.review).toHaveProperty("created_at");
        expect(body.review.title).toBe("Agricola");
        expect(body.review.designer).toBe("Uwe Rosenberg");
      });
  });
  it("GET /api/reviews/255 throws 404 error", () => {
    return request(app)
      .get("/api/reviews/255")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("review id not found");
      });
  });
  it("GET /api/reviews/badid throws 400 error", () => {
    return request(app)
      .get("/api/reviews/badid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter valid review id");
      });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  it("accepts requests with votes update, returns an updated review", () => {
    const newVote = { inc_votes: 1 };
    const expectedReview = {
      review_id: 1,
      title: "Agricola",
      category: "euro game",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_body: "Farmyard fun!",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 2,
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(200)
      .then((res) => {
        const updatedReview = res.body.review;
        expect(updatedReview).toEqual(expectedReview);
      });
  });
  it("throws 404 error if entered non-existent id", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/300")
      .send(newVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("review id not found");
      });
  });
  it("throws 400 error if sent invalid(non integer) inc_votes", () => {
    const newVote = { inc_votes: "badrequest" };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter a valid number of votes");
      });
  });
  it("PATCH /api/reviews/badid throws 400 error", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/badid")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter valid review id");
      });
  });
  it("throws 400 error if no body sent", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send()
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter a valid number of votes");
      });
  });
  it("PATCH /api/reviews/1 throws 400 error if sent a body with a wrong key", () => {
    const newVote = { inc_wrongkey: 1 };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter a valid number of votes");
      });
  });
});
