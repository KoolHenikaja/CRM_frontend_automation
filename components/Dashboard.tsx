"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock,
  CalendarDays,
  Hourglass,
  Archive,
  Users,
  Phone,
  LucideIcon,
} from "lucide-react";
import { Lead } from "@/lib/types";
import { apresAppel, evaluateLeads } from "@/lib/priority";
import { buildColonnes, GroupBy, SortDir } from "@/lib/grouping";
import { commercialColor, heatColor } from "@/lib/colors";
import TopBar from "./TopBar";
import KanbanColumn from "./KanbanColumn";
import InfoPanel from "./InfoPanel";

const DEFAULT_TODAY = "2026-07-20"; // lendemain du dernier lead de l'export

const BUCKET_ACCENT: Record<string, string> = {
  en_retard: "#FF6A3D",
  aujourdhui_demain: "#F2A14E",
  cette_semaine: "#3DB8E0",
  plus_tard: "#586170",
  a_archiver: "#4A5058",
};

const BUCKET_ICON: Record<string, LucideIcon> = {
  en_retard: AlertTriangle,
  aujourdhui_demain: Clock,
  cette_semaine: CalendarDays,
  plus_tard: Hourglass,
  a_archiver: Archive,
};

// Détermine la couleur et l'icône d'une colonne selon le champ de groupement
// actif, pour que l'entête reste lisible quel que soit le regroupement choisi.
function colonneStyle(groupBy: GroupBy, key: string) {
  if (groupBy === "priorite") {
    return { accentColor: BUCKET_ACCENT[key], icon: BUCKET_ICON[key] };
  }
  if (groupBy === "commercial") {
    return { accentColor: commercialColor(key), icon: Users };
  }
  if (groupBy === "chaleur") {
    return { accentColor: heatColor(Number(key)), icon: undefined };
  }
  if (groupBy === "nombreAppel") {
    return { accentColor: "#6B7280", icon: Phone };
  }
  return { accentColor: "#6B7280", icon: CalendarDays };
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [today, setToday] = useState(DEFAULT_TODAY);
  const [commercial, setCommercial] = useState("tous");
  const [query, setQuery] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("priorite");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
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

  const colonnes = useMemo(
    () => buildColonnes(evaluated, groupBy, sortDir),
    [evaluated, groupBy, sortDir]
  );

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
        groupBy={groupBy}
        onGroupByChange={(v) => {
          setGroupBy(v);
          setSortDir("asc");
        }}
        sortDir={sortDir}
        onSortDirChange={setSortDir}
        onToggleInfo={() => setShowInfo((v) => !v)}
      />
      {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}

      {!leads ? (
        <div className="flex flex-1 items-center justify-center text-console-textFaint">
          Chargement des leads…
        </div>
      ) : (
        <div className="flex flex-1 gap-3 overflow-x-auto p-4">
          {colonnes.map((col) => {
            const style = colonneStyle(groupBy, col.key);
            return (
              <KanbanColumn
                key={col.key}
                label={col.label}
                accentColor={style.accentColor}
                icon={style.icon}
                leads={col.leads}
                onMarquerAppele={handleMarquerAppele}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}