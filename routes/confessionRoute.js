const { Router } = require("express");
const { submitConfession } = require("../controllers/confessionController");

const router = Router();

router.post("/submit", submitConfession);

module.exports = router;
