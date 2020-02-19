import {
  IRegistryMap,
  IRegistryItem,
  IOnSelection,
  ISelectionWorkerReq,
  ISelectionWorkerRes,
} from '~/interfaces';
// import { elementsCollide } from '~/utils';

import Worker from 'workerize-loader?inline!../workers/selection';
import { elementsCollide } from '~/utils';

export class Registry {
  public items: IRegistryMap = {};

  protected worker: Worker;

  constructor(
    public boxRef: React.RefObject<HTMLDivElement>,
    protected onSelection: IOnSelection,
  ) {}

  public register(item: IRegistryItem) {
    this.items[item.id] = item;
  }

  public unregister(id: number) {
    delete this.items[id];
  }

  protected onWorkerMessage = (e: MessageEvent) => {
    const data: ISelectionWorkerRes = e.data;

    if (data.type === 'response') {
      this.onSelection(data.selected);
    }
  };

  protected createWorker() {
    if (this.worker) {
      // this.worker.terminate();
      return null;
    }

    this.worker = new Worker();
    this.worker.addEventListener('message', this.onWorkerMessage);
  }

  public getSelected() {
    this.createWorker();

    this.worker.postMessage({
      type: 'request',
      map: this.items,
      boxRect: this.boxRef.current.getBoundingClientRect(),
    } as ISelectionWorkerReq);
  }
}
