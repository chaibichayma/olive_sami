
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Palmtree,
  Coffee,
  Pencil,
  X,
  Save,
  RotateCcw,
  Info,
  ChevronDown,
} from "lucide-react";

type Status = "P" | "A" | "C" | "R";

type Employee = {
  id: number;
  name: string;
  role: string;
};

type Attendance = {
  status: Status;
  reason: string;
};

const employees: Employee[] = [
  { id: 1, name: "Ahmed Ben Ali", role: "Opérateur" },
  { id: 2, name: "Sami Trabelsi", role: "Technicien" },
  { id: 3, name: "Amel Gharbi", role: "Responsable" },
  { id: 4, name: "Karim Mansouri", role: "Chauffeur" },
  { id: 5, name: "Nadia Sellami", role: "Assistante" },
  { id: 6, name: "Mohamed Jallouli", role: "Magasinier" },
  { id: 7, name: "Youssef Kchaou", role: "Opérateur" },
  { id: 8, name: "Leila Hamdi", role: "Comptable" },
];

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre",
  "Décembre",
];

const statusConfig: Record<
  Status,
  { label: string; color: string; badge: string; letter: string }
> = {
  P: {
    label: "Présent",
    color: "bg-emerald-500 text-white hover:bg-emerald-600",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    letter: "P",
  },
  A: {
    label: "Absent",
    color: "bg-red-500 text-white hover:bg-red-600",
    badge: "bg-red-100 text-red-700 border-red-200",
    letter: "A",
  },
  C: {
    label: "Congé",
    color: "bg-blue-500 text-white hover:bg-blue-600",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    letter: "C",
  },
  R: {
    label: "Repos",
    color: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    letter: "R",
  },
};

const reasons = [
  "Maladie",
  "Absence autorisée",
  "Absence injustifiée",
  "Congé annuel",
  "Congé exceptionnel",
  "Congé maladie",
  "Autre",
];

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDefaultStatus(year: number, month: number, day: number): Status {
  const weekday = new Date(year, month, day).getDay();
  return weekday === 0 || weekday === 6 ? "R" : "P";
}

function getInitialAttendance(year: number, month: number) {
  const result: Record<string, Attendance> = {};
  const numberOfDays = new Date(year, month + 1, 0).getDate();

  employees.forEach((employee) => {
    for (let day = 1; day <= numberOfDays; day++) {
      result[`${employee.id}-${dateKey(year, month, day)}`] = {
        status: getDefaultStatus(year, month, day),
        reason: "",
      };
    }
  });

  return result;
}

function getDayName(year: number, month: number, day: number) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
  })
    .format(new Date(year, month, day))
    .replace(".", "");
}

function formatDate(year: number, month: number, day: number) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(year, month, day));
}

