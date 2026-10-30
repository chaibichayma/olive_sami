import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Building2, Check, ChevronDown, ChevronLeft, ChevronRight,
  ChevronsUpDown, CircleDollarSign, ClipboardList, Download, Eye,
  FileText, Filter, Leaf, Phone, RefreshCw, RotateCcw, Search,
  SlidersHorizontal, UserRound, Users, WalletCards, X, Droplets,
  HandCoins,
} from 'lucide-react';

type Compte = {
  id: number;
  nom: string;
  telephone: string;
  numero: string;
  type: 'Client' | 'Fournisseur';
};

type BonReception = {
  id: number;
  reference: string;
  compteId: number;
  date: string;
  typeHuile: string;
  quantiteOlives: number;
  quantiteHuile: number;
  montant: number;
  montantPaye: number;
  resteAPayer: number;
  statut: 'Traité' | 'En cours' | 'En attente';
};

const TYPES_HUILE = [
  "Huile d'olive",
  'Huile vierge extra',
  'Huile vierge',
  'Lampante',
];

const COMPTES: Compte[] = [
  { id: 1, nom: 'Coopérative de Sousse', telephone: '+216 73 210 456', numero: 'CPT-001', type: 'Fournisseur' },
  { id: 2, nom: 'Société El Oliva', telephone: '+216 98 123 456', numero: 'CPT-002', type: 'Client' },
  { id: 3, nom: 'Agriplus', telephone: '+216 55 678 912', numero: 'CPT-003', type: 'Fournisseur' },
  { id: 4, nom: 'Mohamed Ben Salem', telephone: '+216 22 345 678', numero: 'CPT-004', type: 'Client' },
  { id: 5, nom: 'Med Oil', telephone: '+216 71 987 654', numero: 'CPT-005', type: 'Client' },
  { id: 6, nom: 'Coopérative Mahdia', telephone: '+216 29 111 222', numero: 'CPT-006', type: 'Fournisseur' },
  { id: 7, nom: 'Karim Trabelsi', telephone: '+216 50 333 444', numero: 'CPT-007', type: 'Client' },
  { id: 8, nom: 'Export Olive SARL', telephone: '+216 28 765 432', numero: 'CPT-008', type: 'Fournisseur' },
];

const BONS_INITIAUX: BonReception[] = [
  {
    id: 1, reference: 'BR-001', compteId: 1, date: '2024-10-12',
    typeHuile: "Huile d'olive", quantiteOlives: 1250, quantiteHuile: 250,
    montant: 1500, montantPaye: 1200, resteAPayer: 300, statut: 'Traité',
  },
  {
    id: 2, reference: 'BR-002', compteId: 2, date: '2024-10-15',
    typeHuile: 'Huile vierge extra', quantiteOlives: 980, quantiteHuile: 210,
    montant: 1230, montantPaye: 800, resteAPayer: 430, statut: 'En cours',
  },
  {
    id: 3, reference: 'BR-003', compteId: 3, date: '2024-10-18',
    typeHuile: "Huile d'olive", quantiteOlives: 1500, quantiteHuile: 310,
    montant: 1860, montantPaye: 1000, resteAPayer: 860, statut: 'En attente',
  },
  {
    id: 4, reference: 'BR-004', compteId: 4, date: '2024-10-20',
    typeHuile: 'Huile vierge', quantiteOlives: 850, quantiteHuile: 170,
    montant: 1020, montantPaye: 1020, resteAPayer: 0, statut: 'Traité',
  },
  {
    id: 5, reference: 'BR-005', compteId: 6, date: '2024-10-22',
    typeHuile: "Huile d'olive", quantiteOlives: 1100, quantiteHuile: 225,
    montant: 1350, montantPaye: 700, resteAPayer: 650, statut: 'En cours',
  },
];

