import { IRegistryItem, IOnSelection, IRegisterOptions } from '~/interfaces';
import { elementsCollide } from '~/utils';

export class Registry {
  public map = new Map<number, IRegistryItem>();

  protected worker: Worker;

  protected selectedLength: number;

  protected timeout: NodeJS.Timeout;

  constructor(
    public boxRef: React.RefObject<HTMLDivElement>,
    public onSelection: IOnSelection,
    public options: IRegisterOptions = {},
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

    if (selected.length !== this.selectedLength && this.onSelection) {
      this.onSelection(selected);
      this.selectedLength = selected.length;
    }
  };

  public getSelected(force?: boolean) {
    const { fast } = this.options;

    if (fast || force) {
      clearTimeout(this.timeout);
    }

    if (this.options.fast && !force) {
      this.timeout = setTimeout(this.search, 1);
    } else {
      this.search();
    }
  }
}
