const {
  fetchCategories,
  fetchReviewByID,
  patchReview,
  fetchUsers,
  fetchReviews,
  fetchCommentsForReview,
  checkIfReviewIDExists,
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

  fetchReviewByID(reviewID)
    .then((review) => {
      if (!review) {
        return res.status(404).send({ msg: "review id not found" });
      }
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
exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.send({ reviews });
  });
};
exports.getCommentsForReview = async (req, res) => {
  const reviewID = req.params.review_id;
  const parsedReviewID = parseInt(reviewID);
  if (!parsedReviewID) {
    return res.status(400).send({ msg: "please enter valid review id" });
  }
  const checkID = await checkIfReviewIDExists(reviewID);
  if (!checkID) {
    return res.status(404).send({ msg: "review id not found" });
  }
  fetchCommentsForReview(reviewID)
    .then((comments) => {
      if (!comments.length) {
        return res.status(200).send({ comments });
      }
      if (!comments) {
        return res.status(404).send({ msg: "review id not found" });
      }
      res.status(200).send({ comments });
    })
    .catch((err) => res.status(404).send(err));
};
