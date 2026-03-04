# StackSniff

**Instantly detect the tech stack behind any website.**

StackSniff is an open-source web technology detector that analyzes HTTP headers, HTML patterns, script sources, meta tags, and more to identify the frameworks, CMS platforms, hosting providers, analytics tools, and other technologies powering any website.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Passive Detection** — Analyzes HTTP responses without executing JavaScript on the target site
- **200+ Technology Rules** — Detects frameworks, CMS platforms, hosting, analytics, CDNs, and more
- **Confidence Scoring** — Each detection is rated as high, medium, or low confidence based on matched patterns
- **11 Signal Types** — Headers, meta tags, script sources, link hrefs, cookies, inline scripts, class names, image sources, and more
- **Category Filtering** — Filter results by Frontend, Backend, CMS, Hosting, Analytics, CDN
- **Security Built-in** — Rate limiting, SSRF protection (blocks private IPs and localhost), URL validation
- **Responsive UI** — Dark-themed interface with radar scanning animation

## How It Works

```
URL Input → Fetch HTML & Headers → Extract Signals → Match Against Rules → Score & Rank → Display Results
```

1. **Fetch** — Makes an HTTP GET request to the target URL with a browser-like User-Agent
2. **Extract** — Parses the response using Cheerio to extract headers, meta tags, scripts, links, cookies, class names, and more
3. **Detect** — Matches extracted signals against 200+ technology rules using pattern matching
4. **Score** — Assigns confidence levels: strong matches score 3 points, weak matches score 1 point
5. **Format** — Returns structured results with technology details, confidence levels, and category breakdowns

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Backend | Node.js, Express 4 |
| HTML Parsing | Cheerio |
| HTTP Client | Axios |
| Security | CORS, express-rate-limit |

## Project Structure

```
StackSniff/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with metadata & fonts
│   │   ├── page.tsx               # Main app (search, scan, results)
│   │   └── globals.css            # Theme, animations, custom styles
│   ├── components/
│   │   ├── Header.tsx             # Navigation bar with GitHub link
│   │   ├── FilterBar.tsx          # Category filter pills
│   │   ├── TechCard.tsx           # Technology result card
│   │   ├── ResultsSummary.tsx     # Scan results header
│   │   ├── ScanningAnimation.tsx  # Radar animation during scan
│   │   └── HowWeDetect.tsx        # Detection methods explainer
│   └── lib/
│       └── mock-data.ts           # Mock data & type definitions
├── stacksniff-backend/
│   ├── index.js                   # Express server entry point
│   ├── routes/
│   │   └── scan.js                # POST /api/scan endpoint
│   ├── engine/
│   │   ├── detector.js            # Pattern matching & scoring
│   │   ├── extractor.js           # Signal extraction from HTML
│   │   ├── fetcher.js             # HTTP request handler
│   │   └── formatter.js           # Response formatting
│   ├── utils/
│   │   └── validate.js            # URL & SSRF validation
│   └── data/
│       └── rules.json             # 200+ technology detection rules
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Ravitheja1289-dot/StackSniff.git
cd StackSniff

# Install frontend dependencies
npm install

# Install backend dependencies
cd stacksniff-backend
npm install
cd ..
```

### Running Locally

Start both the frontend and backend in separate terminals:

**Terminal 1 — Backend (port 3001):**

```bash
cd stacksniff-backend
npm run dev
```

**Terminal 2 — Frontend (port 3000):**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Reference

### `POST /api/scan`

Scan a website's tech stack.

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "success": true,
  "url": "https://example.com",
  "domain": "example.com",
  "favicon": "https://www.google.com/s2/favicons?domain=example.com&sz=64",
  "scanTime": 1234,
  "statusCode": 200,
  "technologies": [
    {
      "id": "nextjs",
      "name": "Next.js",
      "category": "Framework",
      "description": "React framework for production-grade applications",
      "icon": "https://cdn.simpleicons.org/nextdotjs/white",
      "website": "https://nextjs.org",
      "confidence": "high",
      "matchedPatterns": 3,
      "totalPatterns": 5
    }
  ],
  "summary": {
    "total": 5,
    "byCategory": { "Framework": 2, "Hosting": 1, "Analytics": 2 }
  }
}
```

### `GET /health`

Health check endpoint. Returns `{ "status": "ok" }`.

## Adding Detection Rules

Detection rules live in `stacksniff-backend/data/rules.json`. Each rule follows this format:

```json
{
  "id": "technology-id",
  "name": "Technology Name",
  "category": "Framework",
  "description": "Short description",
  "icon": "https://cdn.simpleicons.org/icon/white",
  "website": "https://technology.dev",
  "patterns": [
    { "type": "html_contains", "value": "__UNIQUE_TOKEN__", "strength": "strong" },
    { "type": "header_contains", "key": "server", "value": "TechServer", "strength": "weak" }
  ]
}
```

**Supported pattern types:** `header_exists`, `header_contains`, `header_equals`, `meta_generator`, `html_contains`, `script_src_contains`, `link_href_contains`, `cookie_contains`, `inline_script_contains`, `img_src_contains`, `class_name_contains`

**Strength levels:** `strong` (3 points) or `weak` (1 point)

## Contributing

Contributions are welcome! Here are some ways to help:

- Add new technology detection rules
- Improve detection accuracy
- Connect the frontend to the live backend API
- Add new signal extraction methods
- Improve UI/UX

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/add-new-rules`)
3. Commit your changes (`git commit -m "Add detection rules for X"`)
4. Push to the branch (`git push origin feature/add-new-rules`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
