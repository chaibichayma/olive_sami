
export interface Ouvrier {
  id: number;
  name: string;
  specialite: string;
  statut: string;
}

export interface PlanningOuvrier {
  id: number;
  ouvrierId: number;
  ouvrierName: string;
  poste: string;
  description: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  couleur: string;
}

export interface PlanningForm {
  ouvrierId: string;
  poste: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  lieu: string;
  couleur: string;
}

export interface PlanningFilters {
  month: string;
  ouvrierId: string;
  specialite: string;
  statut: string;
}
