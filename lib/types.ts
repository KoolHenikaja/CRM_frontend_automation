export type Lead = {
  email: string;
  nom: string;
  prenom: string;
  commercial: string;
  chaleur: number; // 0 (froid) à 10 (brûlant)
  dateArrivee: string; // ISO yyyy-mm-dd
  nombreAppel: number;
  dateDernierAppel?: string; // ISO yyyy-mm-dd — posé localement après un clic "Marquer appelé"
};

export type Bucket =
  | "en_retard"
  | "aujourdhui_demain"
  | "cette_semaine"
  | "plus_tard"
  | "a_archiver";

export type EvaluatedLead = Lead & {
  id: string;
  joursDepuisArrivee: number;
  cadenceJours: number;
  prochaineRelance: string; // ISO date
  diffJours: number; // négatif = en retard, positif = pas encore dû, 0 = aujourd'hui
  retardJours: number; // positif = en retard, 0 sinon
  score: number;
  bucket: Bucket;
};

export const BUCKET_LABELS: Record<Bucket, string> = {
  en_retard: "En retard",
  aujourdhui_demain: "Aujourd'hui / demain",
  cette_semaine: "Cette semaine",
  plus_tard: "Plus tard",
  a_archiver: "À archiver",
};

export const BUCKET_ORDER: Bucket[] = [
  "en_retard",
  "aujourdhui_demain",
  "cette_semaine",
  "plus_tard",
  "a_archiver",
];
