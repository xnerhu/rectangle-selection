export interface IRegistryMap {
  [key: number]: IRegistryItem;
}

export interface IRegistryItem {
  ref: React.RefObject<any>;
  id: number;
  data?: any;
}
