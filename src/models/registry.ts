import { IRegistryItem, IOnSelection, IRegisterOptions } from '~/interfaces';
import { elementsCollide } from '~/utils';

export class Registry {
  public map = new Map<number, IRegistryItem>();

  protected worker: Worker;

  protected lastSelected: any[] = [];

  protected timeout: NodeJS.Timeout;

  constructor(
    public boxRef: React.RefObject<HTMLDivElement>,
    public onSelection: IOnSelection,
    public options: IRegisterOptions = { mode: 'fast' },
  ) {}

  public register(item: IRegistryItem) {
    this.map.set(item.id, item);
  }

  public unregister(id: number) {
    this.map.delete(id);
  }

  protected search = () => {
    const boxRect = this.boxRef.current.getBoundingClientRect();

    const selected: any[] = [];

    this.map.forEach((r: IRegistryItem) => {
      const collides = elementsCollide(
        r.ref.current.getBoundingClientRect(),
        boxRect,
      );

      if (collides) {
        selected.push(r.data);
      }
    });

    if (selected.length !== this.lastSelected.length && this.onSelection) {
      this.onSelection(selected);
    }

    this.lastSelected = selected;
  };

  public getSelected() {
    if (this.options.mode === 'fast') {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.search, 1);
    } else {
      this.search();
    }
  }
}
