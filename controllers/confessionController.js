const { checkRateLimitAndPoW } = require("../services/rateLimitService");

const FORBIDDEN_WORDS = ["dox", "swat", "cp"];

const submitConfession = async (req, res) => {
  try {
    const { text, fingerprint, powPrefix, powNonce } = req.body;

    if (!text || !fingerprint) {
      return res.status(400).json({ error: "Missing text or fingerprint." });
    }

    if (text.length < 15 || text.length > 2000) {
      return res
        .status(400)
        .json({ error: "Text must be between 15 and 2,000 characters." });
    }

    const linkRegex = /(https?:\/\/|www\.|\.com|\.sol|\.io|t\.me)/i;
    if (linkRegex.test(text)) {
      return res
        .status(400)
        .json({ error: "Raw links are forbidden to prevent phishing." });
    }

    const lowerText = text.toLowerCase();
    if (FORBIDDEN_WORDS.some((word) => lowerText.includes(word))) {
      return res
        .status(400)
        .json({ error: "This confession violates safety rules." });
    }

    // Rate Limiting and Proof-of-Work
    const rateLimitResult = checkRateLimitAndPoW(
      fingerprint,
      powPrefix,
      powNonce,
    );

    if (!rateLimitResult.allowed) {
      const response = { error: rateLimitResult.error };
      if (rateLimitResult.powPrefix) {
        response.powPrefix = rateLimitResult.powPrefix;
        response.difficulty = rateLimitResult.difficulty;
      }
      return res.status(rateLimitResult.status).json(response);
    }

    return res.status(200).json({
      success: true,
      message: "Rate limit passed or PoW solved. Ready for Telegram execution.",
    });
  } catch (error) {
    console.error("Submission Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { submitConfession };
