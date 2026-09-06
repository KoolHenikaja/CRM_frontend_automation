import { Bucket, EvaluatedLead, Lead } from "./types";

/**
 * LOGIQUE DE PRIORISATION DES RELANCES
 * ------------------------------------
 * La base Airtable ne contient pas de champ "date du dernier appel" ni
 * "prochaine relance prévue" : on ne dispose que de la date d'arrivée du
 * lead, de sa "chaleur" (0 à 10) et du nombre d'appels déjà passés.
 *
 * Hypothèse de modélisation (assumée et documentée, cf. README) :
 * on considère que les appels déjà passés ont suivi une cadence régulière
 * depuis l'arrivée du lead. Le rythme de cette cadence dépend de la chaleur :
 * un lead très chaud doit être rappelé rapidement pendant qu'il est motivé,
 * un lead froid peut être rappelé plus espacé. On en déduit une date de
 * "prochaine relance prévue" = date d'arrivée + (nombre d'appels × cadence).
 *
 * Un lead qui a reçu beaucoup d'appels sans jamais monter en température
 * (chaleur toujours basse) a peu de chances de se transformer : on le sort
 * du flux normal et on le place dans une colonne "à archiver" plutôt que
 * de continuer à consommer du temps commercial dessus.
 */

// Cadence recommandée (en jours) entre deux relances, selon la chaleur du lead.
export function cadenceJours(chaleur: number): number {
  if (chaleur >= 8) return 2; // brûlant : il faut battre le fer tant qu'il est chaud
  if (chaleur >= 5) return 4; // tiède : relance régulière
  if (chaleur >= 2) return 7; // froid : une fois par semaine suffit
  return 14; // glacial : entretien minimal, sauf s'il finit archivé
}

// Un lead est considéré à archiver s'il a déjà reçu plusieurs appels
// sans jamais montrer de signe d'intérêt réel.
function estAArchiver(chaleur: number, nombreAppel: number): boolean {
  return chaleur <= 2 && nombreAppel >= 4;
}

function ajouterJours(dateIso: string, jours: number): Date {
  const d = new Date(dateIso + "T00:00:00");
  d.setDate(d.getDate() + jours);
  return d;
}

function diffEnJours(a: Date, b: Date): number {
  const ms = a.getTime() - b.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function evaluateLead(lead: Lead, today: Date): EvaluatedLead {
  const arrivee = new Date(lead.dateArrivee + "T00:00:00");
  const joursDepuisArrivee = diffEnJours(today, arrivee);
  const cadence = cadenceJours(lead.chaleur);

  // Si on connaît la date du dernier appel (posée localement via "Marquer
  // appelé", ou disponible dans Airtable si le champ existe), on part de
  // là. Sinon on retombe sur l'hypothèse : appels espacés régulièrement
  // depuis l'arrivée du lead.
  const prochaineRelanceDate = lead.dateDernierAppel
    ? ajouterJours(lead.dateDernierAppel, cadence)
    : ajouterJours(lead.dateArrivee, lead.nombreAppel * cadence);
  // Diff > 0 : la relance est prévue dans le futur (pas encore due)
  // Diff < 0 : la relance est due depuis |diff| jours (en retard)
  const diffJours = diffEnJours(prochaineRelanceDate, today);
  const retardJours = diffJours < 0 ? -diffJours : 0;

  let bucket: Bucket;
  if (estAArchiver(lead.chaleur, lead.nombreAppel)) {
    bucket = "a_archiver";
  } else if (diffJours < 0) {
    bucket = "en_retard";
  } else if (diffJours <= 1) {
    bucket = "aujourdhui_demain";
  } else if (diffJours <= 6) {
    bucket = "cette_semaine";
  } else {
    bucket = "plus_tard";
  }

  // Score de tri (plus haut = plus urgent à traiter) :
  // - le retard pèse le plus lourd (un rappel en retard est prioritaire) ;
  // - la chaleur du lead vient ensuite (à retard égal, on privilégie le plus chaud) ;
  // - un nombre d'appels déjà élevé pèse légèrement à la baisse (fatigue du lead),
  //   plafonné pour ne pas écraser complètement le critère de chaleur.
  const score =
    -diffJours * 10 + lead.chaleur * 3 - Math.min(lead.nombreAppel - 1, 4) * 2;

  return {
    ...lead,
    id: lead.email,
    joursDepuisArrivee,
    cadenceJours: cadence,
    prochaineRelance: toIsoDate(prochaineRelanceDate),
    diffJours,
    retardJours,
    score,
    bucket,
  };
}

export function evaluateLeads(leads: Lead[], today: Date): EvaluatedLead[] {
  return leads
    .map((l) => evaluateLead(l, today))
    .sort((a, b) => b.score - a.score);
}

/** Simule l'effet d'un appel qui vient d'être passé : incrémente le compteur
 * et enregistre la date du jour comme dernier appel, ce qui recalcule
 * aussitôt la prochaine échéance. Purement local à la démo : en
 * production, cette action écrirait dans Airtable (cf. README). */
export function apresAppel(lead: Lead, today: Date): Lead {
  return {
    ...lead,
    nombreAppel: lead.nombreAppel + 1,
    dateDernierAppel: toIsoDate(today),
  };
}
