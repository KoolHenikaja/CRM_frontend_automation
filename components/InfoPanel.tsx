import { X } from "lucide-react";

export default function InfoPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="border-b border-console-line bg-console-panel px-5 py-4 text-[13px] leading-relaxed text-console-textDim">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-console-text">Comment les colonnes sont calculées</p>
        <button onClick={onClose} className="text-console-textFaint hover:text-console-text">
          <X size={15} />
        </button>
      </div>
      <p>
        Chaque lead a une <strong className="text-console-text">cadence de relance</strong> qui
        dépend de sa chaleur (0 à 10) : tous les 2 jours au-dessus de 8, tous
        les 4 jours entre 5 et 7, toutes les semaines entre 2 et 4, au-delà
        seulement pour les plus froids. À partir de cette cadence et du
        nombre d&apos;appels déjà passés, l&apos;outil calcule une date de
        prochaine relance, et classe le lead dans une colonne :{" "}
        <em>En retard</em>, <em>Aujourd&apos;hui / demain</em>,{" "}
        <em>Cette semaine</em> ou <em>Plus tard</em>. Un lead qui a reçu 4
        appels ou plus sans jamais dépasser une chaleur de 2 est basculé dans{" "}
        <em>À archiver</em> : mieux vaut ne plus y passer de temps commercial.
      </p>
      <p className="mt-2">
        À l&apos;intérieur d&apos;une même colonne, les leads sont triés par
        urgence réelle (retard, puis chaleur), pas seulement par date.
      </p>
      <p className="mt-2 text-console-textFaint">
        Limite assumée : la base ne contient pas de date de dernier appel, la
        cadence passée est donc estimée à partir de la date d&apos;arrivée.
        Ajouter un champ « date du dernier appel » dans Airtable rendrait ce
        calcul exact plutôt qu&apos;estimé.
      </p>
    </div>
  );
}
