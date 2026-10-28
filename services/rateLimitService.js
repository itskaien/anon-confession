const crypto = require("crypto");

const rateLimitCache = new Map();
const POW_DIFFICULTY = 4;
const MAX_REQUESTS_PER_HOUR = 5;

const checkRateLimitAndPoW = (fingerprint, powPrefix, powNonce) => {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;

  if (!rateLimitCache.has(fingerprint)) {
    rateLimitCache.set(fingerprint, []);
  }

  const userSubmissions = rateLimitCache
    .get(fingerprint)
    .filter((ts) => ts > hourAgo);

  if (userSubmissions.length >= MAX_REQUESTS_PER_HOUR) {
    if (!powPrefix || !powNonce) {
      const newPrefix = crypto.randomBytes(16).toString("hex");
      return {
        allowed: false,
        status: 429,
        error: "Rate limit exceeded. Solve the Proof-of-Work challenge.",
        powPrefix: newPrefix,
        difficulty: POW_DIFFICULTY,
      };
    }

    const hash = crypto
      .createHash("sha256")
      .update(powPrefix + powNonce)
      .digest("hex");
    if (!hash.startsWith("0".repeat(POW_DIFFICULTY))) {
      return {
        allowed: false,
        status: 400,
        error: "Invalid Proof-of-Work solution.",
      };
    }

    return { allowed: true };
  }

  userSubmissions.push(now);
  rateLimitCache.set(fingerprint, userSubmissions);
  return { allowed: true };
};

module.exports = { checkRateLimitAndPoW };
