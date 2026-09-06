"use client";

import { useEffect, useRef, useState } from "react";

export default function Popover({
  trigger,
  children,
}: {
  trigger: (opts: { open: boolean; toggle: () => void }) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickAway(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-56 rounded-panel border border-console-line bg-console-panel p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
