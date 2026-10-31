
export interface Utilisateur {
  id: number;
  displayName: string;
  userName: string;
  mail: string;
  userCode: string;
  isActive: boolean;
}

export type StatusFilter = "Tous" | "Actifs" | "Inactifs" | "Avec email";
