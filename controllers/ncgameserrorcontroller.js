exports.fourOFourHandle = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};
