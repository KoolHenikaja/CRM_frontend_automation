import { LucideIcon } from "lucide-react";
import { EvaluatedLead } from "@/lib/types";
import LeadCard from "./LeadCard";

export default function KanbanColumn({
  label,
  accentColor,
  icon: Icon,
  leads,
  onMarquerAppele,
}: {
  label: string;
  accentColor: string;
  icon?: LucideIcon;
  leads: EvaluatedLead[];
  onMarquerAppele: (email: string) => void;
}) {
  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col rounded-panel border border-console-line bg-console-panel">
      <div className="flex items-center gap-2 border-b border-console-line px-3 py-2.5">
        {Icon ? (
          <Icon size={14} strokeWidth={2} />
        ) : (
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
        <span className="truncate text-[13px] font-medium text-console-text">{label}</span>
        <span
          className="ml-auto shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[11px]"
          style={{ color: accentColor, backgroundColor: `${accentColor}1A` }}
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
