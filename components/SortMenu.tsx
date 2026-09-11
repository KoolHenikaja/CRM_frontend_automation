"use client";

import { Check, ArrowUpDown, ChevronDown } from "lucide-react";
import { GroupBy, SortDir, SORT_LABELS } from "@/lib/grouping";
import Popover from "./Popover";

export default function SortMenu({
  groupBy,
  value,
  onChange,
}: {
  groupBy: GroupBy;
  value: SortDir;
  onChange: (v: SortDir) => void;
}) {
  const labels = SORT_LABELS[groupBy];

  return (
    <Popover
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-card border border-console-line bg-console-panel px-2.5 py-1.5 text-[12px] text-console-textDim hover:text-console-text"
        >
          <ArrowUpDown size={13} strokeWidth={2} />
          {labels[value]}
          <ChevronDown size={12} strokeWidth={2} />
        </button>
      )}
    >
      {(close) => (
        <div>
          {(["asc", "desc"] as SortDir[]).map((dir) => (
            <button
              key={dir}
              onClick={() => {
                onChange(dir);
                close();
              }}
              className="flex w-full bg-black/90 items-center gap-2 rounded-card px-2 py-1.5 text-left text-[12px] text-console-text hover:bg-console-panelAlt"
            >
              <span className="flex-1">{labels[dir]}</span>
              {dir === value && <Check size={13} strokeWidth={2} className="text-signal-cool" />}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
