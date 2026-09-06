import { BUCKET_LABELS, BUCKET_ORDER, EvaluatedLead } from "./types";

export type GroupBy = "priorite" | "commercial" | "chaleur" | "nombreAppel" | "dateArrivee";

export type SortDir = "asc" | "desc";

export type Colonne = {
  key: string;
  label: string;
  leads: EvaluatedLead[];
};

export const GROUP_LABELS: Record<GroupBy, string> = {
  priorite: "Priorité (notre logique)",
  commercial: "Commercial",
  chaleur: "Chaleur",
  nombreAppel: "Nombre d'appel",
  dateArrivee: "Date d'arrivée",
};

// Le libellé du contrôle de tri s'adapte au champ groupé, comme dans Airtable
// (A → Z pour un champ texte, 1 → 9 pour un champ numérique, etc.)
export const SORT_LABELS: Record<GroupBy, { asc: string; desc: string }> = {
  priorite: { asc: "A → Z", desc: "Z → A" },
  commercial: { asc: "A → Z", desc: "Z → A" },
  chaleur: { asc: "1 → 9", desc: "9 → 1" },
  nombreAppel: { asc: "1 → 9", desc: "9 → 1" },
  dateArrivee: { asc: "A → Z", desc: "Z → A" },
};

function moisLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const label = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function buildColonnes(
  leads: EvaluatedLead[],
  groupBy: GroupBy,
  sortDir: SortDir
): Colonne[] {
  // À l'intérieur d'un groupe, on garde toujours le classement par urgence
  // réelle (retard, puis chaleur) : c'est la valeur ajoutée de l'outil par
  // rapport à un simple export Airtable.
  const parScore = [...leads].sort((a, b) => b.score - a.score);

  let colonnes: Colonne[];

  if (groupBy === "priorite") {
    colonnes = BUCKET_ORDER.map((b) => ({
      key: b,
      label: BUCKET_LABELS[b],
      leads: parScore.filter((l) => l.bucket === b),
    }));
  } else if (groupBy === "commercial") {
    const noms = Array.from(new Set(leads.map((l) => l.commercial))).sort((a, b) =>
      a.localeCompare(b, "fr")
    );
    colonnes = noms.map((nom) => ({
      key: nom,
      label: nom,
      leads: parScore.filter((l) => l.commercial === nom),
    }));
  } else if (groupBy === "chaleur") {
    const valeurs = Array.from(new Set(leads.map((l) => l.chaleur))).sort((a, b) => a - b);
    colonnes = valeurs.map((v) => ({
      key: String(v),
      label: `Chaleur ${v}`,
      leads: parScore.filter((l) => l.chaleur === v),
    }));
  } else if (groupBy === "nombreAppel") {
    const valeurs = Array.from(new Set(leads.map((l) => l.nombreAppel))).sort((a, b) => a - b);
    colonnes = valeurs.map((v) => ({
      key: String(v),
      label: `${v} appel${v > 1 ? "s" : ""}`,
      leads: parScore.filter((l) => l.nombreAppel === v),
    }));
  } else {
    // dateArrivee : regroupé par mois d'arrivée
    const mois = Array.from(new Set(leads.map((l) => l.dateArrivee.slice(0, 7)))).sort();
    colonnes = mois.map((m) => ({
      key: m,
      label: moisLabel(m + "-01"),
      leads: parScore.filter((l) => l.dateArrivee.slice(0, 7) === m),
    }));
  }

  if (sortDir === "desc") colonnes = colonnes.reverse();
  return colonnes;
}
