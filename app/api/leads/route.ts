import { NextResponse } from "next/server";
import { Lead } from "@/lib/types";
import localLeads from "@/data/leads.json";

export const dynamic = "force-dynamic";

/**
 * En production, cette route interrogerait l'API Airtable directement
 * (base + table + token stockés en variables d'environnement) pour que
 * le tableau de bord reste toujours synchronisé avec le CRM. Le champ
 * "chaleur" mérite en plus d'être branché sur un webhook Airtable côté
 * automatisation (Zapier/Make ou Airtable Automations) pour être recalculé
 * dès qu'un commercial modifie le lead.
 *
 * Pour cet exercice, aucune clé d'API Airtable n'a été fournie : la route
 * retombe donc sur l'export CSV fourni (data/leads.json). Le code
 * ci-dessous montre néanmoins comment le branchement réel se ferait.
 */
async function fetchFromAirtable(): Promise<Lead[] | null> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE || "Leads";

  if (!token || !baseId) return null;

  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;

  const json = await res.json();
  return (json.records || []).map((r: any) => ({
    email: r.fields["Mail"],
    nom: r.fields["Nom"],
    prenom: r.fields["Prénom"],
    commercial: r.fields["Commercial"],
    chaleur: r.fields["Chaleur"] ?? 0,
    dateArrivee: r.fields["Date d'arrivée"],
    nombreAppel: r.fields["Nombre d'appel"] ?? 0,
  }));
}

export async function GET() {
  const fromAirtable = await fetchFromAirtable();
  const leads: Lead[] = fromAirtable ?? (localLeads as Lead[]);
  return NextResponse.json({
    leads,
    source: fromAirtable ? "airtable" : "csv_local",
  });
}
