import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  FileText,
  Leaf,
  UserRound,
  Scale,
  Clock3,
  Factory,
  CreditCard,
  CircleCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { PageHero, HeroInfo } from "@/components/common/PageHero";
import { StatsGrid } from "@/components/common/StatsGrid";
import type { StatItem } from "@/components/common/StatsGrid";
import { SearchToolbar } from "@/components/common/SearchToolbar";
import { PageFeedback } from "@/components/common/PageFeedback";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

import type { BonReception } from "@/components/reception/bon-reception.types";
import { extractList, normalizeBonReception } from "@/components/reception/bon-reception.mapper";
import { BonReceptionTable } from "./bon-reception-table";

const API_URL = "/olive_app/reception/getListBean";
const OLIVE_BANNER = "/images/olive-banner.png";

const INITIAL_SEARCH = "a";

function normalizeStatus(status: string): string {
  return status
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function BonReceptionPage() {
  const navigate = useNavigate();

  const [bons, setBons] = useState<BonReception[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [bonToDelete, setBonToDelete] =
    useState<BonReception | null>(null);

  // ==========================================================
  // CHARGEMENT DES DONNÉES
  // ==========================================================

  const loadBons = useCallback(async (searchValue: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}?searche=${encodeURIComponent(searchValue.trim())}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        const details = await response.text();

        throw new Error(
          `Erreur HTTP ${response.status}${
            details ? ` : ${details}` : ""
          }`,
        );
      }

      const data: unknown = await response.json();

      const normalized = extractList(data)
        .map(normalizeBonReception)
        .filter(
          (item): item is BonReception => item !== null,
        );

      setBons(normalized);
    } catch (err) {
      console.error("Erreur chargement des bons :", err);

      setBons([]);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les bons de réception.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBons(INITIAL_SEARCH);
  }, [loadBons]);

  // ==========================================================
  // RECHERCHE
  // ==========================================================

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      setError("Veuillez saisir un terme de recherche.");
      return;
    }

    void loadBons(searchValue);
  };

  const handleResetSearch = () => {
    setSearch("");
    void loadBons(INITIAL_SEARCH);
  };

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleAdd = () => {
    navigate("/store-admin/reception-vouchers/add");
  };

  const handleEdit = (bon: BonReception) => {
    navigate(`/store-admin/reception-vouchers/edit/${bon.id}`);
  };

  // ==========================================================
  // SUPPRESSION
  // ==========================================================

  const handleDeleteRequest = (bon: BonReception) => {
    setBonToDelete(bon);
  };

  const handleCancelDelete = () => {
    setBonToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!bonToDelete) return;

    // Suppression locale uniquement.
    // Le tableau sera actualisé grâce à la nouvelle prop bons.
    setBons((current) =>
      current.filter((item) => item.id !== bonToDelete.id),
    );

    setBonToDelete(null);
  };

  // ==========================================================
  // STATISTIQUES DYNAMIQUES
  // ==========================================================

  const receptionStats = useMemo<StatItem[]>(() => {
    const countStatus = (...statuses: string[]) => {
      const normalizedStatuses = statuses.map(normalizeStatus);

      return bons.filter((bon) =>
        normalizedStatuses.includes(
          normalizeStatus(bon.statusLib),
        ),
      ).length;
    };

    return [
      {
        label: "Total des bons",
        value: bons.length,
        icon: FileText,
        color: "bg-[#edf4e5] text-[#556B2F]",
        trend: undefined,
      },
      {
        label: "Non affectés",
        value: countStatus("Non Affecté", "Non affectés"),
        icon: UserRound,
        color: "bg-blue-50 text-blue-500",
      },
      {
        label: "Non pesés",
        value: countStatus("Non Pesé", "Non pesés"),
        icon: Scale,
        color: "bg-orange-50 text-orange-500",
      },
      {
        label: "En attente",
        value: countStatus("En attente"),
        icon: Clock3,
        color: "bg-purple-50 text-purple-500",
      },
      {
        label: "Fin production",
        value: countStatus("Fin Prod", "Fin production"),
        icon: Factory,
        color: "bg-green-50 text-green-600",
      },
      {
        label: "Non payés",
        value: countStatus("Non Payé", "Non payés"),
        icon: CreditCard,
        color: "bg-rose-50 text-rose-500",
      },
      {
        label: "Validés",
        value: countStatus("Validé", "Validés"),
        icon: CircleCheck,
        color: "bg-cyan-50 text-cyan-600",
      },
    ];
  }, [bons]);

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (
    <>
      <Container>
        <div className="space-y-5 py-4 sm:py-6">
          <PageHero
            title="Bon de réception"
            description="Consultez, gérez et suivez tous les bons de réception d’olives reçues de vos fournisseurs."
            icon={
              <FileText
                className="size-7 sm:size-8"
                strokeWidth={1.8}
              />
            }
            banner={OLIVE_BANNER}
            footer={
              <div className="flex items-center gap-2 text-xs font-medium text-[#62764b] sm:text-sm">
                <Leaf className="size-4" />
                <span>
                  Gestion des olives et de la production d’huile
                </span>
              </div>
            }
          >
            <Button
              type="button"
              onClick={handleAdd}
              className="h-11 w-full rounded-xl bg-[#556B2F] px-5 font-semibold text-white shadow-md shadow-[#556B2F]/15 transition-all hover:-translate-y-0.5 hover:bg-[#465A27] hover:shadow-lg"
            >
              <Plus className="mr-2 size-5" />
              Ajouter un bon de réception
            </Button>

            <HeroInfo
              icon={<Leaf className="size-5" />}
              title="Traçabilité garantie"
              description="De la réception à la production"
            />
          </PageHero>

          <StatsGrid items={receptionStats} columns={7} />
        </div>
      </Container>

      <Container>
        <div className="space-y-4 pb-6">
          <SearchToolbar
            value={search}
            onChange={setSearch}
            onSubmit={handleSearch}
            onReset={handleResetSearch}
            placeholder="Rechercher par référence, fournisseur..."
            loading={loading}
          />

          {error || loading ? (
            <PageFeedback
              loading={loading}
              error={error}
            />
          ) : bons.length === 0 ? (
            <PageFeedback
              empty
              emptyMessage="Aucun bon de réception trouvé."
            />
          ) : (
            <BonReceptionTable
              bons={bons}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          )}
        </div>
      </Container>

      <ConfirmDialog
        open={bonToDelete !== null}
        title="Supprimer le bon de réception ?"
        message="Cette action retirera le bon suivant de la liste :"
        itemName={
          bonToDelete
            ? bonToDelete.reference ||
              `Bon n° ${bonToDelete.id}`
            : undefined
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}