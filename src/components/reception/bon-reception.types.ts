export interface BonReception {
  id: number;
  reference: string;
  compteId: number;
  name: string;
  mobile: string;
  quantityOil: number;
  quantityOlive: number;
  priceKg: number;
  price: number;
  payement: number;
  acompte: number;
  statusId: number;
  statusLib: string;
  caisse: number;
  natureId: number;
  priceOil: number;
  observation: string;
  typeHuile: string;
  isBaseCompte: boolean;
  dateCreation: string;
  dateDebProduction: string;
  dateFinProduction: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface StatusFilterItem {
  label: string;
  count: number;
}