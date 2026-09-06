"use client";

import { Check, Layers, Users, Thermometer, Phone, CalendarDays, ChevronDown, LucideIcon } from "lucide-react";
import { GroupBy, GROUP_LABELS } from "@/lib/grouping";
import Popover from "./Popover";

const ICONS: Record<GroupBy, LucideIcon> = {
  priorite: Layers,
  commercial: Users,
  chaleur: Thermometer,
  nombreAppel: Phone,
  dateArrivee: CalendarDays,
};

const OPTIONS: GroupBy[] = ["priorite", "commercial", "chaleur", "nombreAppel", "dateArrivee"];

export default function GroupMenu({
  value,
  onChange,
}: {
  value: GroupBy;
  onChange: (v: GroupBy) => void;
}) {
  return (
    <Popover
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-card border border-console-line bg-console-panel px-2.5 py-1.5 text-[12px] text-console-textDim hover:text-console-text"
        >
          <Layers size={13} strokeWidth={2} />
          Groupé selon {GROUP_LABELS[value]}
          <ChevronDown size={12} strokeWidth={2} />
        </button>
      )}
    >
      {(close) => (
        <div>
          <p className="px-2 pb-1.5 pt-1 text-[11px] text-console-textFaint">
            Grouper selon
          </p>
          {OPTIONS.map((opt) => {
            const Icon = ICONS[opt];
            const active = opt === value;
            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  close();
                }}
                className="flex w-full items-center gap-2 rounded-card px-2 py-1.5 text-left text-[12px] text-console-text hover:bg-console-panelAlt"
              >
                <Icon size={13} strokeWidth={2} />
                <span className="flex-1">{GROUP_LABELS[opt]}</span>
                {active && <Check size={13} strokeWidth={2} className="text-signal-cool" />}
              </button>
            );
          })}
        </div>
      )}
    </Popover>
  );
}
