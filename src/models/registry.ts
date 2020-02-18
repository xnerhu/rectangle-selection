import { IRegistryMap, IRegistryItem } from '~/interfaces';
import { elementsCollide, arraysEqual } from '~/utils';

export class Registry {
  public items: IRegistryMap = {};

  protected lastSelected: any[];

  constructor(public boxRef: React.RefObject<any>) {}

  public register(item: IRegistryItem) {
    this.items[item.id] = item;
  }

  public unregister(id: number) {
    delete this.items[id];
  }

  public getSelected() {
    const selected = Object.values(this.items).filter(r => {
      return elementsCollide(r.ref.current, this.boxRef.current);
    });

    const same = arraysEqual(selected, this.lastSelected);

    if (!same) {
      this.lastSelected = selected;

      return selected.map(r => r.data);
    }

    return false;
  }
}
