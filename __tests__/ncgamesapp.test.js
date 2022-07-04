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
