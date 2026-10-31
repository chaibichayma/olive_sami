
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Plus,
  RefreshCcw,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { PageHeader } from "@/components/common/PageHeader";
import { InfoBanner } from "@/components/common/InfoBanner";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";



import { utilisateurApi } from "@/services/api";
import { Utilisateur } from "@/components/utilisateurs/utilisateur.types";
import { UtilisateurTable } from "./utilisateur-table";

// ======================================================
// PAGE UTILISATEURS
// ======================================================

export function UtilisateurPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ======================================================
  // ÉTATS
  // ======================================================

  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);

  const [utilisateurToDelete, setUtilisateurToDelete] =
    useState<Utilisateur | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ======================================================
  // CHARGEMENT DES UTILISATEURS
  // ======================================================

  const chargerUtilisateurs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await utilisateurApi.getList("");

      let data: unknown = response;

      // Normalisation des formats possibles de réponse API.
      if (!Array.isArray(data) && data && typeof data === "object") {
        const objet = data as Record<string, unknown>;

        data =
          objet.data ??
          objet.content ??
          objet.result ??
          objet.utilisateurs ??
          objet.users ??
          objet.list ??
          objet.body ??
          [];
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Le format de la réponse API n'est pas un tableau d'utilisateurs."
        );
      }

      const liste: Utilisateur[] = data.map(
        (element: unknown, index: number) => {
          const item = element as Record<string, unknown>;

          const activeValue =
            item.isActive ??
            item.active ??
            item.actif;

          return {
            id: Number(item.id ?? item.userId ?? index + 1),

            displayName: String(
              item.displayName ??
              item.name ??
              item.nom ??
              item.fullName ??
              ""
            ),

            userName: String(
              item.userName ??
              item.username ??
              item.login ??
              item.nomUtilisateur ??
              ""
            ),

            mail: String(
              item.mail ??
              item.email ??
              item.emailAddress ??
              ""
            ),

            // Ne jamais afficher le mot de passe reçu de l'API.
            password: "",

            userCode: String(
              item.userCode ??
              item.code ??
              item.codeUtilisateur ??
              ""
            ),

            isActive:
              activeValue === true ||
              activeValue === 1 ||
              activeValue === "1" ||
              activeValue === "true",
          };
        }
      );

      setUtilisateurs(liste);
    } catch (err: unknown) {
      console.error(
        "Erreur de chargement des utilisateurs :",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // CHARGEMENT INITIAL
  // ======================================================

  useEffect(() => {
    void chargerUtilisateurs();
  }, [chargerUtilisateurs, location.key]);

  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleAdd = () => {
    navigate("/store-admin/users/ajouter");
  };

  const handleEdit = (utilisateur: Utilisateur) => {
    navigate("/store-admin/users/ajouter", {
      state: { utilisateur },
    });
  };

  // ======================================================
  // SUPPRESSION
  // ======================================================

  const handleDelete = (utilisateur: Utilisateur) => {
    setDeleteError(null);
    setUtilisateurToDelete(utilisateur);
  };

  const handleCancelDelete = () => {
    if (deleting) return;

    setDeleteError(null);
    setUtilisateurToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!utilisateurToDelete || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const response = await utilisateurApi.delete(
        utilisateurToDelete.id
      );

      if (response?.isValid === false) {
        throw new Error(
          response.message || "La suppression a échoué."
        );
      }

      setUtilisateurToDelete(null);

      // Actualiser la liste après suppression.
      await chargerUtilisateurs();
    } catch (err: unknown) {
      console.error(
        "Erreur lors de la suppression :",
        err
      );

      setDeleteError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer cet utilisateur."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ======================================================
  // AFFICHAGE
  // ======================================================

  return (
    <>
      {/* EN-TÊTE */}
      <Container>
        <div className="py-5 sm:py-6">
          <PageHeader
            title="Utilisateurs"
            description="Gérez les utilisateurs du système, leurs rôles et leurs permissions."
            actions={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void chargerUtilisateurs()}
                  disabled={loading}
                  className="h-11 gap-2 rounded-lg border-slate-200"
                >
                  <RefreshCcw
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
                  Ajouter un utilisateur
                </Button>
              </>
            }
          />

          {/* BLOC D'INFORMATION */}
          <div className="mt-6">
            <InfoBanner
              icon={<Users className="size-6" />}
              title="Gérez facilement vos utilisateurs"
              description="Ajoutez, modifiez ou désactivez des utilisateurs et définissez leurs rôles."
            />
          </div>
        </div>
      </Container>

      {/* CONTENU PRINCIPAL */}
      <Container>
        {loading ? (
          <LoadingState message="Chargement des utilisateurs..." />
        ) : error ? (
          <ErrorState
            title="Erreur de chargement"
            message={error}
            onRetry={() => void chargerUtilisateurs()}
            retryLabel="Réessayer"
          />
        ) : (
          <UtilisateurTable
            utilisateurs={utilisateurs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Container>

      {/* CONFIRMATION DE SUPPRESSION */}
      <ConfirmDialog
        open={utilisateurToDelete !== null}
        title="Supprimer l'utilisateur ?"
        description="Cette action supprimera définitivement cet utilisateur du système."
        itemName={utilisateurToDelete?.displayName}
        confirmLabel="Supprimer"
        loading={deleting}
        error={deleteError}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

export default UtilisateurPage;
