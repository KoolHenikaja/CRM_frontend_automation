"use client";

import { Search, Info } from "lucide-react";

export default function TopBar({
  today,
  onTodayChange,
  commerciaux,
  commercial,
  onCommercialChange,
  query,
  onQueryChange,
  onToggleInfo,
}: {
  today: string;
  onTodayChange: (v: string) => void;
  commerciaux: string[];
  commercial: string;
  onCommercialChange: (v: string) => void;
  query: string;
  onQueryChange: (v: string) => void;
  onToggleInfo: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-console-line bg-console-bg px-5 py-3.5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-signal-ok" />
        <h1 className="text-[15px] font-medium tracking-tight text-console-text">
          Poste de relance
        </h1>
      </div>

      <div className="ml-1 flex items-center gap-1.5 text-[12px] text-console-textDim">
        <span>Aujourd&apos;hui</span>
        <input
          type="date"
          value={today}
          onChange={(e) => onTodayChange(e.target.value)}
          className="rounded-card border border-console-line bg-console-panel px-2 py-1 font-mono text-[12px] text-console-text"
        />
      </div>

      <select
        value={commercial}
        onChange={(e) => onCommercialChange(e.target.value)}
        className="rounded-card border border-console-line bg-console-panel px-2 py-1.5 text-[12px] text-console-text"
      >
        <option value="tous">Tous les commerciaux</option>
        {commerciaux.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="relative">
        <Search
          size={13}
          strokeWidth={2}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-console-textFaint"
        />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Rechercher un lead…"
          className="w-48 rounded-card border border-console-line bg-console-panel py-1.5 pl-7 pr-2 text-[12px] text-console-text placeholder:text-console-textFaint"
        />
      </div>

      <button
        onClick={onToggleInfo}
        className="ml-auto flex items-center gap-1.5 rounded-card border border-console-line px-2.5 py-1.5 text-[12px] text-console-textDim hover:text-console-text"
      >
        <Info size={13} strokeWidth={2} />
        Logique de priorisation
      </button>
    </div>
  );
}
