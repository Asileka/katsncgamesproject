const {
  fetchCategories,
  fetchReviewByID,
} = require("../models/ncgamesmodel.js");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.send({ categories });
  });
};
exports.getReviewByID = (req, res) => {
  const reviewID = req.params.review_id;
  const parsedReviewID = parseInt(reviewID);
  console.log(typeof reviewID);
  console.log(reviewID);
  console.log(parsedReviewID);
  if (!parsedReviewID) {
    return res.status(400).send({ msg: "please enter valid review id" });
  }
  fetchReviewByID(reviewID)
    .then((review) => {
      if (!review) {
        return res.status(404).send({ msg: "review id not found" });
      }
      res.send({ review });
    })
    .catch((err) => res.status(404).send(err));
};
