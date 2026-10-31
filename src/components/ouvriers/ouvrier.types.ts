export interface Ouvrier {
  id: number;
  nom: string;
  telephone: string;
  cin: string;
  specialite: string;
  salaire: number;
  statut: string;
  dateAjout: string;
}

export interface OuvrierTableProps {
  ouvriers?: Ouvrier[];
  onEdit?: (ouvrier: Ouvrier) => void;
  onDelete?: (ouvrier: Ouvrier) => void;
}