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
      .query(
        `SELECT reviews.*, count(comments.review_id) as "comment_count" 
          FROM reviews 
          LEFT OUTER JOIN comments on reviews.review_id =comments.review_id
          WHERE reviews.review_id = $1 
          GROUP BY reviews.review_id;`,
        valuesArr
      )
      .then((results) => {
        return results.rows[0];
      });
  }
};
exports.fetchReviews = () => {
  return connection
    .query(
      `SELECT reviews.*, count(comments.review_id) as "comment_count" 
  FROM reviews 
  LEFT OUTER JOIN comments on reviews.review_id =comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at desc;`
    )
    .then((results) => {
      return results.rows;
    });
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
exports.fetchUsers = () => {
  return connection.query("SELECT * FROM users;").then((results) => {
    return results.rows;
  });
};
exports.fetchCommentsForReview = (reviewID) => {
  let valuesArr = [];
  if (reviewID) {
    valuesArr.push(reviewID);
    return connection
      .query(
        `SELECT *
  FROM comments
  WHERE review_id = $1;`,
        valuesArr
      )
      .then((results) => {
        return results.rows;
      })
      .catch((err) => console.log(err + "error"));
  }
};
exports.checkIfReviewIDExists = (reviewID) => {
  let valuesArr = [];
  if (reviewID) {
    valuesArr.push(reviewID);
    return connection
      .query(
        `SELECT *
          FROM reviews 
          WHERE review_id = $1 ;`,
        valuesArr
      )
      .then((results) => {
        console.log(results.rows.length + " results length in checkId models");
        console.log(results.rows + " results.rows in checkId models");
        if (!results.rows.length) {
          return false;
        }
      });
  }
};
