import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  FileText,
  Hash,
  History,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

import type { BonReception } from "./bon-reception.types";
import { SideDrawer } from "@/components/common/SideDrawer";

interface BonReceptionHistoryProps {
  open: boolean;
  bons: BonReception[];
  onClose: () => void;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value || 0);

const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

function getStatusStyle(status: string) {
  switch (status) {
    case "En cours":
      return {
        className: "bg-[#dcfce7] text-[#16833b]",
        icon: <CheckCircle2 className="size-3.5" />,
      };

    case "Terminé":
      return {
        className: "bg-[#dbeafe] text-[#2563eb]",
        icon: <CheckCircle2 className="size-3.5" />,
      };

    case "En attente":
      return {
        className: "bg-[#ffedd5] text-[#ea580c]",
        icon: <Clock3 className="size-3.5" />,
      };

    case "Annulé":
      return {
        className: "bg-[#fee2e2] text-[#dc2626]",
        icon: <XCircle className="size-3.5" />,
      };

    default:
      return {
        className: "bg-gray-100 text-gray-600",
        icon: <Clock3 className="size-3.5" />,
      };
  }
}

function StatCard({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#eef4e6] text-[#556B2F]">
          {icon}
        </div>

        <span className="text-xs text-[#64748b]">{label}</span>
      </div>

      <p className="mt-2 text-xl font-bold text-[#172033]">
        {value}
        {unit && (
          <span className="ml-1 text-xs font-medium text-[#94a3b8]">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

export function BonReceptionHistory({
  open,
  bons,
  onClose,
}: BonReceptionHistoryProps) {
  const account = bons[0];

  const totalOlives = bons.reduce(
    (total, bon) => total + bon.quantityOlive,
    0,
  );

  const totalOil = bons.reduce(
    (total, bon) => total + bon.quantityOil,
    0,
  );

  const totalPrice = bons.reduce(
    (total, bon) => total + bon.price,
    0,
  );

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="Historique des bons"
      subtitle="Historique du compte"
      icon={<History className="size-5 text-[#556B2F]" />}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-lg border border-[#dfe4e9] bg-white text-sm font-semibold text-[#334155] hover:border-[#556B2F] hover:bg-[#f5f8f1] hover:text-[#556B2F]"
        >
          Fermer
        </button>
      }
    >
      {account && (
        <div className="border-b border-[#edf0f2] bg-[#fafcf9] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#e6f0dc]">
              <UserRound className="size-7 text-[#556B2F]" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-[#172033]">
                {account.name}
              </h3>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <Hash className="size-3.5" />
                  Compte #{account.compteId}
                </span>

                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {account.mobile}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 border-b border-[#edf0f2] p-5">
        <StatCard
          label="Total bons"
          value={bons.length}
          icon={<FileText className="size-4" />}
        />

        <StatCard
          label="Olives"
          value={formatNumber(totalOlives)}
          unit="kg"
          icon={<Droplets className="size-4" />}
        />

        <StatCard
          label="Huile"
          value={formatNumber(totalOil)}
          unit="L"
          icon={<Droplets className="size-4" />}
        />

        <StatCard
          label="Montant"
          value={formatPrice(totalPrice)}
          unit="DT"
          icon={<span className="text-xs font-bold">DT</span>}
        />
      </div>

      <div className="px-6 pb-8 pt-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">
              Historique des réceptions
            </h3>

            <p className="mt-1 text-xs text-[#94a3b8]">
              Tous les bons associés à ce compte
            </p>
          </div>

          <span className="rounded-full bg-[#eef4e6] px-3 py-1 text-xs font-semibold text-[#556B2F]">
            {bons.length} bon{bons.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="relative">
          {bons.length > 1 && (
            <div className="absolute bottom-6 left-[17px] top-6 w-px bg-[#e5e7eb]" />
          )}

          <div className="space-y-5">
            {bons.map((bon) => {
              const status = getStatusStyle(bon.statusLib);

              return (
                <div key={bon.id} className="relative flex gap-4">
                  <div className="relative z-10 flex size-[35px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#eef4e6]">
                    <div className="size-2 rounded-full bg-[#556B2F]" />
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#172033]">
                            {bon.reference}
                          </span>

                          <span className="text-[11px] text-[#94a3b8]">
                            #{bon.id}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#64748b]">
                          <CalendarDays className="size-3.5" />
                          {bon.dateCreation}
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${status.className}`}
                      >
                        {status.icon}
                        {bon.statusLib}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-[#f8fafc] p-2.5">
                        <p className="text-[10px] text-[#94a3b8]">
                          Olives
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#334155]">
                          {formatNumber(bon.quantityOlive)} kg
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#f8fafc] p-2.5">
                        <p className="text-[10px] text-[#94a3b8]">
                          Huile
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#334155]">
                          {formatNumber(bon.quantityOil)} L
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#f8fafc] p-2.5">
                        <p className="text-[10px] text-[#94a3b8]">
                          Prix/kg
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#334155]">
                          {formatPrice(bon.priceKg)} DT
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#f8fafc] p-2.5">
                        <p className="text-[10px] text-[#94a3b8]">
                          Prix total
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-[#556B2F]">
                          {formatPrice(bon.price)} DT
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-[#edf0f2] pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#64748b]">Paiement</span>
                        <span className="font-semibold text-[#334155]">
                          {formatPrice(bon.payement)} DT
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-[#64748b]">Acompte</span>
                        <span className="font-semibold text-[#334155]">
                          {formatPrice(bon.acompte)} DT
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg border border-[#edf0f2] bg-[#fafcf9] p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                        Production
                      </p>

                      <div className="mt-2 space-y-1 text-xs text-[#475569]">
                        <div className="flex justify-between gap-3">
                          <span>Début</span>
                          <span className="font-medium text-[#334155]">
                            {bon.dateDebProduction || "—"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span>Fin</span>
                          <span className="font-medium text-[#334155]">
                            {bon.dateFinProduction || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {bon.observation && (
                      <div className="mt-3 rounded-lg bg-[#f8fafc] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                          Observation
                        </p>

                        <p className="mt-1 text-xs text-[#475569]">
                          {bon.observation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {bons.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                Aucun historique disponible.
              </p>
            )}
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}