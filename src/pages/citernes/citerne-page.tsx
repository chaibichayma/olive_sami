
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Database,
  Droplet,
  ChartPie,
  Warehouse,
} from "lucide-react";

import { Container } from "@/components/common/container";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";

import { Citerne, CiterneTable } from "./citerne-table";

type CiterneWithVolume = Citerne & {
  currentVolume?: number;
  fillPercentage?: number;
};

const INITIAL_CITERNES: CiterneWithVolume[] = [
  {
    citerneId: 1,
    reference: "CIT-001",
    libelle: "Citerne principale",
    capacity: 10000,
    dateFabrication: "15/03/2024",
    currentVolume: 6500,
  },
  {
    citerneId: 2,
    reference: "CIT-002",
    libelle: "Citerne secondaire",
    capacity: 5000,
    dateFabrication: "20/06/2024",
    currentVolume: 3200,
  },
  {
    citerneId: 3,
    reference: "CIT-003",
    libelle: "Citerne de stockage",
    capacity: 8000,
    dateFabrication: "10/01/2025",
    currentVolume: 4500,
  },
];

function formatLiters(value: number) {
  return `${value.toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })} L`;
}

interface CapacityIndicatorProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function CapacityIndicator({
  label,
  value,
  icon,
}: CapacityIndicatorProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#f0f4e9] text-[#556B2F]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-500">
          {label}
        </p>

        <p className="text-lg font-bold leading-5 text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

export function CiternePage() {
  const navigate = useNavigate();

  const [citernes, setCiternes] =
    useState<CiterneWithVolume[]>(INITIAL_CITERNES);

  const [error, setError] = useState("");

  const [citerneToDelete, setCiterneToDelete] =
    useState<CiterneWithVolume | null>(null);

  const statistics = useMemo(() => {
    const totalCapacity = citernes.reduce(
      (sum, item) => sum + Math.max(0, item.capacity),
      0
    );

    const hasVolumeData = citernes.every(
      (item) =>
        item.currentVolume !== undefined ||
        item.fillPercentage !== undefined
    );

    const usedCapacity = hasVolumeData
      ? citernes.reduce((sum, item) => {
          const volume =
            item.currentVolume ??
            (item.capacity * (item.fillPercentage ?? 0)) / 100;

          return (
            sum +
            Math.min(
              Math.max(0, item.capacity),
              Math.max(0, volume)
            )
          );
        }, 0)
      : null;

    const availableCapacity =
      usedCapacity === null
        ? null
        : Math.max(0, totalCapacity - usedCapacity);

    return {
      totalCapacity,
      usedCapacity,
      availableCapacity,
    };
  }, [citernes]);

  const handleAdd = () => {
    navigate("/store-admin/tanks/ajouter");
  };

  const handleEdit = (citerne: Citerne) => {
    navigate("/store-admin/tanks/ajouter", {
      state: { citerne },
    });
  };

  const handleDelete = (citerne: Citerne) => {
    setCiterneToDelete(citerne as CiterneWithVolume);
  };

  const handleConfirmDelete = () => {
    if (!citerneToDelete) return;

    setCiternes((previous) =>
      previous.filter(
        (item) =>
          item.citerneId !== citerneToDelete.citerneId
      )
    );

    setCiterneToDelete(null);
  };

  return (
    <>
      <Container>
        <PageHeader
          title="Citernes"
          description="Gestion des citernes de stockage d’huile d’olive"
          icon={<Warehouse className="size-7" strokeWidth={1.8} />}
          actionLabel="Ajouter une citerne"
          onAction={handleAdd}
        >
          <section className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-200/70 bg-white px-3 py-3 shadow-sm sm:grid-cols-3 sm:gap-4">
            <CapacityIndicator
              label="Capacité totale"
              value={formatLiters(statistics.totalCapacity)}
              icon={<Database className="size-5" />}
            />

            <div className="border-y border-slate-100 py-3 sm:border-y-0 sm:border-x sm:px-4 sm:py-0">
              <CapacityIndicator
                label="Capacité utilisée"
                value={
                  statistics.usedCapacity === null
                    ? "—"
                    : formatLiters(statistics.usedCapacity)
                }
                icon={<Droplet className="size-5" />}
              />
            </div>

            <CapacityIndicator
              label="Capacité disponible"
              value={
                statistics.availableCapacity === null
                  ? "—"
                  : formatLiters(statistics.availableCapacity)
              }
              icon={<ChartPie className="size-5" />}
            />
          </section>
        </PageHeader>
      </Container>

      <Container>
        <ErrorAlert
          message={error}
          onClose={() => setError("")}
        />

        <CiterneTable
          citernes={citernes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>

      <ConfirmDeleteDialog
        open={Boolean(citerneToDelete)}
        title="Supprimer la citerne ?"
        description="Cette action supprimera définitivement la citerne sélectionnée."
        itemName={
          citerneToDelete?.reference ||
          citerneToDelete?.libelle ||
          ""
        }
        itemDetails={
          citerneToDelete
            ? `Capacité : ${formatLiters(citerneToDelete.capacity)}`
            : undefined
        }
        onCancel={() => setCiterneToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default CiternePage;
