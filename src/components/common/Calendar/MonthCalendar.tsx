
import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

export interface CalendarDay {
  date: Date;
  currentMonth: boolean;
}

interface MonthCalendarProps<T> {
  currentDate: Date;
  selectedDate: string;
  todayDate: string;
  days: CalendarDay[];
  weekdays: string[];
  events: T[];

  getDateKey: (date: Date) => string;
  getEventDate: (event: T) => string;
  getEventId: (event: T) => string | number;

  renderEvent: (event: T) => ReactNode;

  onDateSelect: (date: string) => void;
  onEventClick: (event: T) => void;
  onAddEvent: (date: string) => void;
  onMonthChange: (offset: number) => void;
  onToday: () => void;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril",
  "Mai", "Juin", "Juillet", "Août",
  "Septembre", "Octobre", "Novembre", "Décembre",
];

export function MonthCalendar<T>({
  currentDate,
  selectedDate,
  todayDate,
  days,
  weekdays,
  events,
  getDateKey,
  getEventDate,
  getEventId,
  renderEvent,
  onDateSelect,
  onEventClick,
  onAddEvent,
  onMonthChange,
  onToday,
}: MonthCalendarProps<T>) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* NAVIGATION DU CALENDRIER */}

      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToday}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Aujourd'hui
          </button>

          <button
            type="button"
            onClick={() => onMonthChange(-1)}
            aria-label="Mois précédent"
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => onMonthChange(1)}
            aria-label="Mois suivant"
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-4">
            <CalendarDays className="size-5 text-[#556B2F]" />

            <h2 className="text-lg font-bold capitalize text-slate-800 sm:text-xl">
              {MONTHS[currentDate.getMonth()]}{" "}
              {currentDate.getFullYear()}
            </h2>
          </div>
        </div>

        <span className="self-start rounded-lg bg-[#F3F6EF] px-3 py-2 text-xs font-medium text-[#556B2F] sm:self-center">
          Vue mensuelle
        </span>
      </div>

      {/* GRILLE */}

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">

          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
            {weekdays.map((day) => (
              <div
                key={day}
                className="border-r border-slate-200 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map(({ date, currentMonth }, index) => {
              const key = getDateKey(date);

              const dayEvents = events.filter(
                (event) => getEventDate(event) === key
              );

              const selected = selectedDate === key;
              const isToday = todayDate === key;

              return (
                <div
                  key={`${key}-${index}`}
                  onClick={() => onDateSelect(key)}
                  className={`group min-h-[145px] cursor-pointer border-b border-r border-slate-200 p-2 transition ${
                    !currentMonth
                      ? "bg-slate-50/60"
                      : "bg-white hover:bg-[#F8FAF5]"
                  } ${selected ? "bg-[#F5F8F0]" : ""}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-sm ${
                        !currentMonth ? "text-slate-300" : "text-slate-700"
                      } ${
                        isToday
                          ? "bg-[#556B2F] font-semibold text-white"
                          : ""
                      } ${
                        selected && !isToday
                          ? "ring-1 ring-[#A8BB8D]"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    {currentMonth && (
                      <button
                        type="button"
                        aria-label={`Ajouter un événement le ${key}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onAddEvent(key);
                        }}
                        className="flex size-6 items-center justify-center rounded-md text-slate-400 opacity-0 transition hover:bg-[#EAF2E0] hover:text-[#556B2F] group-hover:opacity-100 focus:opacity-100"
                      >
                        <Plus className="size-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <button
                        key={getEventId(event)}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="w-full min-w-0 text-left"
                      >
                        {renderEvent(event)}
                      </button>
                    ))}

                    {dayEvents.length > 3 && (
                      <span className="px-1 text-xs font-semibold text-[#556B2F]">
                        + {dayEvents.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
