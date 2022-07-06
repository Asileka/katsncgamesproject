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
    newVote = newVote.toString();
    valuesArr.push(newVote);
    return connection
      .query(
        "UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;",
        valuesArr
      )
      .then((newReview) => {
        return newReview.rows[0];
      })
      .catch((err) => console.log(err + "error"));
  }
};
