/**
 * PASSIVE ANALYSIS ONLY
 * ---------------------
 * This fetcher performs a simple HTTP GET request to retrieve the
 * static HTML and response headers of a public URL. It does NOT:
 *  - Execute any JavaScript from the target page
 *  - Interact with the page in any way (no clicks, no form fills)
 *  - Use a headless browser or rendering engine
 *  - Store or cache any content from the target
 *
 * All analysis downstream is read-only pattern matching against
 * the static response. This is equivalent to what `curl` does.
 */

const axios = require("axios");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;

async function fetchUrl(url) {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: TIMEOUT_MS,
      maxRedirects: MAX_REDIRECTS,
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
      },
      // Get response as text to avoid parsing issues
      responseType: "text",
      // Don't throw on non-2xx so we can still analyze the page
      validateStatus: (status) => status < 600,
    });

    const elapsed = Date.now() - startTime;

    // Collect all response headers as lowercase key-value pairs
    const headers = {};
    for (const [key, value] of Object.entries(response.headers)) {
      headers[key.toLowerCase()] = value;
    }

    return {
      headers,
      html: typeof response.data === "string" ? response.data : String(response.data),
      finalUrl: response.request?.res?.responseUrl || response.config?.url || url,
      responseTime: elapsed,
      statusCode: response.status,
    };
  } catch (err) {
    const elapsed = Date.now() - startTime;

    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      throw {
        type: "timeout",
        message: "Site took too long to respond",
        responseTime: elapsed,
      };
    }

    if (err.code === "ENOTFOUND") {
      throw {
        type: "dns_error",
        message: "Domain not found — check the URL and try again",
        responseTime: elapsed,
      };
    }

    if (err.code === "ECONNREFUSED") {
      throw {
        type: "connection_refused",
        message: "Connection refused by the target server",
        responseTime: elapsed,
      };
    }

    if (err.response) {
      // Server responded with an error status
      throw {
        type: "http_error",
        message: `Server returned status ${err.response.status}`,
        statusCode: err.response.status,
        responseTime: elapsed,
      };
    }

    throw {
      type: "fetch_error",
      message: err.message || "Failed to fetch the URL",
      responseTime: elapsed,
    };
  }
}

module.exports = { fetchUrl };
