const {
  fetchCategories,
  fetchReviewByID,
  patchReview,
  fetchUsers,
  checkReviewComments,
} = require("../models/ncgamesmodel.js");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.send({ categories });
  });
};
exports.getReviewByID = (req, res) => {
  const reviewID = req.params.review_id;
  const parsedReviewID = parseInt(reviewID);
  if (!parsedReviewID) {
    return res.status(400).send({ msg: "please enter valid review id" });
  }
  const comment_count = checkReviewComments(reviewID);
  fetchReviewByID(reviewID, comment_count)
    .then((review) => {
      if (!review) {
        return res.status(404).send({ msg: "review id not found" });
      }
      // console.log({ review } + " review");

      res.send({ review });
    })
    .catch((err) => res.status(404).send(err));
};
exports.updateReview = (req, res) => {
  const reviewID = req.params.review_id;
  const parsedReviewID = parseInt(reviewID);
  if (!parsedReviewID) {
    return res.status(400).send({ msg: "please enter valid review id" });
  }
  const newVote = req.body.inc_votes;
  const parsedNewVote = parseInt(newVote);
  if (!parsedNewVote) {
    return res
      .status(400)
      .send({ msg: "please enter a valid number of votes" });
  }
  patchReview(reviewID, newVote)
    .then((review) => {
      if (!review) {
        return res.status(404).send({ msg: "review id not found" });
      }
      res.status(200).send({ review });
    })
    .catch((err) => res.status(404).send(err));
};
exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.send({ users });
  });
};
