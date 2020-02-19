import {
  ISelectionWorkerReq,
  ISelectionWorkerRes,
  IRegistryItem,
} from '~/interfaces';
import { elementsCollide } from '~/utils/dom';

const ctx: Worker = self as any;

ctx.addEventListener('message', e => {
  const data: ISelectionWorkerReq = e.data;

  if (data.type === 'request') {
    const selected = Object.values(data.map)
      .filter((r: IRegistryItem) => {
        return elementsCollide(r.rect, data.boxRect);
      })
      .map(r => r.data);

    ctx.postMessage({
      type: 'response',
      selected,
    } as ISelectionWorkerRes);
  }
});
