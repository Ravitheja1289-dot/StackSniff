"use client";

import { useEffect, useState } from "react";
import { scanLogMessages } from "@/lib/mock-data";

export default function ScanningAnimation() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= scanLogMessages.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-16 animate-fade-in-up">
      {/* Radar animation */}
      <div className="relative w-32 h-32">
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/20 radar-ring" />
        <div className="absolute inset-0 rounded-full border border-blue-500/20 radar-ring-delayed" />
        <div className="absolute inset-0 rounded-full border border-blue-500/20 radar-ring-delayed-2" />

        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 radar-pulse" />
          </div>
        </div>

        {/* Sweep line */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="radar-sweep origin-center">
            <div className="w-0.5 h-16 bg-gradient-to-t from-blue-500/60 to-transparent -translate-y-8" />
          </div>
        </div>
      </div>

      <p className="text-sm text-zinc-400 font-medium">Scanning website...</p>

      {/* Terminal log lines */}
      <div className="w-full max-w-md bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-sm">
        {scanLogMessages.slice(0, visibleLines).map((msg, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-1 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className="text-blue-400">→</span>
            <span className="text-zinc-300">{msg}</span>
            {i === visibleLines - 1 && i < scanLogMessages.length - 1 && (
              <span className="cursor-blink" />
            )}
            {i < visibleLines - 1 && (
              <span className="text-green-400 ml-auto text-xs">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
