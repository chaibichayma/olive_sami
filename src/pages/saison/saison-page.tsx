
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { Saison, SaisonTable } from "./saison-table";

const INITIAL_SAISONS: Saison[] = [
  {
    id: "1",
    year: 2024,
    beginDate: "2024-10-01",
    endDate: "2025-06-30",
    statusId: 2,
    priceKilo: 1.2,
    priceAchat: 12,
    priceVente: 15,
    nbreCaisses: 250,
  },
  {
    id: "2",
    year: 2025,
    beginDate: "2025-10-01",
    endDate: "2026-06-30",
    statusId: 1,
    priceKilo: 1.5,
    priceAchat: 13,
    priceVente: 16,
    nbreCaisses: 320,
  },
  {
    id: "3",
    year: 2026,
    beginDate: "2026-10-01",
    endDate: "2027-06-30",
    statusId: 1,
    priceKilo: 1.6,
    priceAchat: 14,
    priceVente: 17,
    nbreCaisses: 400,
  },
];

export function SaisonPage() {
  const navigate = useNavigate();

  const [saisons, setSaisons] =
    useState<Saison[]>(INITIAL_SAISONS);

  const [error, setError] = useState("");

  const [saisonToDelete, setSaisonToDelete] =
    useState<Saison | null>(null);

  const handleAdd = () => {
    navigate("/store-admin/saison/ajouter");
  };

  const handleEdit = (saison: Saison) => {
    navigate("/store-admin/saison/ajouter", {
      state: { saison },
    });
  };

  const handleDelete = (saison: Saison) => {
    setSaisonToDelete(saison);
  };

  const handleConfirmDelete = () => {
    if (!saisonToDelete) return;

    setSaisons((previous) =>
      previous.filter((item) => item.id !== saisonToDelete.id)
    );

    setSaisonToDelete(null);
  };

  return (
    <>
      <Container>
        <PageHeader
          title="Saisons"
          description="Gérez les campagnes et les paramètres de production d'huile d'olive."
          icon={<Sprout className="size-7" strokeWidth={2} />}
          actionLabel="Ajouter une saison"
          onAction={handleAdd}
        />
      </Container>

      <Container>
        <ErrorAlert
          message={error}
          onClose={() => setError("")}
        />

        <SaisonTable
          saisons={saisons}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>

      <ConfirmDeleteDialog
        open={Boolean(saisonToDelete)}
        title="Supprimer la saison ?"
        description="Voulez-vous vraiment supprimer cette saison ? Cette action est irréversible."
        itemName={
          saisonToDelete
            ? `Saison ${saisonToDelete.year}`
            : ""
        }
        onCancel={() => setSaisonToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default SaisonPage;
