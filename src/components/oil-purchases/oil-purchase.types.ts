export interface AchatHuile {
  id: number;
  compte: string;
  telephone: string;
  quantite: number;
  prixLitre: number;
}

export interface AchatHuileForm {
  compte: string;
  telephone: string;
  quantite: string;
  prixLitre: string;
}

export const FORMULAIRE_INITIAL: AchatHuileForm = {
  compte: '',
  telephone: '',
  quantite: '',
  prixLitre: '',
};