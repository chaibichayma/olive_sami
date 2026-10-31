import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Plus,
  Trash2,
  X,
  UsersRound,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';

import { getOuvriers } from '@/services/api';

import { OuvrierTable } from './ouvrier-table';
import type { Ouvrier } from '@/components/ouvriers/ouvrier.types';

/* ============================================================
   PAGE GESTION DES OUVRIERS
============================================================ */

export function OuvrierPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ==========================================================
     ÉTATS
  ========================================================== */

  const [ouvriers, setOuvriers] = useState<Ouvrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [ouvrierToDelete, setOuvrierToDelete] =
    useState<Ouvrier | null>(null);

  /* ==========================================================
     CHARGEMENT DES OUVRIERS
  ========================================================== */

  const chargerOuvriers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getOuvriers();

      setOuvriers(data as Ouvrier[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les ouvriers.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==========================================================
     CHARGEMENT INITIAL
  ========================================================== */

  useEffect(() => {
    void chargerOuvriers();
  }, [chargerOuvriers]);

  /* ==========================================================
     ACTUALISATION APRÈS AJOUT OU MODIFICATION
  ========================================================== */

  useEffect(() => {
    if (location.state?.refreshOuvriers) {
      void chargerOuvriers();

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [
    location.key,
    location.pathname,
    location.state,
    navigate,
    chargerOuvriers,
  ]);

  /* ==========================================================
     AJOUTER UN OUVRIER
  ========================================================== */

  const handleAdd = () => {
    navigate('/store-admin/workers/form');
  };

  /* ==========================================================
     MODIFIER UN OUVRIER
  ========================================================== */

  const handleEdit = (ouvrier: Ouvrier) => {
    navigate('/store-admin/workers/form', {
      state: { ouvrier },
    });
  };

  /* ==========================================================
     OUVRIR LA MODALE DE SUPPRESSION
  ========================================================== */

  const handleDelete = (ouvrier: Ouvrier) => {
    setError('');
    setOuvrierToDelete(ouvrier);
  };

  /* ==========================================================
     ANNULER LA SUPPRESSION
  ========================================================== */

  const handleCancelDelete = () => {
    setOuvrierToDelete(null);
  };

  /* ==========================================================
     CONFIRMER LA SUPPRESSION

     À connecter à l'endpoint DELETE du backend.
  ========================================================== */

  const handleConfirmDelete = () => {
    setError(
      'La suppression nécessite de configurer la route DELETE des ouvriers dans Swagger.',
    );

    setOuvrierToDelete(null);
  };

  /* ==========================================================
     AFFICHAGE
  ========================================================== */

  return (
    <>
      {/* EN-TÊTE */}

      <Container>
        <header className="w-full py-5 sm:py-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e1e9d7] bg-[#f0f5e8]">
                <UsersRound className="size-6 text-[#556B2F]" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-[#172033] sm:text-2xl">
                  Gestion des ouvriers
                </h1>

                <p className="mt-1 text-sm leading-5 text-slate-500 sm:text-[15px]">
                  Consultez, ajoutez et gérez les informations des ouvriers.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAdd}
              className="h-10 w-full shrink-0 gap-2 rounded-lg bg-[#556B2F] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#465A27] sm:w-auto"
            >
              <Plus className="size-4" />
              Ajouter un ouvrier
            </Button>
          </div>

          <div className="mt-6 border-b border-[#e8ebdf]" />
        </header>
      </Container>

      {/* CONTENU */}

      <Container>

        {/* MESSAGE D'ERREUR */}

        {error && (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>

            <Button
              type="button"
              variant="outline"
              onClick={() => void chargerOuvriers()}
              className="gap-2 border-red-200 bg-white"
            >
              <RefreshCw className="size-4" />
              Réessayer
            </Button>
          </div>
        )}

        {/* CHARGEMENT */}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
            <RefreshCw className="size-5 animate-spin text-[#556B2F]" />
            Chargement des ouvriers...
          </div>
        ) : (
          /* TABLEAU */

          <OuvrierTable
            ouvriers={ouvriers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Container>

      {/* MODALE DE CONFIRMATION */}

      {ouvrierToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]"
          onClick={handleCancelDelete}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-worker-title"
            className="relative w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            {/* FERMER */}

            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>

            {/* ICÔNE */}

            <div className="flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 className="size-7 text-red-500" />
              </div>
            </div>

            {/* MESSAGE */}

            <div className="mt-5 text-center">
              <h2
                id="delete-worker-title"
                className="text-xl font-bold tracking-tight text-slate-900"
              >
                Supprimer l'ouvrier ?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Voulez-vous vraiment supprimer l'ouvrier suivant ?
              </p>

              <p className="mt-2 break-words font-semibold text-slate-800">
                {ouvrierToDelete.nom}
              </p>
            </div>

            {/* ACTIONS */}

            <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelDelete}
                className="h-11 min-w-[120px] rounded-lg border-slate-200"
              >
                Annuler
              </Button>

              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="h-11 min-w-[145px] rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 size-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OuvrierPage;