export default function WorkerAttendancesPage() {
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());

  const [attendance, setAttendance] = useState<
    Record<string, Attendance>
  >(() => getInitialAttendance(today.getFullYear(), today.getMonth()));

  const [modal, setModal] = useState<{
    employee: Employee;
    day: number;
    status: Status;
    reason: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const numberOfDays = new Date(
    displayYear,
    displayMonth + 1,
    0
  ).getDate();

  const days = useMemo(
    () => Array.from({ length: numberOfDays }, (_, i) => i + 1),
    [numberOfDays]
  );

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getAttendance = (
    employeeId: number,
    day: number
  ): Attendance => {
    const key = `${employeeId}-${dateKey(displayYear, displayMonth, day)}`;

    return (
      attendance[key] ?? {
        status: getDefaultStatus(displayYear, displayMonth, day),
        reason: "",
      }
    );
  };

  const totals = useMemo(() => {
    const result: Record<Status, number> = {
      P: 0,
      A: 0,
      C: 0,
      R: 0,
    };

    employees.forEach((employee) => {
      days.forEach((day) => {
        const key = `${employee.id}-${dateKey(displayYear, displayMonth, day)}`;
        const item =
          attendance[key] ??
          { status: getDefaultStatus(displayYear, displayMonth, day), reason: "" };

        result[item.status]++;
      });
    });

    return result;
  }, [attendance, days, displayMonth, displayYear]);

  const dayTotals = (day: number, status: Status) =>
    employees.filter(
      (employee) => getAttendance(employee.id, day).status === status
    ).length;

  const openEditor = (employee: Employee, day: number) => {
    const current = getAttendance(employee.id, day);

    setModal({
      employee,
      day,
      status: current.status,
      reason: current.reason,
    });
    setMessage("");
  };

  const saveCell = () => {
    if (!modal) return;

    if (
      (modal.status === "A" || modal.status === "C") &&
      !modal.reason.trim()
    ) {
      setMessage("Veuillez sélectionner un motif pour cette absence ou ce congé.");
      return;
    }

    const key = `${modal.employee.id}-${dateKey(
      displayYear,
      displayMonth,
      modal.day
    )}`;

    setAttendance((previous) => ({
      ...previous,
      [key]: {
        status: modal.status,
        reason:
          modal.status === "A" || modal.status === "C"
            ? modal.reason
            : "",
      },
    }));

    setModal(null);
    setMessage("");
  };

  const resetAttendance = () => {
    setAttendance(getInitialAttendance(displayYear, displayMonth));
    setMessage("Les statuts du mois ont été réinitialisés.");
  };

  const applyFilters = () => {
    setDisplayMonth(selectedMonth);
    setDisplayYear(selectedYear);
    setMessage("");
  };

  const saveAll = () => {
    // Connecter ici l'API backend pour enregistrer les présences.
    setMessage(
      "Les modifications sont conservées dans cette page. Connectez votre API pour les enregistrer définitivement."
    );
  };

  return (
    <div className="min-h-screen  p-4 text-slate-800 md:p-6">
      <div className="mx-auto max-w-[1800px] space-y-5">
        {/* En-tête */}
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#D9F0DC] text-[#28743C]">
            <CalendarDays size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Gestion des présences et absences
            </h1>
            <p className="mt-1 text-sm text-slate-500 md:text-base">
              Suivez et gérez les présences, absences, congés et repos de vos employés.
            </p>
          </div>
        </div>

        {/* Filtres et statistiques */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[2.2fr_1fr_1fr_1fr_1fr]">
          <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mois
                </label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/15"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Année
                </label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-9 text-sm outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/15"
                  >
                    {Array.from({ length: 7 }, (_, i) => today.getFullYear() - 3 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              <button
                onClick={applyFilters}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#556B2F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#465825]"
              >
                <Search size={19} />
                Afficher
              </button>
            </div>
          </section>

          <StatCard
            icon={<CheckCircle2 size={29} />}
            value={totals.P}
            label="Présences"
            color="green"
          />
          <StatCard
            icon={<XCircle size={29} />}
            value={totals.A}
            label="Absences"
            color="red"
          />
          <StatCard
            icon={<Palmtree size={29} />}
            value={totals.C}
            label="Congés"
            color="blue"
          />
          <StatCard
            icon={<Coffee size={29} />}
            value={totals.R}
            label="Repos"
            color="amber"
          />
        </div>

        {/* Tableau */}
        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {/* Légende et recherche employés */}
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {(["P", "A", "C", "R"] as Status[]).map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <span
                    className={`flex size-7 items-center justify-center rounded-md border text-sm font-bold ${statusConfig[status].badge}`}
                  >
                    {status}
                  </span>
                  <span className="text-sm text-slate-600">
                    {statusConfig[status].label}
                    {status === "R" ? " (Samedi / Dimanche)" : ""}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un employé..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-center text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="sticky left-0 z-[2] w-10 border border-slate-200 bg-slate-50 px-3 py-3">
                    #
                  </th>
                  <th className="sticky left-10 z-[2] min-w-[175px] border border-slate-200 bg-slate-50 px-4 py-3 text-left">
                    Employé
                  </th>

                  {days.map((day) => {
                    const weekday = new Date(
                      displayYear,
                      displayMonth,
                      day
                    ).getDay();
                    const isWeekend = weekday === 0 || weekday === 6;

                    return (
                      <th
                        key={day}
                        className={`min-w-[39px] border border-slate-200 px-1 py-2 ${
                          isWeekend ? "bg-amber-50" : ""
                        }`}
                      >
                        <div className="font-bold text-slate-800">
                          {String(day).padStart(2, "0")}
                        </div>
                        <div className="mt-1 font-normal capitalize text-slate-500">
                          {getDayName(displayYear, displayMonth, day)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.id} className="group hover:bg-slate-50/70">
                    <td className="sticky left-0 z-[1] border border-slate-200 bg-white px-3 py-2 text-slate-600 group-hover:bg-slate-50">
                      {index + 1}
                    </td>

                    <td className="sticky left-10 z-[1] border border-slate-200 bg-white px-4 py-2 text-left group-hover:bg-slate-50">
                      <div className="whitespace-nowrap font-semibold text-slate-800">
                        {employee.name}
                      </div>
                      <div className="mt-1 whitespace-nowrap text-slate-500">
                        {employee.role}
                      </div>
                    </td>

                    {days.map((day) => {
                      const item = getAttendance(employee.id, day);
                      const weekday = new Date(
                        displayYear,
                        displayMonth,
                        day
                      ).getDay();
                      const isWeekend = weekday === 0 || weekday === 6;

                      return (
                        <td
                          key={day}
                          className={`border border-slate-200 p-1 ${
                            isWeekend ? "bg-amber-50/60" : ""
                          }`}
                        >
                          <button
                            type="button"
                            title={`${employee.name} — ${formatDate(displayYear, displayMonth, day)} — ${statusConfig[item.status].label}${item.reason ? ` — ${item.reason}` : ""}`}
                            onClick={() => openEditor(employee, day)}
                            aria-label={`Modifier le statut de ${employee.name} le ${day} ${months[displayMonth]}`}
                            className={`mx-auto flex size-8 items-center justify-center rounded-md text-sm font-bold transition hover:scale-105 ${statusConfig[item.status].badge}`}
                          >
                            {item.status}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Totaux quotidiens */}
                {(
                  [
                    { status: "P", label: "Total Présents" },
                    { status: "A", label: "Total Absents" },
                    { status: "C", label: "Total Congés" },
                    { status: "R", label: "Total Repos" },
                  ] as { status: Status; label: string }[]
                ).map(({ status, label }) => (
                  <tr
                    key={status}
                    className={
                      status === "P"
                        ? "bg-emerald-50/70"
                        : status === "A"
                          ? "bg-red-50/70"
                          : status === "C"
                            ? "bg-blue-50/70"
                            : "bg-amber-50/70"
                    }
                  >
                    <td
                      colSpan={2}
                      className="sticky left-0 z-[1] border border-slate-200 px-4 py-3 text-left font-semibold text-slate-800"
                    >
                      {label}
                    </td>
                    {days.map((day) => (
                      <td
                        key={day}
                        className="border border-slate-200 px-1 py-3 font-medium"
                      >
                        {dayTotals(day, status)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bas de page */}
          
<div className="flex flex-col gap-4 border-t border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-end">
  <div className="flex flex-col gap-3 sm:flex-row">
    <button
      type="button"
      onClick={resetAttendance}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      <RotateCcw size={18} />
      Réinitialiser
    </button>

    <button
      type="button"
      onClick={saveAll}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#556B2F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#465825]"
    >
      <Save size={18} />
      Enregistrer les modifications
    </button>
  </div>
</div>

{message && (
  <div className="mx-4 mb-4 rounded-lg border border-[#D8E4CF] bg-[#F5F8F0] px-4 py-3 text-sm text-[#465825]">
    {message}
  </div>
)}
</section>
</div>


      {/* Popup de modification */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
              setMessage("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-dialog-title"
            className="my-auto w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2
                id="attendance-dialog-title"
                className="text-xl font-bold text-slate-900"
              >
                Modifier la présence
              </h2>
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  setMessage("");
                }}
                aria-label="Fermer"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#E1F2E3] text-[#28743C]">
                <Users size={23} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {modal.employee.name}
                </p>
                <p className="text-sm text-slate-500">
                  {modal.employee.role}
                </p>
              </div>
            </div>

            <p className="mb-5 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Date : </span>
              <span className="capitalize">
                {formatDate(displayYear, displayMonth, modal.day)}
              </span>
            </p>

            <p className="mb-3 text-sm font-semibold text-slate-800">
              Statut
            </p>

            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["P", "A", "C", "R"] as Status[]).map((status) => {
                const active = modal.status === status;

                const activeBorder: Record<Status, string> = {
                  P: "border-emerald-500 bg-emerald-50",
                  A: "border-red-400 bg-red-50",
                  C: "border-blue-400 bg-blue-50",
                  R: "border-amber-400 bg-amber-50",
                };

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setModal({ ...modal, status, reason: "" });
                      setMessage("");
                    }}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                      active
                        ? activeBorder[status]
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-md text-sm font-bold ${statusConfig[status].badge}`}
                    >
                      {status}
                    </span>
                    <span className="text-xs font-medium text-slate-700">
                      {statusConfig[status].label}
                    </span>
                  </button>
                );
              })}
            </div>

            {(modal.status === "A" || modal.status === "C") && (
              <div className="mb-5">
                <label
                  htmlFor="attendance-reason"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Motif obligatoire
                </label>

                <div className="relative">
                  <select
                    id="attendance-reason"
                    value={modal.reason}
                    onChange={(e) =>
                      setModal({ ...modal, reason: e.target.value })
                    }
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/15"
                  >
                    <option value="">Sélectionner un motif...</option>
                    {reasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>
            )}

            {message && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {message}
              </p>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  setMessage("");
                }}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={saveCell}
                className="inline-flex items-center gap-2 rounded-lg bg-[#556B2F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#465825]"
              >
                <Save size={17} />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: "green" | "red" | "blue" | "amber";
}) {
  const colors = {
    green: {
      card: "bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-700",
      text: "text-emerald-800",
    },
    red: {
      card: "bg-red-50",
      icon: "bg-red-100 text-red-600",
      text: "text-red-700",
    },
    blue: {
      card: "bg-blue-50",
      icon: "bg-blue-100 text-blue-700",
      text: "text-blue-800",
    },
    amber: {
      card: "bg-amber-50",
      icon: "bg-amber-100 text-amber-700",
      text: "text-amber-800",
    },
  };

  const theme = colors[color];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-full ${theme.icon}`}
      >
        {icon}
      </div>
      <div className={`min-w-0 ${theme.text}`}>
        <p className="text-2xl font-bold leading-tight">{value}</p>
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
