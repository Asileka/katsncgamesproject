const express = require("express");
const app = express();
const {
  getCategories,
  getReviewByID,
} = require("./controllers/ncgamescontroller.js");
const { fourOFourHandle } = require("./controllers/ncgameserrorcontroller.js");
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByID);
//errors
app.all("/*", fourOFourHandle);
app.use((err, req, res, next) => {
  console.log("Im in 500 app");
  console.log(err);
  res.status(500).send("Server Error!");
});
module.exports = app;
