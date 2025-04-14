
export type ItemCategory = 
  | 'heavy' 
  | 'cold' 
  | 'fragile' 
  | 'chemical' 
  | 'produce'
  | 'meat'
  | 'regular';

export interface Item {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory[];
  position: 'bottom' | 'middle' | 'top';
}

export interface Bag {
  id: string;
  name: string;
  items: Item[];
}

export interface BagSystem {
  bags: Bag[];
  currentItemIndex: number;
  totalItems: number;
}
