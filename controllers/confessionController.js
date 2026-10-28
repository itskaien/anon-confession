const submitConfession = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Route is working. Ready for Step 3." });
};

module.exports = { submitConfession };
