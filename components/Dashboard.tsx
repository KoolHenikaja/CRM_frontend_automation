"use client";

import { useEffect, useMemo, useState } from "react";
import { BUCKET_LABELS, BUCKET_ORDER, Lead } from "@/lib/types";
import { apresAppel, evaluateLeads } from "@/lib/priority";
import TopBar from "./TopBar";
import KanbanColumn from "./KanbanColumn";
import InfoPanel from "./InfoPanel";

const DEFAULT_TODAY = "2026-07-20"; // lendemain du dernier lead de l'export

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [today, setToday] = useState(DEFAULT_TODAY);
  const [commercial, setCommercial] = useState("tous");
  const [query, setQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => setLeads(data.leads));
  }, []);

  const commerciaux = useMemo(() => {
    if (!leads) return [];
    return Array.from(new Set(leads.map((l) => l.commercial))).sort();
  }, [leads]);

  const evaluated = useMemo(() => {
    if (!leads) return [];
    const todayDate = new Date(today + "T00:00:00");
    let filtered = leads;
    if (commercial !== "tous") {
      filtered = filtered.filter((l) => l.commercial === commercial);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.nom.toLowerCase().includes(q) ||
          l.prenom.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      );
    }
    return evaluateLeads(filtered, todayDate);
  }, [leads, today, commercial, query]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof evaluated> = {};
    for (const b of BUCKET_ORDER) map[b] = [];
    for (const lead of evaluated) map[lead.bucket].push(lead);
    return map;
  }, [evaluated]);

  function handleMarquerAppele(email: string) {
    setLeads((prev) => {
      if (!prev) return prev;
      const todayDate = new Date(today + "T00:00:00");
      return prev.map((l) =>
        l.email === email ? apresAppel(l, todayDate) : l
      );
    });
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar
        today={today}
        onTodayChange={setToday}
        commerciaux={commerciaux}
        commercial={commercial}
        onCommercialChange={setCommercial}
        query={query}
        onQueryChange={setQuery}
        onToggleInfo={() => setShowInfo((v) => !v)}
      />
      {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}

      {!leads ? (
        <div className="flex flex-1 items-center justify-center text-console-textFaint">
          Chargement des leads…
        </div>
      ) : (
        <div className="flex flex-1 gap-3 overflow-x-auto p-4">
          {BUCKET_ORDER.map((b) => (
            <KanbanColumn
              key={b}
              bucket={b}
              label={BUCKET_LABELS[b]}
              leads={grouped[b]}
              onMarquerAppele={handleMarquerAppele}
            />
          ))}
        </div>
      )}
    </div>
  );
}
