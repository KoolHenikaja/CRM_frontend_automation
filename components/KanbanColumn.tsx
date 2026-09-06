import { AlertTriangle, Clock, CalendarDays, Hourglass, Archive, LucideIcon } from "lucide-react";
import { Bucket, EvaluatedLead } from "@/lib/types";
import LeadCard from "./LeadCard";

const ICONS: Record<Bucket, LucideIcon> = {
  en_retard: AlertTriangle,
  aujourdhui_demain: Clock,
  cette_semaine: CalendarDays,
  plus_tard: Hourglass,
  a_archiver: Archive,
};

const ACCENT: Record<Bucket, string> = {
  en_retard: "#FF6A3D",
  aujourdhui_demain: "#F2A14E",
  cette_semaine: "#3DB8E0",
  plus_tard: "#586170",
  a_archiver: "#4A5058",
};

export default function KanbanColumn({
  bucket,
  label,
  leads,
  onMarquerAppele,
}: {
  bucket: Bucket;
  label: string;
  leads: EvaluatedLead[];
  onMarquerAppele: (email: string) => void;
}) {
  const Icon = ICONS[bucket];
  const accent = ACCENT[bucket];

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col rounded-panel border border-console-line bg-console-panel">
      <div className="flex items-center gap-2 border-b border-console-line px-3 py-2.5">
        <Icon size={14} strokeWidth={2} />
        <span className="text-[13px] font-medium text-console-text">{label}</span>
        <span
          className="ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11px]"
          style={{ color: accent, backgroundColor: `${accent}1A` }}
        >
          {leads.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        {leads.length === 0 && (
          <p className="px-2 py-6 text-center text-[12px] text-console-textFaint">
            Rien ici
          </p>
        )}
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onMarquerAppele={onMarquerAppele} />
        ))}
      </div>
    </div>
  );
}
