import { IRegistryMap } from './registry';

export interface ISelectionWorkerReq {
  type: 'request';
  map: IRegistryMap;
  boxRect: DOMRect;
}

export interface ISelectionWorkerRes {
  type: 'response';
  selected: any[];
}
