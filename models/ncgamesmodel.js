const connection = require("../db/connection.js");

exports.fetchCategories = () => {
  return connection.query("SELECT * FROM categories;").then((results) => {
    return results.rows;
  });
};

exports.fetchReviewByID = (reviewID) => {
  let valuesArr = [];
  if (reviewID) {
    valuesArr.push(reviewID);
    return connection
      .query("SELECT * FROM reviews WHERE review_id = $1;", valuesArr)
      .then((results) => {
        return results.rows[0];
      });
  }
};
exports.patchReview = (reviewID, newVote) => {
  let valuesArr = [];
  if (reviewID) {
    valuesArr.push(reviewID);
    return connection
      .query("SELECT * FROM reviews WHERE review_id = $1", valuesArr)
      .then((results) => {
        return results.rows[0];
      })
      .then((review) => {
        console.log(review + " review");
        let votes = review.votes;
        console.log(votes + " votes");
        votes += newVote;
        console.log(newVote + " newVote");
        console.log(votes + " updated votes");
        votes = votes.toString();
        console.log(votes + " stringified votes");
        valuesArr.push(votes);
        console.log(valuesArr + " valuesArr");
        return connection.query(
          "INSERT INTO reviews (votes) VALUES $2 WHERE review_id = $1; SELECT * FROM reviews WHERE review_id = $1;",
          valuesArr
        );
      })
      .then((newReview) => {
        console.log(newReview + " newReview");
        return newReview.rows;
      });
  }
};
