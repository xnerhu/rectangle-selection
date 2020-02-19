export interface IRegistryMap {
  [key: number]: IRegistryItem;
}

export interface IRegistryItem {
  rect: DOMRect;
  ref?: React.RefObject<HTMLDivElement>;
  id: number;
  data?: any;
}
