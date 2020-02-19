import { IRegistryMap, IRegistryItem } from '~/interfaces';
import { elementsCollide } from '~/utils';

export class Registry {
  public items: IRegistryMap = {};

  constructor(public boxRef: React.RefObject<any>) {}

  public register(item: IRegistryItem) {
    this.items[item.id] = item;
  }

  public unregister(id: number) {
    delete this.items[id];
  }

  public getSelected() {
    return Object.values(this.items).filter(r => {
      return elementsCollide(r.ref.current, this.boxRef.current);
    });
  }
}
