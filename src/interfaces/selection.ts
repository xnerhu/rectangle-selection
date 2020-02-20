export interface ISelectionItem {
  ref: React.RefObject<HTMLElement>;
  data: any;
}

export type IOnSelection = (
  items: any[],
  selectedRefs: React.RefObject<HTMLDivElement>[],
  lastRefs: React.RefObject<HTMLDivElement>[],
) => void;
