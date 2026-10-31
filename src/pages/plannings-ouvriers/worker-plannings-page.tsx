import { useMemo, useState, type ReactNode } from "react";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  UserRound,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";

import { Container } from "@/components/common/container";

import { SelectField } from "@/components/common/forms/SelectField";
import { BaseModal } from "@/components/common/Modal/BaseModal";
import { ColorPicker } from "@/components/common/ColorPicker";
import { MonthCalendar } from "@/components/common/Calendar/MonthCalendar";
import { Ouvrier, PlanningFilters, PlanningForm, PlanningOuvrier } from "../workers/worker-planning.types";



/* ============================================================
   DONNÉES
============================================================ */

const ouvriers: Ouvrier[] = [
  { id: 1, name: "Mohamed Ali", specialite: "Manutention", statut: "Actif" },
  { id: 2, name: "Youssef Saidi", specialite: "Pressage", statut: "Actif" },
  { id: 3, name: "Khaled Amri", specialite: "Entretien", statut: "En congé" },
  { id: 4, name: "Ahmed Ben Salah", specialite: "Contrôle qualité", statut: "Actif" },
  { id: 5, name: "Hichem Trabelsi", specialite: "Manutention", statut: "Inactif" },
];

const initialPlannings: PlanningOuvrier[] = [
  {
    id: 1,
    ouvrierId: 1,
    ouvrierName: "Mohamed Ali",
    poste: "Manutention",
    description: "Réception des olives",
    date: "2026-10-06",
    heureDebut: "09:00",
    heureFin: "12:00",
    lieu: "Zone de réception",
    couleur: "#556B2F",
  },
  {
    id: 2,
    ouvrierId: 2,
    ouvrierName: "Youssef Saidi",
    poste: "Pressage",
    description: "Travail sur la ligne de production",
    date: "2026-10-07",
    heureDebut: "08:00",
    heureFin: "12:00",
    lieu: "Salle de pressage",
    couleur: "#3B82F6",
  },
  {
    id: 3,
    ouvrierId: 3,
    ouvrierName: "Khaled Amri",
    poste: "Entretien",
    description: "Nettoyage des équipements",
    date: "2026-10-07",
    heureDebut: "14:00",
    heureFin: "17:00",
    lieu: "Atelier",
    couleur: "#F59E0B",
  },
  {
    id: 4,
    ouvrierId: 4,
    ouvrierName: "Ahmed Ben Salah",
    poste: "Contrôle qualité",
    description: "Contrôle de la qualité",
    date: "2026-10-09",
    heureDebut: "10:00",
    heureFin: "13:00",
    lieu: "Laboratoire",
    couleur: "#8B5CF6",
  },
  {
    id: 5,
    ouvrierId: 5,
    ouvrierName: "Hichem Trabelsi",
    poste: "Manutention",
    description: "Déplacement des caisses",
    date: "2026-10-12",
    heureDebut: "08:00",
    heureFin: "12:00",
    lieu: "Entrepôt",
    couleur: "#10B981",
  },
  {
    id: 6,
    ouvrierId: 1,
    ouvrierName: "Mohamed Ali",
    poste: "Manutention",
    description: "Chargement des caisses",
    date: "2026-10-14",
    heureDebut: "08:00",
    heureFin: "11:00",
    lieu: "Entrepôt",
    couleur: "#556B2F",
  },
];

const weekdays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const specialties = [
  "Manutention",
  "Pressage",
  "Entretien",
  "Contrôle qualité",
  "Réception",
];

const colors = [
  "#556B2F",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
];

const INITIAL_FORM: PlanningForm = {
  ouvrierId: "1",
  poste: "Manutention",
  description: "",
  startDate: "2026-10-07",
  startTime: "08:00",
  endDate: "2026-10-07",
  endTime: "12:00",
  allDay: false,
  lieu: "",
  couleur: "#556B2F",
};

const INITIAL_FILTERS: PlanningFilters = {
  month: "2026-10",
  ouvrierId: "",
  specialite: "",
  statut: "",
};

/* ============================================================
   UTILITAIRES
============================================================ */

const today = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const monthKey = (date: Date) => dateKey(
  new Date(date.getFullYear(), date.getMonth(), 1)
).slice(0, 7);

const dateLabel = (value: string) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

