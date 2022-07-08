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
  it("GET api/badroute responds with 404 error", () => {
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
describe("GET:/api/reviews/:review_id comment_count addition", () => {
  it("GET /api/reviews/:review_id responds with object of a corresponding review including comment_count property", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toHaveProperty("comment_count");
        expect(body.review.comment_count).toBe("3");
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
describe("GET:/api/users", () => {
  it("GET api/users responds with correct number of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
      });
  });
  it("GET api/users responds with correct users", () => {
    const expectedObj = {
      username: "mallionaire",
      name: "haz",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    };
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users[0]).toEqual(expectedObj);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
describe("GET:/api/reviews", () => {
  it("GET /api/reviews responds with object of all reviews with comment_count property", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const review1 = body.reviews[0];
        expect(review1).toHaveProperty("review_id");
        expect(review1).toHaveProperty("created_at");
        expect(review1).toHaveProperty("comment_count");
        expect(review1.comment_count).toBe("0");
      });
  });
  test("GET /api/reviews responds with reviews sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("GET:/api/reviews/:review_id/comments", () => {
  it("GET /api/reviews/:review_id/comments responds with correct number of comments for the specified review", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(3);
      });
  });
  it("GET /api/reviews/:review_id/comments responds with correct categories", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("review_id");
        });
      });
  });
  it("GET /api/reviews/badid/comments string review_id throws 400 error", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .get("/api/reviews/badid/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter valid review id");
      });
  });
  it("GET /api/reviews/455/comments non-existing review_id throws 404 error", () => {
    return request(app)
      .get("/api/reviews/455/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("review id not found");
      });
  });
  it("GET /api/reviews/1/comments review_id with no comments returns an empty array", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});
describe("POST /api/reviews/:review_id/comments", () => {
  it("acceptscomments with body and username, returns created review", () => {
    const postedComment = {
      username: "philippaclaire9",
      body: "my test comment",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(postedComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toHaveProperty("author");
        expect(res.body.comment).toHaveProperty("body");
        expect(res.body.comment).toHaveProperty("comment_id");
        const recievedComment = res.body.comment;
        expect(recievedComment.author).toBe("philippaclaire9");
        expect(recievedComment.body).toBe("my test comment");
      });
  });
  it("throws 404 error if entered non-existent review id", () => {
    const postedComment = {
      username: "philippaclaire9",
      body: "my test comment",
    };
    return request(app)
      .post("/api/reviews/366/comments")
      .send(postedComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("review id not found");
      });
  });
  it("throws 401 error if username is not registered", () => {
    const postedComment = {
      username: "Kat",
      body: "my test comment",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(postedComment)
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("username not found, please register first");
      });
  });
  it("throws 400 error if no body sent", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send()
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter a comment and a valid username");
      });
  });
  it("POST /api/reviews/1/comments throws 400 error if sent a body with a wrong key", () => {
    const postedComment = {
      wrongkey: "philippaclaire9",
      verywrongkey: "my test comment",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(postedComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter a comment and a valid username");
      });
  });
});
describe("GET:/api/reviews accepts queries", () => {
  test("GET /api/reviews?order=asc responds with reviews sorted by date in ascending order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("GET /api/reviews?category=evilcategory throws 400 if entered category not in whitelist", () => {
    return request(app)
      .get("/api/reviews?category=evilcategory")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("please enter valid category");
      });
  });
});
