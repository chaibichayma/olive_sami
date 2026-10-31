
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Plus,
  RefreshCw,
  BriefcaseBusiness,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

import { deleteCompte, getComptes } from "@/services/api";

import { type Compte, CompteTable } from "./compte-table";

/* ============================================================
   TYPES
============================================================ */

interface PageFeedbackProps {
  type: "loading" | "error";
  message: string;
  onRetry?: () => void;
}

/* ============================================================
   COMPOSANT GÉNÉRIQUE : PAGE FEEDBACK
   Chargement et gestion des erreurs
============================================================ */

export function PageFeedback({
  type,
  message,
  onRetry,
}: PageFeedbackProps) {
  if (type === "loading") {
    return (
      <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
        <RefreshCw className="size-5 animate-spin text-[#556B2F]" />
        {message}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <span>{message}</span>

      {onRetry && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="gap-2 border-red-200 bg-white"
        >
          <RefreshCw className="size-4" />
          Réessayer
        </Button>
      )}
    </div>
  );
}

/* ============================================================
   PAGE : GESTION DES COMPTES
============================================================ */

export function ComptePage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ------------------------------------------------------------
     ÉTATS
  ------------------------------------------------------------ */

  const [comptes, setComptes] = useState<Compte[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [compteToDelete, setCompteToDelete] =
    useState<Compte | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* ------------------------------------------------------------
     CHARGEMENT DES COMPTES
  ------------------------------------------------------------ */

  const chargerComptes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response: unknown = await getComptes();

      console.log("Réponse API des comptes :", response);

      let data: unknown = response;

      if (!Array.isArray(data) && data && typeof data === "object") {
        const result = data as Record<string, unknown>;

        data =
          result.data ??
          result.result ??
          result.content ??
          result.comptes ??
          result.list ??
          result.body;
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Le format de la réponse API des comptes est invalide."
        );
      }

      setComptes(data as Compte[]);
    } catch (err) {
      console.error("Erreur de chargement des comptes :", err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les comptes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------------------------------------
     CHARGEMENT INITIAL
  ------------------------------------------------------------ */

  useEffect(() => {
    void chargerComptes();
  }, [chargerComptes, location.key]);

  /* ------------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------------ */

  const handleAdd = () => {
    navigate("/store-admin/accounts/form");
  };

  const handleEdit = (compte: Compte) => {
    navigate("/store-admin/accounts/form", {
      state: { compte },
    });
  };

  /* ------------------------------------------------------------
     SUPPRESSION : OUVERTURE DU DIALOGUE
  ------------------------------------------------------------ */

  const handleDelete = (compte: Compte) => {
    setDeleteError("");
    setError("");
    setCompteToDelete(compte);
  };

  /* ------------------------------------------------------------
     SUPPRESSION : ANNULATION
  ------------------------------------------------------------ */

  const handleCancelDelete = () => {
    if (deleting) return;

    setCompteToDelete(null);
    setDeleteError("");
  };

  /* ------------------------------------------------------------
     SUPPRESSION : CONFIRMATION
  ------------------------------------------------------------ */

  const handleConfirmDelete = async () => {
    if (!compteToDelete || deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteCompte(compteToDelete.compteId);

      setCompteToDelete(null);

      await chargerComptes();
    } catch (err) {
      console.error("Erreur de suppression :", err);

      setDeleteError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer ce compte."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ============================================================
     RENDU
  ============================================================ */

  return (
    <>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Container>
        <PageHeader
          title="Gestion des comptes"
          description="Centralisez les comptes, les coordonnées et les paramètres de conversion."
          icon={
            <BriefcaseBusiness
              className="size-7"
              strokeWidth={2}
            />
          }
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => void chargerComptes()}
                disabled={loading}
                className="h-11 gap-2 rounded-lg border-slate-200 px-4 font-medium text-[#556B2F]"
              >
                <RefreshCw
                  className={`size-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Actualiser
              </Button>

              <Button
                type="button"
                onClick={handleAdd}
                className="h-11 w-full shrink-0 gap-2 rounded-lg bg-[#556B2F] px-5 font-medium text-white shadow-sm transition-colors hover:bg-[#465A27] sm:w-auto"
              >
                <Plus className="size-4" />
                Ajouter un compte
              </Button>
            </>
          }
        />

        <div className="border-b border-[#e8ebdf]" />
      </Container>

      {/* ======================================================
          CONTENU PRINCIPAL
      ====================================================== */}

      <Container>
        <div className="py-5">
          {/* ERREUR DE CHARGEMENT */}
          {error && (
            <PageFeedback
              type="error"
              message={error}
              onRetry={() => void chargerComptes()}
            />
          )}

          {/* CHARGEMENT */}
          {loading ? (
            <PageFeedback
              type="loading"
              message="Chargement des comptes..."
            />
          ) : (
            /* TABLE DES COMPTES */
            !error && (
              <CompteTable
                comptes={comptes}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      </Container>

      {/* ======================================================
          CONFIRMATION DE SUPPRESSION
      ====================================================== */}

      <ConfirmDialog
        open={compteToDelete !== null}
        title="Supprimer le compte ?"
        description="Voulez-vous vraiment supprimer définitivement ce compte du système ?"
        itemName={compteToDelete?.name}
        confirmLabel="Supprimer"
        loading={deleting}
        error={deleteError}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

export default ComptePage;
