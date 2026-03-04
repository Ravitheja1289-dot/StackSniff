"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import ScanningAnimation from "@/components/ScanningAnimation";
import ResultsSummary from "@/components/ResultsSummary";
import FilterBar from "@/components/FilterBar";
import TechCard from "@/components/TechCard";
import HowWeDetect from "@/components/HowWeDetect";
import {
  Technology,
  FilterCategory,
  getMockResults,
} from "@/lib/mock-data";

type AppState = "idle" | "scanning" | "results" | "error";

function extractDomain(input: string): string {
  let url = input.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState("");
  const [results, setResults] = useState<Technology[]>([]);
  const [scanTime, setScanTime] = useState(0);
  const [domain, setDomain] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleScan = useCallback(() => {
    const d = extractDomain(urlInput);
    if (!d) {
      setError("Please enter a valid URL");
      setState("error");
      return;
    }

    setError("");
    setState("scanning");
    setDomain(d);
    setActiveFilter("All");

    // Simulate scan
    setTimeout(() => {
      const { technologies, scanTime: st } = getMockResults();
      setResults(technologies);
      setScanTime(st);
      setState("results");

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 3500);
  }, [urlInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleScan();
    },
    [handleScan]
  );

  const handleExampleClick = useCallback((example: string) => {
    setUrlInput(example);
    inputRef.current?.focus();
  }, []);

  const handleScanAnother = useCallback(() => {
    setState("idle");
    setUrlInput("");
    setResults([]);
    setError("");
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const filteredResults = useMemo(() => {
    if (activeFilter === "All") return results;
    return results.filter((t) => t.filterCategory === activeFilter);
  }, [results, activeFilter]);

  const examples = ["stripe.com", "notion.so", "github.com"];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <div ref={heroRef} className="dot-grid min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Open-source tech stack detector
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Detect Any Website&apos;s{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Tech Stack
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed">
            Instantly see what frameworks, CMS, hosting, and tools any website
            is built with
          </p>

          {/* Search input */}
          <div className="w-full mt-2">
            <div className="input-glow flex items-center w-full rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-200 focus-within:border-blue-500/50">
              <div className="pl-4 text-zinc-500">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (state === "error") setState("idle");
                }}
                onKeyDown={handleKeyDown}
                placeholder="https://stripe.com"
                className="flex-1 bg-transparent px-3 py-4 text-white text-sm placeholder:text-zinc-600 focus:outline-none font-mono"
                disabled={state === "scanning"}
              />
              <button
                onClick={handleScan}
                disabled={state === "scanning"}
                className="m-1.5 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                {state === "scanning" ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Scanning
                  </span>
                ) : (
                  "Scan"
                )}
              </button>
            </div>

            {/* Error message */}
            {state === "error" && error && (
              <p className="mt-2 text-red-400 text-xs text-left pl-1">{error}</p>
            )}
          </div>

          {/* Example links */}
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <span>Try:</span>
            {examples.map((ex, i) => (
              <span key={ex} className="flex items-center">
                <button
                  onClick={() => handleExampleClick(ex)}
                  className="text-zinc-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {ex}
                </button>
                {i < examples.length - 1 && (
                  <span className="mx-1 text-zinc-700">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scanning state */}
      {state === "scanning" && (
        <div className="max-w-2xl mx-auto px-4">
          <ScanningAnimation />
        </div>
      )}

      {/* Results */}
      {state === "results" && results.length > 0 && (
        <div ref={resultsRef} className="max-w-5xl mx-auto px-4 pb-24 pt-8">
          <div className="flex flex-col gap-6">
            {/* Summary */}
            <ResultsSummary
              domain={domain}
              techCount={results.length}
              scanTime={scanTime}
            />

            {/* Filter bar */}
            <FilterBar active={activeFilter} onFilter={setActiveFilter} />

            {/* Tech grid */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.map((tech, i) => (
                  <TechCard key={tech.name} tech={tech} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-12 h-12 text-zinc-700"
                >
                  <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-zinc-500 text-sm">
                  No technologies found in this category
                </p>
              </div>
            )}

            {/* How we detect */}
            <div className="mt-8">
              <HowWeDetect />
            </div>

            {/* Scan another */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleScanAnother}
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/10 rounded-xl transition-all cursor-pointer"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.379 2.624l-1.14 1.14a.75.75 0 01-1.06-1.06l1.14-1.14A5.5 5.5 0 0111.424 4.688l-1.14-1.14a.75.75 0 011.06-1.06l2.829 2.828a.75.75 0 010 1.061l-2.829 2.829a.75.75 0 11-1.06-1.061l1.14-1.14a4 4 0 10-.707 5.576l1.14-1.14a.75.75 0 011.06 1.06l-1.14 1.14z" clipRule="evenodd" />
                </svg>
                Scan another site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state - no tech detected */}
      {state === "results" && results.length === 0 && (
        <div ref={resultsRef} className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="flex flex-col items-center gap-4 animate-fade-in-up">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="w-16 h-16 text-zinc-700"
            >
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="text-white font-medium text-lg">
              Couldn&apos;t detect stack
            </h3>
            <p className="text-zinc-500 text-sm">
              This site may block scanners or use unrecognizable technologies
            </p>
            <button
              onClick={handleScanAnother}
              className="mt-4 px-5 py-2.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors cursor-pointer"
            >
              Try another site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
