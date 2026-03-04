"use client";

import {
  Technology,
  categoryColors,
  confidencePercent,
  confidenceColor,
} from "@/lib/mock-data";

interface TechCardProps {
  tech: Technology;
  index: number;
}

export default function TechCard({ tech, index }: TechCardProps) {
  const catColor = categoryColors[tech.category];
  const confPercent = confidencePercent[tech.confidence];
  const confColor = confidenceColor[tech.confidence];

  return (
    <div
      className="tech-card rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 flex flex-col gap-3 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Top row: icon + name + category */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 p-1.5">
          <img
            src={tech.icon}
            alt={tech.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'%3E%3Crect width='24' height='24' rx='4'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-size='12' font-family='monospace'%3E?%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold text-sm">{tech.name}</h3>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                color: catColor,
                backgroundColor: `${catColor}15`,
                border: `1px solid ${catColor}30`,
              }}
            >
              {tech.category}
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
            {tech.description}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider w-16">
          {tech.confidence}
        </span>
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full confidence-bar"
            style={{
              width: `${confPercent}%`,
              backgroundColor: confColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}
