
import { useMemo, useState, type ReactNode } from "react";

import {
  Download,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* ============================================================
   TYPES
============================================================ */

export interface Compte {
  compteId: number;
  name: string;
  adresse: string;
  mobile: string;
  mail: string;
  statusId: number;
  priceConv: number;
  isBaseCompte: boolean;
  baseCompteId: number | null;
}

interface CompteTableProps {
  comptes?: Compte[];
  onEdit?: (compte: Compte) => void;
  onDelete?: (compte: Compte) => void;
}

type FilterOption = {
  label: string;
  count: number;
  dot?: string;
  icon?: ReactNode;
  activeClass?: string;
  badgeClass?: string;
};

/* ============================================================
   1. COMPOSANT GÉNÉRIQUE : FILTER TABS
============================================================ */

interface FilterTabsProps<T extends string> {
  filters: FilterOption[];
  value: T;
  onChange: (value: T) => void;
}

export function FilterTabs<T extends string>({
  filters,
  value,
  onChange,
}: FilterTabsProps<T>) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
      {filters.map((filter) => {
        const selected = value === filter.label;

        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => onChange(filter.label as T)}
            aria-pressed={selected}
            className={`flex h-10 items-center gap-2 rounded-lg border px-3 transition ${
              selected
                ? filter.activeClass ??
                  "border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]"
                : "border-[#e5e7eb] bg-white text-[#334155] hover:border-[#c9d9b6]"
            }`}
          >
            {filter.icon ? (
              filter.icon
            ) : (
              <span
                className={`size-2 rounded-full ${
                  filter.dot ?? "bg-[#94a3b8]"
                }`}
              />
            )}

            <span className="whitespace-nowrap text-xs font-semibold">
              {filter.label}
            </span>

            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                filter.badgeClass ??
                "bg-[#e9eef3] text-[#334155]"
              }`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   2. COMPOSANT GÉNÉRIQUE : STATUS BADGE
============================================================ */

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  active,
  activeLabel = "Actif",
  inactiveLabel = "Inactif",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${
        active
          ? "bg-[#e3f5e9] text-[#16833b]"
          : "bg-[#fdebed] text-[#dc2635]"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          active ? "bg-[#16a34a]" : "bg-[#ef3340]"
        }`}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

/* ============================================================
   3. COMPOSANT GÉNÉRIQUE : INFO ROW
============================================================ */

interface InfoRowProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  title?: string;
  breakAll?: boolean;
}