const timeLabel = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${
    hours >= 12 ? "PM" : "AM"
  }`;
};

function createCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  const result: { date: Date; currentMonth: boolean }[] = [];

  for (let i = firstDay.getDay() - 1; i >= 0; i--) {
    result.push({
      date: new Date(year, month - 1, previousMonthDays - i),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    result.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (result.length < 42) {
    result.push({
      date: new Date(year, month + 1, nextDay++),
      currentMonth: false,
    });
  }

  return result;
}

/* ============================================================
   PAGE
============================================================ */

export function WorkerPlanningsPage() {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 9, 7)
  );

  const [selectedDate, setSelectedDate] = useState("2026-10-07");

  const [plannings, setPlannings] =
    useState<PlanningOuvrier[]>(initialPlannings);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedPlanning, setSelectedPlanning] =
    useState<PlanningOuvrier | null>(null);

  const [draft, setDraft] = useState<PlanningFilters>(INITIAL_FILTERS);
  const [filters, setFilters] = useState<PlanningFilters>(INITIAL_FILTERS);

  const [form, setForm] = useState<PlanningForm>(INITIAL_FORM);

  /* ==========================================================
     FILTRES
  ========================================================== */

  const filtered = useMemo(
    () =>
      plannings.filter((planning) => {
        const worker = ouvriers.find(
          (item) => item.id === planning.ouvrierId
        );

        return (
          (!filters.month || planning.date.startsWith(filters.month)) &&
          (!filters.ouvrierId ||
            planning.ouvrierId === Number(filters.ouvrierId)) &&
          (!filters.specialite ||
            planning.poste === filters.specialite) &&
          (!filters.statut || worker?.statut === filters.statut)
        );
      }),
    [plannings, filters]
  );

  const days = useMemo(
    () => createCalendarDays(currentDate),
    [currentDate]
  );

  const todayString = dateKey(today());

  const selectedDayPlannings = filtered.filter(
    (planning) => planning.date === selectedDate
  );

  /* ==========================================================
     MISE À JOUR DU FORMULAIRE
  ========================================================== */

  function updateForm<K extends keyof PlanningForm>(
    key: K,
    value: PlanningForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  /* ==========================================================
     GESTION DES FILTRES
  ========================================================== */

  function applyFilters() {
    const [year, month] = draft.month.split("-").map(Number);

    if (year && month) {
      const date = new Date(year, month - 1, 1);

      setCurrentDate(date);
      setSelectedDate(dateKey(date));
    }

    setFilters({ ...draft });
  }

  function resetFilters() {
    const clean: PlanningFilters = {
      month: monthKey(currentDate),
      ouvrierId: "",
      specialite: "",
      statut: "",
    };

    setDraft(clean);
    setFilters(clean);
  }

  /* ==========================================================
     NAVIGATION CALENDRIER
  ========================================================== */

  function changeMonth(offset: number) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );

    setCurrentDate(date);

    setDraft((previous) => ({
      ...previous,
      month: monthKey(date),
    }));

    setFilters((previous) => ({
      ...previous,
      month: monthKey(date),
    }));
  }

  function goToday() {
    const date = today();
    const month = monthKey(date);

    setCurrentDate(date);
    setSelectedDate(dateKey(date));

    setDraft((previous) => ({ ...previous, month }));
    setFilters((previous) => ({ ...previous, month }));
  }

  /* ==========================================================
     CRÉATION
  ========================================================== */

  function openCreate(date?: string) {
    setEditingId(null);

    const chosenDate = date || selectedDate || dateKey(currentDate);

    setSelectedDate(chosenDate);

    setForm({
      ...INITIAL_FORM,
      ouvrierId: draft.ouvrierId || "1",
      poste: draft.specialite || "Manutention",
      startDate: chosenDate,
      endDate: chosenDate,
    });

    setShowModal(true);
  }

  /* ==========================================================
     MODIFICATION
  ========================================================== */

  function openEdit(planning: PlanningOuvrier) {
    setSelectedPlanning(null);
    setEditingId(planning.id);

    setForm({
      ouvrierId: String(planning.ouvrierId),
      poste: planning.poste,
      description: planning.description,
      startDate: planning.date,
      startTime: planning.heureDebut,
      endDate: planning.date,
      endTime: planning.heureFin,
      allDay:
        planning.heureDebut === "00:00" &&
        planning.heureFin === "23:59",
      lieu: planning.lieu,
      couleur: planning.couleur,
    });

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
  }

  /* ==========================================================
     ENREGISTREMENT
  ========================================================== */

  function createPlanning() {
    const worker = ouvriers.find(
      (item) => item.id === Number(form.ouvrierId)
    );

    if (
      !worker ||
      !form.startDate ||
      !form.endDate ||
      form.endDate < form.startDate
    ) {
      return;
    }

    if (
      !form.allDay &&
      form.startDate === form.endDate &&
      form.endTime <= form.startTime
    ) {
      return;
    }

    const planning: PlanningOuvrier = {
      id: editingId ?? Date.now(),
      ouvrierId: worker.id,
      ouvrierName: worker.name,
      poste: form.poste,
      description: form.description.trim() || "Planning de travail",
      date: form.startDate,
      heureDebut: form.allDay ? "00:00" : form.startTime,
      heureFin: form.allDay ? "23:59" : form.endTime,
      lieu: form.lieu.trim(),
      couleur: form.couleur,
    };

    const month = planning.date.slice(0, 7);

    setPlannings((previous) =>
      editingId === null
        ? [...previous, planning]
        : previous.map((item) =>
            item.id === editingId ? planning : item
          )
    );

    setSelectedDate(planning.date);

    setCurrentDate(
      new Date(
        Number(month.slice(0, 4)),
        Number(month.slice(5, 7)) - 1,
        1
      )
    );

    setDraft((previous) => ({ ...previous, month }));
    setFilters((previous) => ({ ...previous, month }));

    closeModal();
  }

  /* ==========================================================
     AFFICHAGE D'UN ÉVÉNEMENT
  ========================================================== */

  function renderPlanning(planning: PlanningOuvrier): ReactNode {
    return (
      <div
        className="rounded-lg border px-2 py-1.5 text-xs transition hover:brightness-[0.98]"
        style={{
          backgroundColor: `${planning.couleur}12`,
          borderColor: `${planning.couleur}38`,
        }}
      >
        <div
          className="flex items-center gap-1 font-semibold"
          style={{ color: planning.couleur }}
        >
          <Clock3 className="size-3 shrink-0" />
          <span className="truncate">
            {timeLabel(planning.heureDebut)}
          </span>
        </div>

        <div className="mt-0.5 truncate font-semibold text-slate-800">
          {planning.ouvrierName}
        </div>

        <div className="truncate text-slate-500">
          {planning.poste}
        </div>
      </div>
    );
  }

  /* ==========================================================
     VALIDATION FORMULAIRE
  ========================================================== */

  const formInvalid =
    !form.ouvrierId ||
    !form.startDate ||
    !form.endDate ||
    form.endDate < form.startDate ||
    (!form.allDay &&
      form.startDate === form.endDate &&
      form.endTime <= form.startTime);

  /* ==========================================================
     AFFICHAGE
  ========================================================== */

  return (
    <div className="min-h-full pb-8">
      <Container>
        <div className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#DCE8CF] bg-[#F0F5E9] shadow-sm sm:size-16">
              <CalendarDays className="size-7 text-[#556B2F] sm:size-8" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl">
                Gestion des plannings des ouvriers
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Planifiez et suivez les horaires de travail des ouvriers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openCreate()}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#556B2F] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#465A27] sm:self-center"
          >
            <Plus className="size-4" />
            Ajouter un planning
          </button>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-5">

          {/* FILTRES */}

          <section className="rounded-2xl border border-[#E6EDE0] bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.05fr_1.2fr_1.2fr_1fr_auto] xl:items-end">

              {/* Mois */}

              <div className="space-y-1.5">
                <label
                  htmlFor="filter-month"
                  className="text-xs font-semibold text-slate-600"
                >
                  Mois
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#556B2F]" />

                  <input
                    id="filter-month"
                    type="month"
                    value={draft.month}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        month: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#91A875] focus:ring-2 focus:ring-[#556B2F]/10"
                  />
                </div>
              </div>

              <SelectField
                id="filter-worker"
                label="Ouvrier"
                value={draft.ouvrierId}
                placeholder="Tous les ouvriers"
                icon={<UserRound className="size-4" />}
                options={ouvriers.map((worker) => ({
                  label: worker.name,
                  value: String(worker.id),
                }))}
                onChange={(value) =>
                  setDraft((previous) => ({
                    ...previous,
                    ouvrierId: value,
                  }))
                }
              />

              <SelectField
                id="filter-specialty"
                label="Spécialité"
                value={draft.specialite}
                placeholder="Toutes les spécialités"
                icon={<BriefcaseBusiness className="size-4" />}
                options={specialties.map((specialty) => ({
                  label: specialty,
                  value: specialty,
                }))}
                onChange={(value) =>
                  setDraft((previous) => ({
                    ...previous,
                    specialite: value,
                  }))
                }
              />

              <SelectField
                id="filter-status"
                label="Statut de l'ouvrier"
                value={draft.statut}
                placeholder="Tous les statuts"
                options={[
                  { label: "Actif", value: "Actif" },
                  { label: "En congé", value: "En congé" },
                  { label: "Inactif", value: "Inactif" },
                ]}
                onChange={(value) =>
                  setDraft((previous) => ({
                    ...previous,
                    statut: value,
                  }))
                }
              />

              {/* ACTIONS */}

              <div className="flex flex-col gap-2 sm:flex-row xl:border-l xl:border-slate-200 xl:pl-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#F3D2B3] bg-[#FFF7ED] px-4 text-sm font-medium text-[#C2672B] transition-colors hover:border-[#E9B98F] hover:bg-[#FFEDD8]"
                >
                  <RotateCcw className="size-4" />
                  Réinitialiser
                </button>

                <button
                  type="button"
                  onClick={applyFilters}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#DCE8CF] bg-[#F4F8EF] px-4 text-sm font-semibold text-[#556B2F] transition-colors hover:border-[#C7D9B3] hover:bg-[#EAF2E0]"
                >
                  <Search className="size-4" />
                  Filtrer
                </button>
              </div>
            </div>
          </section>

          {/* CALENDRIER GÉNÉRIQUE */}

          <MonthCalendar<PlanningOuvrier>
            currentDate={currentDate}
            selectedDate={selectedDate}
            todayDate={todayString}
            days={days}
            weekdays={weekdays}
            events={filtered}
            getDateKey={dateKey}
            getEventDate={(planning) => planning.date}
            getEventId={(planning) => planning.id}
            renderEvent={renderPlanning}
            onDateSelect={setSelectedDate}
            onEventClick={setSelectedPlanning}
            onAddEvent={openCreate}
            onMonthChange={changeMonth}
            onToday={goToday}
          />

          {/* PLANNINGS DU JOUR SÉLECTIONNÉ */}

          <section className="rounded-2xl border border-[#E6EDE0] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Plannings du jour
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {dateLabel(selectedDate)}
                </p>
              </div>

              <span className="rounded-lg bg-[#F3F6EF] px-3 py-2 text-xs font-semibold text-[#556B2F]">
                {selectedDayPlannings.length} planning(s)
              </span>
            </div>

            {selectedDayPlannings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
                <CalendarDays className="mx-auto size-8 text-slate-300" />

                <p className="mt-2 text-sm font-medium text-slate-600">
                  Aucun planning pour cette journée.
                </p>

                <button
                  type="button"
                  onClick={() => openCreate(selectedDate)}
                  className="mt-3 text-sm font-semibold text-[#556B2F] hover:underline"
                >
                  Ajouter un planning
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {selectedDayPlannings.map((planning) => (
                  <button
                    key={planning.id}
                    type="button"
                    onClick={() => setSelectedPlanning(planning)}
                    className="rounded-xl border p-4 text-left transition hover:shadow-sm"
                    style={{
                      borderColor: `${planning.couleur}45`,
                      backgroundColor: `${planning.couleur}08`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {planning.ouvrierName}
                        </p>

                        <p
                          className="mt-1 text-xs font-semibold"
                          style={{ color: planning.couleur }}
                        >
                          {planning.poste}
                        </p>
                      </div>

                      <Clock3
                        className="size-4 shrink-0"
                        style={{ color: planning.couleur }}
                      />
                    </div>

                    <p className="mt-3 text-sm text-slate-600">
                      {timeLabel(planning.heureDebut)} –{" "}
                      {timeLabel(planning.heureFin)}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {planning.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>

      {/* ======================================================
          MODALE CRÉATION / MODIFICATION
      ====================================================== */}

      <BaseModal
        open={showModal}
        title={
          editingId !== null
            ? "Modifier le planning"
            : "Créer un planning"
        }
        description={
          editingId !== null
            ? "Modifiez les informations de cet événement."
            : "Planifier le travail d'un ouvrier."
        }
        onClose={closeModal}
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={createPlanning}
              disabled={formInvalid}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#556B2F] px-5 text-sm font-semibold text-white hover:bg-[#465A27] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingId !== null ? (
                <>
                  <BriefcaseBusiness className="size-4" />
                  Enregistrer les modifications
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Créer le planning
                </>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-5">

          {/* OUVRIER */}

          <SelectField
            id="planning-worker"
            label="Ouvrier"
            value={form.ouvrierId}
            icon={<UserRound className="size-4" />}
            options={ouvriers.map((worker) => ({
              label: worker.name,
              value: String(worker.id),
            }))}
            onChange={(value) => {
              const worker = ouvriers.find(
                (item) => item.id === Number(value)
              );

              setForm((previous) => ({
                ...previous,
                ouvrierId: value,
                poste: worker?.specialite ?? previous.poste,
              }));
            }}
          />

          {/* POSTE */}

          <SelectField
            id="planning-post"
            label="Poste / spécialité"
            value={form.poste}
            icon={<BriefcaseBusiness className="size-4" />}
            options={specialties.map((specialty) => ({
              label: specialty,
              value: specialty,
            }))}
            onChange={(value) => updateForm("poste", value)}
          />

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="planning-description"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="planning-description"
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              placeholder="Ajouter une description..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#91A875]"
            />
          </div>

          {/* DATES ET HORAIRES */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="planning-start-date"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Date de début
              </label>

              <input
                id="planning-start-date"
                type="date"
                value={form.startDate}
                onChange={(event) => {
                  const value = event.target.value;

                  setForm((previous) => ({
                    ...previous,
                    startDate: value,
                    endDate:
                      previous.endDate < value
                        ? value
                        : previous.endDate,
                  }));
                }}
                required
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875]"
              />
            </div>

            <div>
              <label
                htmlFor="planning-start-time"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Heure de début
              </label>

              <input
                id="planning-start-time"
                type="time"
                disabled={form.allDay}
                value={form.startTime}
                onChange={(event) =>
                  updateForm("startTime", event.target.value)
                }
                required={!form.allDay}
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875] disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="planning-end-date"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Date de fin
              </label>

              <input
                id="planning-end-date"
                type="date"
                min={form.startDate}
                value={form.endDate}
                onChange={(event) =>
                  updateForm("endDate", event.target.value)
                }
                required
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875]"
              />
            </div>

            <div>
              <label
                htmlFor="planning-end-time"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Heure de fin
              </label>

              <input
                id="planning-end-time"
                type="time"
                disabled={form.allDay}
                value={form.endTime}
                onChange={(event) =>
                  updateForm("endTime", event.target.value)
                }
                required={!form.allDay}
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#91A875] disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* TOUTE LA JOURNÉE */}

          <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 px-3 py-3">
            <input
              type="checkbox"
              checked={form.allDay}
              onChange={(event) =>
                updateForm("allDay", event.target.checked)
              }
              className="size-4 accent-[#556B2F]"
            />

            <span className="text-sm font-medium text-slate-700">
              Toute la journée
            </span>
          </label>

          {/* LIEU */}

          <div>
            <label
              htmlFor="planning-location"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Lieu
            </label>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                id="planning-location"
                value={form.lieu}
                onChange={(event) =>
                  updateForm("lieu", event.target.value)
                }
                placeholder="Ex. : Salle de pressage"
                className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-[#91A875]"
              />
            </div>
          </div>

          {/* COULEUR */}

          <ColorPicker
            label="Couleur du planning"
            value={form.couleur}
            colors={colors}
            onChange={(color) => updateForm("couleur", color)}
          />
        </div>
      </BaseModal>

      {/* ======================================================
          MODALE DÉTAILS
      ====================================================== */}

      <BaseModal
        open={Boolean(selectedPlanning)}
        title="Détails du planning"
        description="Informations relatives à l'événement sélectionné."
        onClose={() => setSelectedPlanning(null)}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setSelectedPlanning(null)}
              className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Fermer
            </button>

            <button
              type="button"
              disabled={!selectedPlanning}
              onClick={() => {
                if (selectedPlanning) openEdit(selectedPlanning);
              }}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#556B2F] text-sm font-semibold text-white hover:bg-[#465A27] disabled:opacity-50"
            >
              <BriefcaseBusiness className="size-4" />
              Modifier
            </button>
          </>
        }
      >
        {selectedPlanning && (
          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <div
                className="flex size-11 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${selectedPlanning.couleur}18`,
                }}
              >
                <CalendarDays
                  className="size-5"
                  style={{ color: selectedPlanning.couleur }}
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  {selectedPlanning.ouvrierName}
                </h3>

                <p
                  className="mt-1 text-sm font-semibold"
                  style={{ color: selectedPlanning.couleur }}
                >
                  {selectedPlanning.poste}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4 text-sm">

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />

                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="mt-0.5 font-medium text-slate-800">
                    {dateLabel(selectedPlanning.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-slate-400" />

                <div>
                  <p className="text-xs text-slate-500">Horaires</p>
                  <p className="mt-0.5 font-medium text-slate-800">
                    {timeLabel(selectedPlanning.heureDebut)} –{" "}
                    {timeLabel(selectedPlanning.heureFin)}
                  </p>
                </div>
              </div>

              {selectedPlanning.lieu && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-500">Lieu</p>
                    <p className="mt-0.5 font-medium text-slate-800">
                      {selectedPlanning.lieu}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 size-4 shrink-0 text-slate-400" />

                <div>
                  <p className="text-xs text-slate-500">Description</p>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    {selectedPlanning.description || "Aucune description."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
}
