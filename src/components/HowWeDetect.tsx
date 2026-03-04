"use client";

import { useState } from "react";

const methods = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "HTTP Headers",
    desc: "Analyzing server response headers like X-Powered-By, Server, and custom headers to identify backend technologies.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "HTML Patterns",
    desc: "Scanning the DOM for framework-specific attributes, meta tags, and structural patterns unique to each technology.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Script URLs",
    desc: "Matching loaded script sources against known CDN patterns and library URLs for analytics, frameworks, and tools.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "JS Globals",
    desc: "Checking for global JavaScript variables and objects that frameworks and libraries expose on the window object.",
  },
];

export default function HowWeDetect() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="how-it-works" className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
      >
        <span className="font-medium">How we detect technologies</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 pt-0 animate-fade-in-up">
          {methods.map((m) => (
            <div
              key={m.title}
              className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="text-blue-400 mb-3">{m.icon}</div>
              <h4 className="text-white text-sm font-medium mb-1">{m.title}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