const inputClass =
  'w-full rounded-lg border border-[#e0e5dc] bg-white px-3 py-2.5 text-xs text-[#344054] outline-none transition placeholder:text-[#98a2b3] hover:border-[#cbd5c0] focus:border-[#71843d] focus:ring-2 focus:ring-[#71843d]/10';

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe5da] bg-white px-3 py-2 text-xs font-semibold text-[#34452a] transition hover:bg-[#f4f7ef] disabled:cursor-not-allowed disabled:opacity-40';

function formatNumber(value: number) {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR');
}

function formatMoney(value: number) {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function StatusBadge({ status }: { status: BonReception['statut'] }) {
  const styles: Record<BonReception['statut'], string> = {
    Traité: 'bg-[#dff1df] text-[#28723a]',
    'En cours': 'bg-[#dcecff] text-[#1764bd]',
    'En attente': 'bg-[#fff0cc] text-[#a86b08]',
  };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function SectionTitle({
  icon, title, description,
}: { icon: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e3ead9] bg-[#edf3e5] text-[#556b2f]">
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-[#172b3d]">{title}</h2>
        {description && <p className="mt-1 text-xs leading-5 text-[#778397]">{description}</p>}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-[11px] font-semibold text-[#344054]">{children}</label>;
}

function InfoCompte({
  icon, label, value, last = false,
}: { icon: ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${!last ? 'xl:border-r xl:border-[#dce4d5] xl:pr-3' : ''}`}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf2e6] text-[#556b2f]">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] text-[#7b8795]">{label}</p>
        <p className="mt-1 truncate text-xs font-semibold text-[#344054]">{value}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e8ede3] bg-[#fbfcfa] p-3">
      <p className="text-[10px] font-medium text-[#7b8795]">{label}</p>
      <p className="mt-1.5 break-words text-sm font-semibold text-[#344054]">{value}</p>
    </div>
  );
}

function Indicateur({
  title, value, subtitle, icon, tone,
}: {
  title: string; value: string; subtitle: string; icon: ReactNode;
  tone: 'olive' | 'blue' | 'purple' | 'green' | 'amber';
}) {
  const tones = {
    olive: 'bg-[#edf3e5] text-[#586f32]',
    blue: 'bg-[#e8efff] text-[#3869b4]',
    purple: 'bg-[#f1eaff] text-[#7651b5]',
    green: 'bg-[#e3f5e9] text-[#27804b]',
    amber: 'bg-[#fff0d9] text-[#a66a0a]',
  };
  return (
    <div className="rounded-xl border border-[#e5e9df] bg-white p-4 shadow-[0_2px_8px_rgba(28,43,20,0.025)]">
      <div className="flex items-center gap-3">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#687586]">{title}</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-[#172b3d]">{value}</p>
          <p className="mt-1 text-[10px] text-[#8a94a3]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function TraitementBasesPage() {
  const [bons] = useState<BonReception[]>(BONS_INITIAUX);
  const [typeHuile, setTypeHuile] = useState('');
  const [comptesSelectionnes, setComptesSelectionnes] = useState<number[]>([]);
  const [dropdownComptesOuvert, setDropdownComptesOuvert] = useState(false);
  const [rechercheCompte, setRechercheCompte] = useState('');
  const [rechercheLancee, setRechercheLancee] = useState(false);
  const [messageErreur, setMessageErreur] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(5);
  const [selection, setSelection] = useState<number[]>([]);
  const [rechercheTableau, setRechercheTableau] = useState('');
  const [detailsBon, setDetailsBon] = useState<BonReception | null>(null);

  const comptesFiltres = useMemo(() => {
    const q = rechercheCompte.trim().toLowerCase();
    return COMPTES.filter(c =>
      !q || [c.nom, c.telephone, c.numero, c.type].some(v => v.toLowerCase().includes(q))
    );
  }, [rechercheCompte]);

  const bonsFiltres = useMemo(() => {
    if (!rechercheLancee || !typeHuile || comptesSelectionnes.length === 0) return [];
    const q = rechercheTableau.trim().toLowerCase();
    return bons.filter(bon => {
      const compte = COMPTES.find(c => c.id === bon.compteId);
      const texte = [
        bon.reference, bon.typeHuile, bon.statut, bon.date,
        compte?.nom ?? '', compte?.numero ?? '', compte?.telephone ?? '',
      ].join(' ').toLowerCase();
      return bon.typeHuile === typeHuile &&
        comptesSelectionnes.includes(bon.compteId) &&
        (!q || texte.includes(q));
    });
  }, [bons, rechercheLancee, typeHuile, comptesSelectionnes, rechercheTableau]);

  const indicateurs = useMemo(() => bonsFiltres.reduce((acc, bon) => ({
    quantiteOlives: acc.quantiteOlives + bon.quantiteOlives,
    quantiteHuile: acc.quantiteHuile + bon.quantiteHuile,
    montantTotal: acc.montantTotal + bon.montant,
    montantPaye: acc.montantPaye + bon.montantPaye,
    resteAPayer: acc.resteAPayer + bon.resteAPayer,
  }), {
    quantiteOlives: 0, quantiteHuile: 0, montantTotal: 0, montantPaye: 0, resteAPayer: 0,
  }), [bonsFiltres]);

  const nombrePages = Math.max(1, Math.ceil(bonsFiltres.length / taillePage));
  const bonsAffiches = bonsFiltres.slice((page - 1) * taillePage, page * taillePage);
  const toutSelectionne = bonsAffiches.length > 0 && bonsAffiches.every(b => selection.includes(b.id));
  const comptesChoisis = COMPTES.filter(c => comptesSelectionnes.includes(c.id));

  function modifierFiltre(callback: () => void) {
    callback();
    setRechercheLancee(false);
    setMessageErreur('');
    setPage(1);
    setSelection([]);
  }

  function basculerCompte(id: number) {
    setComptesSelectionnes(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
    setRechercheLancee(false);
    setMessageErreur('');
    setPage(1);
    setSelection([]);
  }

  function basculerTousComptesFiltres() {
    const ids = comptesFiltres.map(c => c.id);
    const tousCoches = ids.length > 0 && ids.every(id => comptesSelectionnes.includes(id));
    setComptesSelectionnes(old => tousCoches
      ? old.filter(id => !ids.includes(id))
      : [...new Set([...old, ...ids])]
    );
    setRechercheLancee(false);
    setMessageErreur('');
    setPage(1);
    setSelection([]);
  }

  function appliquerRecherche() {
    if (!typeHuile) {
      setRechercheLancee(false);
      setMessageErreur('Veuillez sélectionner un type d’huile.');
      return;
    }
    if (comptesSelectionnes.length === 0) {
      setRechercheLancee(false);
      setMessageErreur('Veuillez sélectionner au moins un compte.');
      return;
    }
    setMessageErreur('');
    setRechercheLancee(true);
    setPage(1);
    setSelection([]);
    setDropdownComptesOuvert(false);
  }

  function reinitialiser() {
    setTypeHuile('');
    setComptesSelectionnes([]);
    setRechercheCompte('');
    setRechercheTableau('');
    setRechercheLancee(false);
    setMessageErreur('');
    setDropdownComptesOuvert(false);
    setPage(1);
    setSelection([]);
    setTaillePage(5);
  }

  function exporterCSV() {
    if (!bonsFiltres.length) return;
    const entetes = [
      'Référence', 'Nom du compte', 'Téléphone', 'Numéro de compte',
      'Date de réception', "Type d'huile", "Quantité d'olives (kg)",
      "Quantité d'huile (kg)", 'Montant (DT)', 'Montant payé (DT)',
      'Reste à payer (DT)', 'Statut',
    ];
    const lignes = bonsFiltres.map(bon => {
      const compte = COMPTES.find(c => c.id === bon.compteId);
      return [
        bon.reference, compte?.nom ?? '', compte?.telephone ?? '', compte?.numero ?? '',
        formatDate(bon.date), bon.typeHuile, bon.quantiteOlives, bon.quantiteHuile,
        bon.montant.toFixed(2), bon.montantPaye.toFixed(2),
        bon.resteAPayer.toFixed(2), bon.statut,
      ];
    });
    const contenu = [entetes, ...lignes].map(ligne =>
      ligne.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')
    ).join('\r\n');
    const blob = new Blob(['\uFEFF' + contenu], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = 'bons-reception-traitement.csv';
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    URL.revokeObjectURL(url);
  }

  function basculerSelection(id: number) {
    setSelection(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }

  function basculerToutesLesSelections() {
    const idsPage = bonsAffiches.map(b => b.id);
    setSelection(old => toutSelectionne
      ? old.filter(id => !idsPage.includes(id))
      : [...new Set([...old, ...idsPage])]
    );
  }

  function actualiser() {
    setPage(1);
    setSelection([]);
    if (rechercheLancee) setRechercheLancee(true);
  }

  return (
    <div className="min-h-full  p-3 text-[#243247] sm:p-5 lg:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <header className="relative overflow-hidden rounded-xl border border-[#e4e9dd] bg-gradient-to-r from-white via-[#fbfcf8] to-[#eff4e6] px-5 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="pointer-events-none absolute -right-5 -top-10 size-40 rounded-full border border-[#e3ead8]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#839a4b] to-[#536b2d] text-white shadow-md">
                <Building2 size={25} strokeWidth={1.8} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#142e43] sm:text-2xl">Traitement de base</h1>
                <p className="mt-1 text-xs leading-5 text-[#687b90] sm:text-sm">
                  Sélectionnez un type d’huile et un ou plusieurs comptes pour consulter les bons de réception.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce6d1] bg-white/80 px-3 py-1.5 text-[10px] font-medium text-[#33452a]">
              <span className="size-1.5 rounded-full bg-[#63823d]" /> Gestion de production
            </span>
          </div>
        </header>

        <section className="overflow-visible rounded-2xl border border-[#e5e9df] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#edf0e8] bg-gradient-to-r from-[#f8faf5] to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle icon={<Filter size={19} />} title="Critères de recherche" description="Filtrez les bons par type d’huile et par plusieurs comptes." />
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e3e9d9] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#586f32]">
              <span className="size-1.5 rounded-full bg-[#718b48]" /> Recherche par critères
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.6fr_auto]">
              <div className="min-w-0">
                <FieldLabel>Type d’huile <span className="text-red-500">*</span></FieldLabel>
                <div className="relative">
                  <Leaf size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#647b40]" />
                  <select value={typeHuile} onChange={e => modifierFiltre(() => setTypeHuile(e.target.value))}
                    className="h-12 w-full appearance-none rounded-xl border border-[#dfe5d8] bg-[#fcfdfb] pl-10 pr-10 text-sm font-medium text-[#34412b] outline-none hover:border-[#b9c7a8] focus:border-[#718746] focus:ring-4 focus:ring-[#586f32]/10">
                    <option value="">Sélectionner un type</option>
                    {TYPES_HUILE.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8572]" />
                </div>
              </div>

              <div className="relative min-w-0">
                <FieldLabel>Comptes <span className="text-red-500">*</span></FieldLabel>
                <button type="button" onClick={() => setDropdownComptesOuvert(v => !v)}
                  className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#dfe5d8] bg-[#fcfdfb] px-3.5 text-left text-sm text-[#34412b] hover:border-[#b9c7a8] focus:outline-none focus:ring-4 focus:ring-[#586f32]/10">
                  <span className="min-w-0 truncate">
                    {comptesSelectionnes.length === 0 ? 'Sélectionner des comptes' : `${comptesSelectionnes.length} compte(s) sélectionné(s)`}
                  </span>
                  <ChevronDown size={16} className={`shrink-0 transition ${dropdownComptesOuvert ? 'rotate-180' : ''}`} />
                </button>
                {comptesSelectionnes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {comptesChoisis.slice(0, 3).map(c => (
                      <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-[#edf3e5] px-2 py-1 text-[10px] font-medium text-[#526b2c]">
                        {c.numero}
                        <button type="button" aria-label={`Retirer ${c.numero}`} onClick={() => basculerCompte(c.id)}><X size={11} /></button>
                      </span>
                    ))}
                    {comptesChoisis.length > 3 && <span className="rounded-full bg-[#f1f3ee] px-2 py-1 text-[10px] text-[#667085]">+{comptesChoisis.length - 3}</span>}
                  </div>
                )}
                {dropdownComptesOuvert && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[min(680px,90vw)] overflow-hidden rounded-xl border border-[#dfe5d8] bg-white shadow-xl">
                    <div className="border-b border-[#edf0e9] p-3">
                      <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87917c]" />
                        <input value={rechercheCompte} onChange={e => setRechercheCompte(e.target.value)} placeholder="Rechercher par nom, numéro, téléphone ou type..."
                          className={`${inputClass} pl-9`} />
                      </div>
                      <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#344054]">
                        <input type="checkbox" checked={comptesFiltres.length > 0 && comptesFiltres.every(c => comptesSelectionnes.includes(c.id))}
                          onChange={basculerTousComptesFiltres} className="size-4 accent-[#586f32]" />
                        Sélectionner tous les comptes affichés
                      </label>
                    </div>
                    <div className="max-h-64 overflow-auto">
                      <table className="w-full min-w-[590px] text-left text-xs">
                        <thead className="sticky top-0 z-10 bg-[#f5f7f2] text-[#475467]">
                          <tr>
                            <th className="w-10 px-3 py-3"></th>
                            <th className="px-3 py-3">Numéro</th>
                            <th className="px-3 py-3">Nom du compte</th>
                            <th className="px-3 py-3">Téléphone</th>
                            <th className="px-3 py-3">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#edf0e9]">
                          {comptesFiltres.map(compte => {
                            const checked = comptesSelectionnes.includes(compte.id);
                            return (
                              <tr key={compte.id} onClick={() => basculerCompte(compte.id)}
                                className={`cursor-pointer transition hover:bg-[#f3f6ed] ${checked ? 'bg-[#edf3e5]' : 'bg-white'}`}>
                                <td className="px-3 py-3"><input type="checkbox" checked={checked} readOnly className="size-4 accent-[#586f32]" /></td>
                                <td className="whitespace-nowrap px-3 py-3 font-semibold">{compte.numero}</td>
                                <td className="whitespace-nowrap px-3 py-3">{compte.nom}</td>
                                <td className="whitespace-nowrap px-3 py-3">{compte.telephone}</td>
                                <td className="whitespace-nowrap px-3 py-3">{compte.type}</td>
                              </tr>
                            );
                          })}
                          {comptesFiltres.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-500">Aucun compte trouvé.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#edf0e9] p-3">
                      <span className="text-xs text-[#667085]">{comptesSelectionnes.length} compte(s) sélectionné(s)</span>
                      <button type="button" onClick={() => setDropdownComptesOuvert(false)} className="rounded-lg bg-[#586f32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#465a27]">Terminé</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 md:col-span-2 xl:col-span-1">
                <button type="button" onClick={appliquerRecherche} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#586f32] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465a27]">
                  <Search size={17} /> Rechercher
                </button>
                <button type="button" onClick={reinitialiser} title="Réinitialiser les critères" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dfe5d8] bg-white px-3.5 text-sm font-semibold text-[#53604a] hover:bg-[#f7f9f3]">
                  <RotateCcw size={16} /><span className="hidden 2xl:inline">Réinitialiser</span>
                </button>
              </div>
            </div>
            {messageErreur && <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><X size={17} className="mt-0.5 shrink-0" /><p className="font-medium">{messageErreur}</p></div>}
          </div>
        </section>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <SectionTitle icon={<CircleDollarSign size={19} />} title="Indicateurs de réception" description={rechercheLancee ? 'Totaux calculés sur les résultats filtrés.' : 'Lancez une recherche pour calculer les totaux.'} />
            {rechercheLancee && <span className="rounded-full border border-[#dce6d1] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#586f32]">{bonsFiltres.length} bon(s)</span>}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Indicateur title="Quantité d’olives" value={`${formatNumber(indicateurs.quantiteOlives)} kg`} subtitle="Total des olives réceptionnées" icon={<Leaf size={20} />} tone="olive" />
            <Indicateur title="Quantité d’huile" value={`${formatNumber(indicateurs.quantiteHuile)} kg`} subtitle="Total d’huile produite" icon={<Droplets size={20} />} tone="blue" />
            <Indicateur title="Montant total" value={`${formatMoney(indicateurs.montantTotal)} DT`} subtitle="Valeur totale des bons" icon={<WalletCards size={20} />} tone="purple" />
            <Indicateur title="Montant payé" value={`${formatMoney(indicateurs.montantPaye)} DT`} subtitle="Somme déjà réglée" icon={<Check size={20} />} tone="green" />
            <Indicateur title="Reste à payer" value={`${formatMoney(indicateurs.resteAPayer)} DT`} subtitle="Solde restant à régler" icon={<HandCoins size={20} />} tone="amber" />
          </div>
        </section>

        <section className="rounded-xl border border-[#e6eae3] bg-white p-3 shadow-sm sm:p-4">
          <div className="rounded-lg border border-[#edf1e7] bg-gradient-to-r from-[#f3f7ed] to-[#f8faf5] p-3.5 sm:p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#e0ebd1] text-[#526b2c]"><UserRound size={21} /></div>
              <div>
                <h2 className="text-sm font-bold text-[#172b3d]">Comptes sélectionnés</h2>
                <p className="mt-1 text-xs text-[#7b8795]">{comptesChoisis.length ? 'Informations des comptes retenus pour la recherche.' : 'Sélectionnez un ou plusieurs comptes.'}</p>
              </div>
            </div>
            {comptesChoisis.length === 0 ? <p className="text-xs text-[#7b8795]">Aucun compte sélectionné.</p> : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {comptesChoisis.map(compte => (
                  <div key={compte.id} className="rounded-lg border border-[#dce4d5] bg-white p-3">
                    <p className="text-xs font-bold text-[#344054]">{compte.nom}</p>
                    <p className="mt-1 text-[11px] text-[#667085]">{compte.numero} · {compte.type}</p>
                    <p className="mt-1 text-[11px] text-[#667085]">{compte.telephone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#e6eae3] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <SectionTitle icon={<ClipboardList size={19} />} title="Bons de réception" description={!rechercheLancee ? 'Choisissez un type d’huile et des comptes, puis lancez la recherche.' : `Résultats : ${bonsFiltres.length} bon(s) de réception.`} />
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={exporterCSV} disabled={!bonsFiltres.length} className={buttonClass}><Download size={14} />Exporter CSV</button>
              <button type="button" onClick={actualiser} className={buttonClass}><RefreshCw size={14} />Actualiser</button>
              <button type="button" onClick={() => { setRechercheTableau(''); setTaillePage(5); setPage(1); setSelection([]); }} aria-label="Réinitialiser le tableau" title="Réinitialiser le tableau" className="flex size-9 items-center justify-center rounded-lg border border-[#dfe5da] bg-white text-[#556b2f] hover:bg-[#f4f7ef]"><SlidersHorizontal size={15} /></button>
            </div>
          </div>
          {!rechercheLancee ? (
            <div className="border-t border-[#edf0e9] px-4 py-14 text-center sm:px-5">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#687d43]"><Filter size={22} /></div>
                <p className="text-sm font-semibold text-[#344054]">Aucun bon affiché</p>
                <p className="mt-1 text-xs leading-5 text-[#7b8795]">Sélectionnez un type d’huile et un ou plusieurs comptes, puis cliquez sur « Rechercher ».</p>
              </div>
            </div>
          ) : (
            <>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#e7ebe3] bg-[#f5f7f2] text-[#475467]">
                      {['Référence', 'Compte', 'Olives (kg)', 'Huile (kg)', 'Prix/kg (DT)', 'Prix total (DT)'].map(t => (
                        <th key={t} className="whitespace-nowrap px-4 py-3 font-semibold">
                          <span className="inline-flex items-center gap-1.5">{t}<ChevronsUpDown size={11} className="text-[#a0a9b5]" /></span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf0e9]">
                    {bonsAffiches.map(bon => {
                      const compte = COMPTES.find(c => c.id === bon.compteId);
                      const prixKg = bon.quantiteHuile > 0 ? bon.montant / bon.quantiteHuile : null;
                      return (
                        <tr key={bon.id} className="bg-white transition hover:bg-[#f7f9f4]">
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#344054]">{bon.reference}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-[#526174]">{compte?.nom ?? '—'}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-[#526174]">{formatNumber(bon.quantiteOlives)}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-[#526174]">{formatNumber(bon.quantiteHuile)}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-[#526174]">{prixKg === null ? '—' : formatMoney(prixKg)}</td>
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#344054]">{formatMoney(bon.montant)}</td>
                        </tr>
                      );
                    })}
                    {bonsAffiches.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-14 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#f0f4e9] text-[#687d43]"><FileText size={21} /></div>
                          <p className="text-sm font-semibold text-[#344054]">Aucun bon de réception trouvé</p>
                          <p className="mt-1 text-xs leading-5 text-[#7b8795]">Aucun bon ne correspond à ces critères.</p>
                        </div>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0e9] px-4 py-3.5 sm:px-5">
                
<p className="flex items-center gap-1.5 text-xs font-medium text-[#667085]">
  {bonsFiltres.length === 0 ? (
    <span className="italic text-[#98a2b3]">
      Aucun bon de réception
    </span>
  ) : (
    <>
      <span>Affichage</span>
      <span className="font-semibold text-[#344054]">
        {(page - 1) * taillePage + 1}
      </span>
      <span>à</span>
      <span className="font-semibold text-[#344054]">
        {Math.min(page * taillePage, bonsFiltres.length)}
      </span>
      <span>sur</span>
      <span className="inline-flex items-center rounded-md bg-[#edf3e5] px-2 py-1 text-[11px] font-bold text-[#556b2f]">
        {bonsFiltres.length}
      </span>
      <span>bons de réception</span>
    </>
  )}
</p>

                <div className="flex items-center gap-1.5">
                  <button type="button" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} aria-label="Page précédente" className="flex size-8 items-center justify-center rounded-lg border border-[#e0e5dc] bg-white text-[#667085] hover:bg-[#f4f7ef] disabled:opacity-40"><ChevronLeft size={15} /></button>
                  {Array.from({ length: nombrePages }, (_, i) => i + 1).filter(n => n === 1 || n === nombrePages || Math.abs(n - page) <= 1).map((n, i, arr) => (
                    <span key={n} className="contents">
                      {i > 0 && n - arr[i - 1] > 1 && <span className="px-1 text-xs text-[#98a2b3]">…</span>}
                      <button type="button" onClick={() => setPage(n)} aria-current={page === n ? 'page' : undefined} className={`flex size-8 items-center justify-center rounded-lg border text-xs font-semibold ${page === n ? 'border-[#586f32] bg-[#586f32] text-white' : 'border-[#e0e5dc] bg-white text-[#526174] hover:bg-[#f4f7ef]'}`}>{n}</button>
                    </span>
                  ))}
                  <button type="button" disabled={page === nombrePages} onClick={() => setPage(p => Math.min(nombrePages, p + 1))} aria-label="Page suivante" className="flex size-8 items-center justify-center rounded-lg border border-[#e0e5dc] bg-white text-[#667085] hover:bg-[#f4f7ef] disabled:opacity-40"><ChevronRight size={15} /></button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {detailsBon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#172b3d]/40 p-4 backdrop-blur-[2px]" onClick={() => setDetailsBon(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="detail-bon-title" className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#e2e8dc] bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 border-b border-[#edf0e9] bg-gradient-to-r from-[#f3f7ed] to-white px-5 py-4">
              <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71843d]">Détail du bon de réception</p><h2 id="detail-bon-title" className="mt-1 text-lg font-bold text-[#172b3d]">{detailsBon.reference}</h2></div>
              <button type="button" onClick={() => setDetailsBon(null)} aria-label="Fermer les détails" className="rounded-lg p-2 text-[#667085] hover:bg-[#edf1e7]"><X size={17} /></button>
            </div>
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              <DetailItem label="Compte" value={COMPTES.find(c => c.id === detailsBon.compteId)?.nom ?? '—'} />
              <DetailItem label="Numéro de compte" value={COMPTES.find(c => c.id === detailsBon.compteId)?.numero ?? '—'} />
              <DetailItem label="Téléphone" value={COMPTES.find(c => c.id === detailsBon.compteId)?.telephone ?? '—'} />
              <DetailItem label="Date de réception" value={formatDate(detailsBon.date)} />
              <DetailItem label="Type d’huile" value={detailsBon.typeHuile} />
              <DetailItem label="Statut" value={detailsBon.statut} />
              <DetailItem label="Quantité d’olives" value={`${formatNumber(detailsBon.quantiteOlives)} kg`} />
              <DetailItem label="Quantité d’huile" value={`${formatNumber(detailsBon.quantiteHuile)} kg`} />
              <DetailItem label="Montant total" value={`${formatMoney(detailsBon.montant)} DT`} />
              <DetailItem label="Montant payé" value={`${formatMoney(detailsBon.montantPaye)} DT`} />
              <DetailItem label="Reste à payer" value={`${formatMoney(detailsBon.resteAPayer)} DT`} />
            </div>
            <div className="flex justify-end border-t border-[#edf0e9] px-5 py-4"><button type="button" onClick={() => setDetailsBon(null)} className="rounded-lg bg-[#586f32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#465a27]">Fermer</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
