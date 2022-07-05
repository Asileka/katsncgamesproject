const {
  fetchCategories,
  fetchReviewByID,
  checkIfReviewIDExists,
} = require("../models/ncgamesmodel.js");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.send({ categories });
  });
};
exports.getReviewByID = (req, res) => {
  const reviewID = req.params.review_id;
  checkIfReviewIDExists(reviewID);
  fetchReviewByID(reviewID).then((review) => {
    res.send({ review });
  });
};
