export interface VenteHuile {
  id: number;
  compte: string;
  telephone: string;
  quantite: number;
  prixLitre: number;
}

export interface VenteFormData {
  compte: string;
  telephone: string;
  quantite: string;
  prixLitre: string;
}