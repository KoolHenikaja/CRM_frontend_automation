"use client";

import { Phone, CalendarClock } from "lucide-react";
import HeatGauge from "./HeatGauge";
import { EvaluatedLead } from "@/lib/types";

const ACCENT: Record<string, string> = {
  en_retard: "#FF6A3D",
  aujourdhui_demain: "#F2A14E",
  cette_semaine: "#3DB8E0",
  plus_tard: "#586170",
  a_archiver: "#4A5058",
};

function libelleEcheance(lead: EvaluatedLead): string {
  if (lead.bucket === "a_archiver") {
    return `${lead.nombreAppel} appels, jamais monté en température`;
  }
  if (lead.diffJours < 0) {
    const j = -lead.diffJours;
    return `En retard de ${j} jour${j > 1 ? "s" : ""}`;
  }
  if (lead.diffJours === 0) return "À rappeler aujourd'hui";
  if (lead.diffJours === 1) return "À rappeler demain";
  return `À rappeler dans ${lead.diffJours} jours`;
}

const COMMERCIAL_COLORS: Record<string, string> = {
  Guillaume: "#8B7CD9",
  Adrien: "#4FB0C6",
  Antoine: "#D97757",
  Matthieu: "#7CB889",
};

export default function LeadCard({
  lead,
  onMarquerAppele,
}: {
  lead: EvaluatedLead;
  onMarquerAppele: (email: string) => void;
}) {
  const accent = ACCENT[lead.bucket];
  const commercialColor = COMMERCIAL_COLORS[lead.commercial] ?? "#6B7280";

  return (
    <div
      className="group rounded-card border border-console-line bg-console-panelAlt p-3"
      style={{ borderLeftColor: accent, borderLeftWidth: "3px" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-console-text">
            {lead.prenom} {lead.nom}
          </p>
          <p className="truncate text-[11px] text-console-textFaint">
            {lead.email}
          </p>
        </div>
        <HeatGauge chaleur={lead.chaleur} />
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-[12px]" style={{ color: accent }}>
        <CalendarClock size={13} strokeWidth={2} />
        <span>{libelleEcheance(lead)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-console-textDim">
          <span
            className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5"
            style={{ borderColor: commercialColor, color: commercialColor }}
          >
            {lead.commercial}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            <Phone size={11} strokeWidth={2} />
            {lead.nombreAppel}
          </span>
        </div>
        <button
          onClick={() => onMarquerAppele(lead.email)}
          className="rounded-card border border-console-line px-2 py-1 text-[11px] text-console-textDim opacity-0 transition-opacity hover:border-signal-cool hover:text-console-text group-hover:opacity-100 focus-visible:opacity-100"
        >
          Marquer appelé
        </button>
      </div>
    </div>
  );
}
