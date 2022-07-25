const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const {
  getCategories,
  getReviewByID,
  updateReview,
  getUsers,
  getReviews,
  getCommentsForReview,
  postCommentForReview,
} = require("./controllers/ncgamescontroller.js");
const { fourOFourHandle } = require("./controllers/ncgameserrorcontroller.js");
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByID);
app.patch("/api/reviews/:review_id", updateReview);
app.get("/api/reviews", getReviews);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id/comments", getCommentsForReview);
app.post("/api/reviews/:review_id/comments", postCommentForReview);
//errors
app.all("/*", fourOFourHandle);
app.use((err, req, res, next) => {
  console.log("Im in 500 app");
  console.log(err);
  res.status(500).send("Server Error!");
});
module.exports = app;
