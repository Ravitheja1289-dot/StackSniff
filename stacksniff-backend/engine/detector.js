/**
 * Detection engine — matches extracted signals against the rules
 * database and produces a scored list of detected technologies.
 *
 * Each pattern can carry a "strength" field:
 *   "strong"  — definitive fingerprint (unique header, specific path).
 *              Worth 3 points.
 *   "weak"    — suggestive but not unique (generic keyword in HTML).
 *              Worth 1 point.
 *   (default) — if omitted, treated as "strong" for backwards compat.
 *
 * Confidence thresholds are based on total weighted score:
 *   "high"   — scored >= 70% of max possible points
 *   "medium" — scored >= 40% of max possible points
 *   "low"    — anything below, BUT must have at least one strong match
 *              OR at least 2 weak matches to be included at all.
 */

const rules = require("../data/rules.json");

const STRONG_WEIGHT = 3;
const WEAK_WEIGHT = 1;

/**
 * Check a single pattern against the extracted signals.
 * Returns true if the pattern matches.
 */
function matchPattern(pattern, signals) {
  const { type, key, value } = pattern;
  const v = (value || "").toLowerCase();
  const k = (key || "").toLowerCase();

  switch (type) {
    case "header_exists":
      return k in signals.headers;

    case "header_contains":
      return (
        k in signals.headers &&
        String(signals.headers[k]).toLowerCase().includes(v)
      );

    case "header_equals":
      return (
        k in signals.headers &&
        String(signals.headers[k]).toLowerCase() === v
      );

    case "meta_generator":
      return signals.metaTags.some(
        (tag) =>
          (tag.name || "").toLowerCase() === "generator" &&
          (tag.content || "").toLowerCase().includes(v)
      );

    case "html_contains":
      return signals.htmlRaw.toLowerCase().includes(v);

    case "script_src_contains":
      return signals.scriptSources.some((src) =>
        src.toLowerCase().includes(v)
      );

    case "link_href_contains":
      return signals.linkHrefs.some((href) =>
        href.toLowerCase().includes(v)
      );

    case "cookie_contains":
      return signals.cookieNames.some((name) =>
        name.toLowerCase().includes(v)
      );

    case "inline_script_contains":
      return signals.inlineScriptContent.toLowerCase().includes(v);

    case "img_src_contains":
      return (signals.imgSources || []).some((src) =>
        src.toLowerCase().includes(v)
      );

    case "class_name_contains":
      return (signals.classNames || []).some((cls) => cls.includes(v));

    default:
      return false;
  }
}

/**
 * Run all rules against the signals and return matched technologies.
 */
function detect(signals) {
  const results = [];

  for (const rule of rules) {
    const patterns = rule.patterns || [];
    if (patterns.length === 0) continue;

    let strongMatches = 0;
    let weakMatches = 0;
    let earnedScore = 0;
    let maxScore = 0;

    for (const pattern of patterns) {
      const isStrong = pattern.strength !== "weak";
      const weight = isStrong ? STRONG_WEIGHT : WEAK_WEIGHT;
      maxScore += weight;

      if (matchPattern(pattern, signals)) {
        earnedScore += weight;
        if (isStrong) strongMatches++;
        else weakMatches++;
      }
    }

    const totalMatches = strongMatches + weakMatches;
    if (totalMatches === 0) continue;

    // Gate: must have at least 1 strong match OR 2+ weak matches
    if (strongMatches === 0 && weakMatches < 2) continue;

    const ratio = earnedScore / maxScore;

    let confidence;
    if (ratio >= 0.7) {
      confidence = "high";
    } else if (ratio >= 0.4) {
      confidence = "medium";
    } else {
      confidence = "low";
    }

    results.push({
      id: rule.id,
      name: rule.name,
      category: rule.category,
      description: rule.description,
      icon: rule.icon,
      website: rule.website,
      confidence,
      matchedPatterns: totalMatches,
      totalPatterns: patterns.length,
      _score: earnedScore,
      _maxScore: maxScore,
    });
  }

  // Sort: high > medium > low, then by score descending
  const order = { high: 0, medium: 1, low: 2 };
  results.sort((a, b) => {
    const diff = order[a.confidence] - order[b.confidence];
    if (diff !== 0) return diff;
    return b._score - a._score;
  });

  return results;
}

module.exports = { detect };
