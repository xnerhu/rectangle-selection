import { ISelectionMode } from './selection';

export interface IRegistryItem {
  ref: React.RefObject<HTMLDivElement>;
  id: number;
  data?: any;
}

export interface IRegisterOptions {
  mode?: ISelectionMode;
}
