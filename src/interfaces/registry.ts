export interface IRegistryItem {
  ref: React.RefObject<HTMLDivElement>;
  id: number;
  data?: any;
}

export interface IRegisterOptions {
  fast?: boolean;
}
