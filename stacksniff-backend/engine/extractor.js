/**
 * Signal extractor — pulls structured signals from a raw HTTP response
 * for downstream pattern matching. All operations are read-only.
 */

const cheerio = require("cheerio");

function extractSignals(fetchResult) {
  const { headers, html } = fetchResult;

  const $ = cheerio.load(html || "", { decodeEntities: false });

  // 1. HEADERS — already lowercased in fetcher
  const normalizedHeaders = { ...headers };

  // 2. META TAGS
  const metaTags = [];
  $("meta").each((_, el) => {
    const tag = {
      name: $(el).attr("name") || null,
      content: $(el).attr("content") || null,
      property: $(el).attr("property") || null,
      httpEquiv: $(el).attr("http-equiv") || null,
    };
    if (tag.name || tag.content || tag.property) {
      metaTags.push(tag);
    }
  });

  // 3. SCRIPT SOURCES
  const scriptSources = [];
  $("script[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src) scriptSources.push(src);
  });

  // 4. LINK HREFS
  const linkHrefs = [];
  $("link[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (href) linkHrefs.push(href);
  });

  // 5. IMAGE SOURCES — for distinguishing CDN usage from tech usage
  const imgSources = [];
  $("img[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src) imgSources.push(src);
  });
  $("img[srcset]").each((_, el) => {
    const srcset = $(el).attr("srcset");
    if (srcset) imgSources.push(srcset);
  });

  // 6. HTML CONTENT CLUES
  const htmlLower = (html || "").toLowerCase();
  const htmlClues = [
    "wp-content", "wp-includes", "shopify", "wix.com",
    "squarespace", "__next_data__", "__nuxt__", "ng-version",
    "data-reactroot", "data-reactid", "gatsby", "ember",
    "backbone", "jquery", "bootstrap", "tailwind", "svelte",
    "astro", "remix", "laravel", "django", "rails", "asp.net",
  ];

  const detectedClues = {};
  for (const clue of htmlClues) {
    detectedClues[clue] = htmlLower.includes(clue.toLowerCase());
  }

  // 7. COOKIE NAMES
  const cookieNames = [];
  const setCookie = headers["set-cookie"];
  if (setCookie) {
    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    for (const cookie of cookies) {
      const name = cookie.split("=")[0]?.trim();
      if (name) cookieNames.push(name);
    }
  }

  // 8. INLINE SCRIPT CONTENT
  const inlineScripts = [];
  $("script:not([src])").each((_, el) => {
    const content = $(el).html();
    if (content && content.trim().length > 0) {
      inlineScripts.push(content);
    }
  });
  const inlineScriptContent = inlineScripts.join("\n");

  // 9. ALL CLASS NAMES — for detecting CSS frameworks structurally
  const classNames = new Set();
  $("[class]").each((_, el) => {
    const cls = $(el).attr("class");
    if (cls) {
      cls.split(/\s+/).forEach((c) => {
        if (c) classNames.add(c.toLowerCase());
      });
    }
  });

  return {
    headers: normalizedHeaders,
    metaTags,
    scriptSources,
    linkHrefs,
    imgSources,
    htmlRaw: html || "",
    htmlClues: detectedClues,
    cookieNames,
    inlineScriptContent,
    classNames: [...classNames],
  };
}

module.exports = { extractSignals };
