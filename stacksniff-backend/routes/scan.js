const express = require("express");
const { validateUrl } = require("../utils/validate");
const { fetchUrl } = require("../engine/fetcher");
const { extractSignals } = require("../engine/extractor");
const { detect } = require("../engine/detector");
const { formatSuccess, formatError } = require("../engine/formatter");

const router = express.Router();

router.post("/", async (req, res) => {
  let { url } = req.body || {};

  // Normalize: add https:// if no protocol given
  if (url && typeof url === "string" && !/^https?:\/\//i.test(url.trim())) {
    url = "https://" + url.trim();
  }

  // Validate
  const validation = validateUrl(url);
  if (!validation.valid) {
    return res.status(400).json(
      formatError({
        url,
        error: { type: "validation_error", message: validation.reason },
      })
    );
  }

  try {
    // 1. Fetch the target URL
    const fetchResult = await fetchUrl(url);

    // 2. Extract signals from the response
    const signals = extractSignals(fetchResult);

    // 3. Run detection rules against signals
    const technologies = detect(signals);

    // 4. Format and return the response
    return res.json(
      formatSuccess({ url, fetchResult, technologies })
    );
  } catch (err) {
    // Structured errors from fetcher
    if (err.type) {
      return res.status(502).json(formatError({ url, error: err }));
    }

    // Unexpected errors
    console.error("Scan error:", err);
    return res.status(500).json(
      formatError({
        url,
        error: {
          type: "internal_error",
          message: "An unexpected error occurred during scanning",
        },
      })
    );
  }
});

module.exports = router;
