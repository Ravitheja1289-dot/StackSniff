/**
 * Response formatter — shapes the final JSON output for the API.
 */

function formatSuccess({ url, fetchResult, technologies }) {
  let domain;
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  // Build category summary
  const byCategory = {};
  for (const tech of technologies) {
    byCategory[tech.category] = (byCategory[tech.category] || 0) + 1;
  }

  // Strip internal scoring fields from output
  const cleanTechnologies = technologies.map(
    ({ matchedPatterns, totalPatterns, _score, _maxScore, ...rest }) => rest
  );

  return {
    success: true,
    url,
    domain,
    favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    scanTime: fetchResult.responseTime,
    statusCode: fetchResult.statusCode,
    technologies: cleanTechnologies,
    summary: {
      total: technologies.length,
      byCategory,
    },
  };
}

function formatError({ url, error }) {
  return {
    success: false,
    error: error.type || "unknown_error",
    message: error.message || "An unexpected error occurred",
    url: url || null,
  };
}

module.exports = { formatSuccess, formatError };
