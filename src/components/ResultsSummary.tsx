"use client";

import { useState } from "react";

interface ResultsSummaryProps {
  domain: string;
  techCount: number;
  scanTime: number;
}

export default function ResultsSummary({
  domain,
  techCount,
  scanTime,
}: ResultsSummaryProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] animate-fade-in-up">
      {/* Left: favicon + domain */}
      <div className="flex items-center gap-3">
        <img
          src={favicon}
          alt=""
          className="w-6 h-6 rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="text-white font-medium font-mono text-sm">
          {domain}
        </span>
      </div>

      {/* Right: badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {techCount} technologies detected
        </span>
        <span className="text-xs text-zinc-500">
          Scanned in {scanTime}s
        </span>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-3.5 h-3.5"
          >
            <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M8 8l6-6m0 0v4m0-4h-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {copied ? "Copied!" : "Share Results"}
        </button>
      </div>
    </div>
  );
}
