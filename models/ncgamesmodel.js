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
