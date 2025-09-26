export interface Tile {
  id: string;
  day: number;
  amount: number;
  saved: boolean;
  savedDate: string | null;
}

export interface ExtraSaving {
  id: string;
  amount: number;
  date: string;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  goal: number;
  duration: number;
  intensity: number;
  startDate: string;
  tiles: Tile[];
  extraSavings: ExtraSaving[];
  currency: 'LKR';
}

export interface Account {
  id: string;
  name: string;
  plans: Plan[];
}
