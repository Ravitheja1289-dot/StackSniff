/**
 * URL validation helper for StackSniff.
 * Ensures the target URL is safe to fetch — blocks private IPs,
 * localhost, and malformed inputs.
 */

function validateUrl(input) {
  if (!input || typeof input !== "string") {
    return { valid: false, reason: "URL is required" };
  }

  const trimmed = input.trim();

  if (trimmed.length > 500) {
    return { valid: false, reason: "URL must be under 500 characters" };
  }

  // Must start with http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return { valid: false, reason: "URL must start with http:// or https://" };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, reason: "Invalid URL format" };
  }

  // Only allow http/https protocols
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, reason: "Only HTTP and HTTPS URLs are allowed" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost
  if (
    hostname === "localhost" ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]"
  ) {
    return { valid: false, reason: "Localhost URLs are not allowed" };
  }

  // Block private IP ranges
  const privatePatterns = [
    /^127\.\d+\.\d+\.\d+$/,        // 127.x.x.x
    /^10\.\d+\.\d+\.\d+$/,         // 10.x.x.x
    /^192\.168\.\d+\.\d+$/,        // 192.168.x.x
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/, // 172.16-31.x.x
    /^169\.254\.\d+\.\d+$/,        // link-local
    /^0\.0\.0\.0$/,                 // unspecified
  ];

  for (const pattern of privatePatterns) {
    if (pattern.test(hostname)) {
      return { valid: false, reason: "Private/internal IP addresses are not allowed" };
    }
  }

  // Must have a valid-looking hostname
  if (!parsed.hostname.includes(".") && !parsed.hostname.includes(":")) {
    return { valid: false, reason: "URL must contain a valid domain name" };
  }

  return { valid: true, reason: null };
}

module.exports = { validateUrl };
