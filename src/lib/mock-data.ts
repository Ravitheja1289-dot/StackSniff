export type TechCategory =
  | "Framework"
  | "CMS"
  | "Hosting"
  | "Analytics"
  | "CDN"
  | "Language"
  | "Database";

export type FilterCategory =
  | "All"
  | "Frontend"
  | "Backend"
  | "CMS"
  | "Hosting"
  | "Analytics"
  | "CDN";

export type Confidence = "low" | "medium" | "high";

export interface Technology {
  name: string;
  icon: string;
  category: TechCategory;
  filterCategory: FilterCategory;
  confidence: Confidence;
  description: string;
}

export const categoryColors: Record<TechCategory, string> = {
  Framework: "#3b82f6",
  CMS: "#0ea5e9",
  Hosting: "#22c55e",
  Analytics: "#f97316",
  CDN: "#06b6d4",
  Language: "#eab308",
  Database: "#ef4444",
};

export const confidencePercent: Record<Confidence, number> = {
  low: 33,
  medium: 66,
  high: 95,
};

export const confidenceColor: Record<Confidence, string> = {
  low: "#eab308",
  medium: "#f97316",
  high: "#22c55e",
};

export const scanLogMessages = [
  "Fetching headers...",
  "Analyzing HTML structure...",
  "Detecting frameworks...",
  "Checking analytics scripts...",
  "Scanning for CDN signatures...",
  "Inspecting JS globals...",
  "Identifying hosting provider...",
  "Finalizing results...",
];

export const mockTechnologies: Technology[] = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "Framework",
    filterCategory: "Frontend",
    confidence: "high",
    description: "A JavaScript library for building user interfaces",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    category: "Framework",
    filterCategory: "Frontend",
    confidence: "high",
    description: "The React framework for production-grade applications",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    category: "Language",
    filterCategory: "Frontend",
    confidence: "medium",
    description: "Typed superset of JavaScript that compiles to plain JS",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    category: "Framework",
    filterCategory: "Backend",
    confidence: "medium",
    description: "JavaScript runtime built on Chrome's V8 engine",
  },
  {
    name: "Vercel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
    category: "Hosting",
    filterCategory: "Hosting",
    confidence: "high",
    description: "Cloud platform for static and serverless deployment",
  },
  {
    name: "Cloudflare",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg",
    category: "CDN",
    filterCategory: "CDN",
    confidence: "high",
    description: "Global CDN and DDoS protection service",
  },
  {
    name: "Google Analytics",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
    category: "Analytics",
    filterCategory: "Analytics",
    confidence: "high",
    description: "Web analytics service for tracking website traffic",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    category: "Database",
    filterCategory: "Backend",
    confidence: "low",
    description: "Advanced open-source relational database system",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    category: "Framework",
    filterCategory: "Frontend",
    confidence: "high",
    description: "Utility-first CSS framework for rapid UI development",
  },
  {
    name: "WordPress",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
    category: "CMS",
    filterCategory: "CMS",
    confidence: "medium",
    description: "Open-source content management system for websites",
  },
  {
    name: "Stripe",
    icon: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
    category: "Framework",
    filterCategory: "Frontend",
    confidence: "medium",
    description: "Payment processing platform for internet businesses",
  },
  {
    name: "Segment",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
    category: "Analytics",
    filterCategory: "Analytics",
    confidence: "medium",
    description: "Customer data platform for collecting analytics data",
  },
];

export function getMockResults(): {
  technologies: Technology[];
  scanTime: number;
} {
  // Return 8-12 random technologies
  const count = 8 + Math.floor(Math.random() * 5);
  const shuffled = [...mockTechnologies].sort(() => 0.5 - Math.random());
  return {
    technologies: shuffled.slice(0, Math.min(count, shuffled.length)),
    scanTime: +(1.0 + Math.random() * 2.0).toFixed(1),
  };
}
