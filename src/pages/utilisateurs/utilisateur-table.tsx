
import { useMemo, useState } from "react";
import { Download, Mail, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/common/FilterTabs";
import { EntityCardGrid } from "@/components/common/EntityCardGrid";
import { exportToCsv } from "@/components/common/exportToCsv";


import { UtilisateurCard } from "@/components/utilisateurs/UtilisateurCard";
import { defaultUtilisateurs } from "@/components/utilisateurs/utilisateur.data";
import { StatusFilter, Utilisateur } from "@/components/utilisateurs/utilisateur.types";

interface UtilisateurTableProps {
  utilisateurs?: Utilisateur[];
  onEdit?: (utilisateur: Utilisateur) => void;
  onDelete?: (utilisateur: Utilisateur) => void;
}

export function UtilisateurTable({
  utilisateurs = defaultUtilisateurs,
  onEdit,
  onDelete,
}: UtilisateurTableProps) {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("Tous");

  /* ============================================================
     STATISTIQUES
  ============================================================ */

  const totalUsers = utilisateurs.length;

  const activeUsers = utilisateurs.filter(
    (user) => user.isActive,
  ).length;

  const inactiveUsers = utilisateurs.filter(
    (user) => !user.isActive,
  ).length;

  const usersWithEmail = utilisateurs.filter(
    (user) => user.mail.trim().length > 0,
  ).length;

  /* ============================================================
     OPTIONS DES FILTRES
  ============================================================ */

  const filterOptions = useMemo(
    () => [
      {
        value: "Tous" as const,
        label: "Tous",
        count: totalUsers,
        color: "default" as const,
      },
      {
        value: "Actifs" as const,
        label: "Actifs",
        count: activeUsers,
        color: "green" as const,
      },
      {
        value: "Inactifs" as const,
        label: "Inactifs",
        count: inactiveUsers,
        color: "red" as const,
      },
      {
        value: "Avec email" as const,
        label: "Avec email",
        count: usersWithEmail,
        color: "blue" as const,
      },
    ],
    [totalUsers, activeUsers, inactiveUsers, usersWithEmail],
  );

  /* ============================================================
     FILTRAGE
  ============================================================ */

  const filteredUtilisateurs = useMemo(() => {
    switch (statusFilter) {
      case "Actifs":
        return utilisateurs.filter((user) => user.isActive);

      case "Inactifs":
        return utilisateurs.filter((user) => !user.isActive);

      case "Avec email":
        return utilisateurs.filter(
          (user) => user.mail.trim().length > 0,
        );

      default:
        return utilisateurs;
    }
  }, [utilisateurs, statusFilter]);

  /* ============================================================
     RÉINITIALISER
  ============================================================ */

  const handleReset = () => {
    setStatusFilter("Tous");
  };

  /* ============================================================
     EXPORT CSV
  ============================================================ */

  const handleExport = () => {
    exportToCsv({
      filename: "utilisateurs.csv",
      data: filteredUtilisateurs,
      columns: [
        {
          label: "Nom d'affichage",
          value: (user) => user.displayName,
        },
        {
          label: "Nom utilisateur",
          value: (user) => user.userName,
        },
        {
          label: "Email",
          value: (user) => user.mail,
        },
        {
          label: "Code utilisateur",
          value: (user) => user.userCode,
        },
        {
          label: "Statut",
          value: (user) => user.isActive ? "Actif" : "Inactif",
        },
      ],
    });
  };

  /* ============================================================
     AFFICHAGE
  ============================================================ */

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f4f8fb] shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

        {/* FILTRES ET ACTIONS */}
        <div className="flex flex-col gap-4 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">

          <FilterTabs
            options={filterOptions}
            activeValue={statusFilter}
            onChange={setStatusFilter}
          />

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-10 min-w-[140px] gap-2 rounded-lg border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-700 transition-colors hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800"
            >
              <RefreshCcw className="size-4" />
              Réinitialiser
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              className="h-10 min-w-[130px] gap-2 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-5 text-sm font-semibold text-[#556B2F] shadow-sm transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0] hover:text-[#435B2B]"
            >
              <Download className="size-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* GRILLE DES UTILISATEURS */}
        <div className="bg-white p-4 sm:p-5">
          <EntityCardGrid
            items={filteredUtilisateurs}
            getKey={(user) => user.id}
            renderCard={(user) => (
              <UtilisateurCard
                utilisateur={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
            emptyTitle="Aucun utilisateur trouvé"
            emptyDescription="Aucun utilisateur ne correspond à ce filtre."
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
