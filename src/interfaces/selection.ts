export interface ISelectionItem {
  ref: React.RefObject<HTMLElement>;
  data: any;
}

export type IOnSelection = (items: any[]) => void;

export type ISelectionMode = 'normal' | 'fast';