export function InfoRow({
  icon,
  label,
  value,
  title,
  breakAll = false,
}: InfoRowProps) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      {icon && (
        <span className="mt-0.5 shrink-0 text-[#94a3b8]">
          {icon}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <span className="mb-0.5 block text-[10px] font-medium text-[#94a3b8]">
          {label}
        </span>

        <span
          title={title}
          className={`block min-w-0 text-xs leading-5 text-[#64748b] ${
            breakAll ? "break-all" : "break-words"
          }`}
        >
          {value || "Non renseigné"}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   4. COMPOSANT GÉNÉRIQUE : ICON ACTION BUTTON
============================================================ */

interface IconActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "edit" | "delete";
}

export function IconActionButton({
  icon,
  label,
  onClick,
  variant = "edit",
}: IconActionButtonProps) {
  const styles =
    variant === "delete"
      ? "bg-[#fdebed] text-[#ef3340] hover:bg-[#fbdadd] hover:text-[#d92735]"
      : "bg-[#eef4e6] text-[#556B2F] hover:bg-[#dfead2] hover:text-[#3f5124]";

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-lg transition ${styles}`}
    >
      {icon}
    </button>
  );
}

/* ============================================================
   5. COMPOSANT GÉNÉRIQUE : EMPTY STATE
============================================================ */

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4e9] bg-white px-4 text-center">
      {icon && (
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#eef4e6]">
          {icon}
        </div>
      )}

      <h3 className="text-sm font-semibold text-[#172033]">
        {title}
      </h3>

      <p className="mt-1 text-xs text-[#94a3b8]">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 text-xs font-semibold text-[#556B2F] hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ============================================================
   DONNÉES PAR DÉFAUT
============================================================ */

const defaultComptes: Compte[] = [
  {
    compteId: 1,
    name: "Ahmed Ben Ali",
    adresse: "Sousse",
    mobile: "12345678",
    mail: "ahmed@gmail.com",
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 2,
    name: "Client 1",
    adresse: "Monastir",
    mobile: "98765432",
    mail: "client1@gmail.com",
    statusId: 1,
    priceConv: 1.25,
    isBaseCompte: false,
    baseCompteId: 1,
  },
  {
    compteId: 3,
    name: "Fournisseur 1",
    adresse: "Sfax",
    mobile: "55667788",
    mail: "fournisseur@gmail.com",
    statusId: 2,
    priceConv: 0.8,
    isBaseCompte: false,
    baseCompteId: 1,
  },
  {
    compteId: 4,
    name: "Coopérative",
    adresse: "Mahdia",
    mobile: "22334455",
    mail: "coop@gmail.com",
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 5,
    name: "Client 2",
    adresse: "Tunis",
    mobile: "22113344",
    mail: "client2@gmail.com",
    statusId: 1,
    priceConv: 1.1,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 6,
    name: "Fournisseur 2",
    adresse: "Gabès",
    mobile: "55664433",
    mail: "fournisseur2@gmail.com",
    statusId: 1,
    priceConv: 0.9,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 7,
    name: "Client 3",
    adresse: "Nabeul",
    mobile: "99887766",
    mail: "client3@gmail.com",
    statusId: 2,
    priceConv: 1.15,
    isBaseCompte: false,
    baseCompteId: 4,
  },
  {
    compteId: 8,
    name: "Coopérative 2",
    adresse: "Kairouan",
    mobile: "44556677",
    mail: "coop2@gmail.com",
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
  {
    compteId: 9,
    name: "Client 4",
    adresse: "Bizerte",
    mobile: "77889900",
    mail: "client4@gmail.com",
    statusId: 1,
    priceConv: 0.95,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 10,
    name: "Fournisseur 3",
    adresse: "Béja",
    mobile: "11223344",
    mail: "fournisseur3@gmail.com",
    statusId: 2,
    priceConv: 0.75,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 11,
    name: "Client 5",
    adresse: "Zaghouan",
    mobile: "33445566",
    mail: "client5@gmail.com",
    statusId: 1,
    priceConv: 1.2,
    isBaseCompte: false,
    baseCompteId: 8,
  },
  {
    compteId: 12,
    name: "Coopérative 3",
    adresse: "Le Kef",
    mobile: "66778899",
    mail: "coop3@gmail.com",
    statusId: 1,
    priceConv: 0,
    isBaseCompte: true,
    baseCompteId: null,
  },
];

/* ============================================================
   6. COMPOSANT SPÉCIFIQUE : COMPTE CARD
============================================================ */

const avatarColors = [
  "bg-[#e8efdf] text-[#556B2F]",
  "bg-[#e5efff] text-[#3767a5]",
  "bg-[#fce8e8] text-[#b54747]",
  "bg-[#f3e8ff] text-[#8050a5]",
  "bg-[#e1f4ef] text-[#287b67]",
];

interface CompteCardProps {
  compte: Compte;
  index: number;
  onEdit?: (compte: Compte) => void;
  onDelete?: (compte: Compte) => void;
}

export function CompteCard({
  compte,
  index,
  onEdit,
  onDelete,
}: CompteCardProps) {
  const initials = compte.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const isActive = compte.statusId === 1;

  const formattedPrice = Number(compte.priceConv).toLocaleString(
    "fr-FR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-[#e2eaf0] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9d9b6] hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)]">

      {/* EN-TÊTE */}
      <div className="flex items-start justify-between gap-3 border-b border-[#edf0f2] px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              avatarColors[index % avatarColors.length]
            }`}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <h3
              className="truncate text-sm font-bold text-[#172033]"
              title={compte.name}
            >
              {compte.name}
            </h3>

            <p className="mt-1 text-[11px] text-[#94a3b8]">
              Compte #{compte.compteId}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold text-[#64748b]">
          C{String(compte.compteId).padStart(3, "0")}
        </span>
      </div>

      {/* INFORMATIONS */}
      <div className="space-y-3 px-3.5 py-3.5">

        <InfoRow
          icon={<MapPin className="size-3.5" />}
          label="Adresse"
          value={compte.adresse || "Adresse non renseignée"}
          title={compte.adresse}
        />

        <InfoRow
          icon={<Phone className="size-3.5" />}
          label="Téléphone"
          value={compte.mobile || "Téléphone non renseigné"}
        />

        <InfoRow
          icon={<Mail className="size-3.5" />}
          label="Email"
          value={compte.mail || "Aucun email"}
          title={compte.mail}
          breakAll
        />

        {/* STATUT */}
        <div className="flex items-center justify-between gap-2 border-t border-[#f0f2f4] pt-3">
          <span className="text-[11px] font-medium text-[#94a3b8]">
            Statut du compte
          </span>

          <StatusBadge active={isActive} />
        </div>

        {/* PRIX */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#94a3b8]">
            Prix conversion
          </span>

          <span className="text-xs font-semibold text-[#334155]">
            {formattedPrice} DT
          </span>
        </div>

        {/* COMPTE DE BASE */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#94a3b8]">
            Compte de base
          </span>

          {compte.isBaseCompte ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#eef4e6] px-2 py-1 text-[10px] font-semibold text-[#556B2F]">
              <ShieldCheck className="size-3" />
              Oui
            </span>
          ) : (
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold text-[#64748b]">
              Non
              {compte.baseCompteId != null &&
                ` · ID ${compte.baseCompteId}`}
            </span>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between gap-2 border-t border-[#edf0f2] bg-[#fafcfb] px-3.5 py-2.5">
        <span className="truncate text-[10px] text-[#94a3b8]">
          {compte.isBaseCompte
            ? "Compte principal"
            : `Compte rattaché · ${compte.baseCompteId ?? "—"}`}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <IconActionButton
            icon={<Pencil className="size-4" />}
            label={`Modifier ${compte.name}`}
            onClick={() => onEdit?.(compte)}
            variant="edit"
          />

          <IconActionButton
            icon={<Trash2 className="size-4" />}
            label={`Supprimer ${compte.name}`}
            onClick={() => onDelete?.(compte)}
            variant="delete"
          />
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   7. COMPOSANT PRINCIPAL : COMPTE TABLE
============================================================ */

type CompteFilter = "Tous" | "Actifs" | "Inactifs" | "Avec email";

export function CompteTable({
  comptes = defaultComptes,
  onEdit,
  onDelete,
}: CompteTableProps) {
  const [statusFilter, setStatusFilter] =
    useState<CompteFilter>("Tous");

  /* STATISTIQUES */
  const totalComptes = comptes.length;

  const activeComptes = comptes.filter(
    (compte) => compte.statusId === 1
  ).length;

  const inactiveComptes = comptes.filter(
    (compte) => compte.statusId !== 1
  ).length;

  const comptesWithEmail = comptes.filter(
    (compte) => Boolean(compte.mail?.trim())
  ).length;

  /* FILTRES */
  const filteredComptes = useMemo(() => {
    switch (statusFilter) {
      case "Actifs":
        return comptes.filter(
          (compte) => compte.statusId === 1
        );

      case "Inactifs":
        return comptes.filter(
          (compte) => compte.statusId !== 1
        );

      case "Avec email":
        return comptes.filter(
          (compte) => Boolean(compte.mail?.trim())
        );

      default:
        return comptes;
    }
  }, [comptes, statusFilter]);

  /* OPTIONS DES FILTRES */
  const filters: FilterOption[] = [
    {
      label: "Tous",
      count: totalComptes,
      dot: "bg-[#94a3b8]",
      activeClass:
        "border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]",
      badgeClass: "bg-[#e9eef3] text-[#334155]",
    },
    {
      label: "Actifs",
      count: activeComptes,
      dot: "bg-[#16a34a]",
      activeClass:
        "border-[#b8e3c7] bg-[#f0faf3] text-[#16833b]",
      badgeClass: "bg-[#e3f5e9] text-[#16833b]",
    },
    {
      label: "Inactifs",
      count: inactiveComptes,
      dot: "bg-[#ef4444]",
      activeClass:
        "border-[#f5c9cd] bg-[#fff4f4] text-[#dc2635]",
      badgeClass: "bg-[#fdebed] text-[#dc2635]",
    },
    {
      label: "Avec email",
      count: comptesWithEmail,
      icon: <Mail className="size-3.5 text-[#556B2F]" />,
      activeClass:
        "border-[#c9d9b6] bg-[#f1f6eb] text-[#556B2F]",
      badgeClass: "bg-[#e9eef3] text-[#334155]",
    },
  ];

  /* EXPORT CSV */
  const handleExport = () => {
    const headers = [
      "Compte ID",
      "Nom",
      "Adresse",
      "Mobile",
      "Email",
      "Statut",
      "Prix conversion",
      "Compte de base",
      "Compte de base ID",
    ];

    const rows = filteredComptes.map((compte) => [
      compte.compteId,
      compte.name,
      compte.adresse,
      compte.mobile,
      compte.mail,
      compte.statusId === 1 ? "Actif" : "Inactif",
      compte.priceConv,
      compte.isBaseCompte ? "Oui" : "Non",
      compte.baseCompteId ?? "",
    ]);

    const escapeCsv = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCsv).join(";"),
      ...rows.map((row) => row.map(escapeCsv).join(";")),
    ].join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "comptes.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  /* RÉINITIALISATION */
  const handleReset = () => {
    setStatusFilter("Tous");
  };

  return (
    <div className="w-full min-w-0">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

        {/* FILTRES ET ACTIONS */}
        <div className="flex flex-col gap-4 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">

          <FilterTabs<CompteFilter>
            filters={filters}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-11 min-w-[150px] justify-center gap-2 rounded-lg border border-[#F3D2B3] bg-[#FFF7ED] px-5 text-sm font-semibold text-[#C2672B] transition hover:border-[#E9B98F] hover:bg-[#FFEDD8] hover:text-[#A94F1D]"
            >
              <RefreshCcw className="size-4" />
              Réinitialiser
            </Button>

            <Button
              type="button"
              onClick={handleExport}
              className="h-11 min-w-[140px] justify-center gap-2 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] transition hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
            >
              <Download className="size-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* GRILLE DES COMPTES */}
        <div className="bg-white p-4 sm:p-5">
          {filteredComptes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredComptes.map((compte, index) => (
                <CompteCard
                  key={compte.compteId}
                  compte={compte}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Wallet className="size-6 text-[#556B2F]" />}
              title="Aucun compte trouvé"
              description="Aucun compte ne correspond au filtre sélectionné."
              actionLabel="Afficher tous les comptes"
              onAction={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CompteTable;
