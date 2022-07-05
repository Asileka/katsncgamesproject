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
  return res.status(404).send({ msg: "review_id not found" });
};
exports.checkIfReviewIDExists = async (reviewID) => {
  const dbOutput = await connection.query(
    "SELECT * FROM reviews WHERE review_id = $1;",
    [reviewID]
  );

  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return Promise.reject({ status: 404, msg: "review id not found" });
  }
};
