const express = require("express");
const app = express();
const { getCategories } = require("./controllers/ncgamescontroller.js");
app.use(express.json());

app.get("/api/categories", getCategories);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
  console.log("Im in 500 app");
  console.log(err);
  res.status(500).send("Server Error!");
});
module.exports = app;
