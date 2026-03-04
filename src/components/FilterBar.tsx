"use client";

import { FilterCategory } from "@/lib/mock-data";

const filters: FilterCategory[] = [
  "All",
  "Frontend",
  "Backend",
  "CMS",
  "Hosting",
  "Analytics",
  "CDN",
];

interface FilterBarProps {
  active: FilterCategory;
  onFilter: (cat: FilterCategory) => void;
}

export default function FilterBar({ active, onFilter }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilter(f)}
          className={`filter-pill px-3.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
            active === f
              ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
              : "bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:border-white/10"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
