import React, {
  CSSProperties,
  ReactNode,
  PureComponent,
  createRef,
} from 'react';
import cursorDistance, { IPosition } from 'spatium';

import store from '~/store';
import { updateBoxRect } from '~/utils/box';
import { isOnScrollbar } from '~/utils/pos';
import { Registry } from '~/models/registry';
import { RegistryContext } from '~/models/registry';
import { Box } from '../Box';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onSelection?: (items: any[]) => void;
  onSelectionStart?: () => void;
  onSelectionEnd?: () => void;
  distance?: number;
  boxStyle?: CSSProperties;
  children?: ReactNode;
}

export class SelectionContext extends PureComponent<Props, {}> {
  private static defaultProps: Props = {
    distance: 10,
  };

  private ref = createRef<HTMLDivElement>();
  private boxRef = createRef<HTMLDivElement>();

  private registry = new Registry(this.boxRef);

  private startPos: IPosition;
  private currentPos: IPosition;

  private active = false;
  private boxVisible = false;

  public componentWillUnmount() {
    this.removeListeners();
  }

  private removeListeners() {
    window.removeEventListener('mouseup', this.hide);
    window.removeEventListener('mousemove', this.onWindowMouseMove);
  }

  private get currentRelPos(): IPosition {
    const ref = this.ref.current;
    const [x, y] = this.currentPos;

    return [x + ref.scrollLeft, y + ref.scrollTop];
  }

  private resize() {
    const { onSelection } = this.props;

    updateBoxRect(
      this.ref.current,
      this.boxRef.current,
      this.currentRelPos,
      this.startPos,
    );

    if (onSelection && this.boxVisible) {
      const selected = this.registry.getSelected();

      if (selected) {
        onSelection(selected);
      }
    }
  }

  private hide = () => {
    const { onSelectionEnd } = this.props;

    if (this.boxVisible && onSelectionEnd) {
      onSelectionEnd();
    }

    this.active = false;
    this.boxVisible = false;
    store.currentRegistry = null;

    this.toggleBox();
    this.removeListeners();
  };

  private onWindowMouseMove = (e: MouseEvent) => {
    const { distance, onSelectionStart } = this.props;

    this.currentPos = [e.pageX, e.pageY];

    if (this.boxVisible) {
      return this.resize();
    }

    const visible =
      cursorDistance(this.startPos, this.currentRelPos) >= distance;

    if (visible) {
      this.boxVisible = true;
      this.toggleBox(true);
      this.resize();

      if (onSelectionStart) {
        onSelectionStart();
      }
    }
  };

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseDown } = this.props;
    const ref = this.ref.current;

    if (onMouseDown) {
      onMouseDown(e);
    }

    if (e.button === 0 && !isOnScrollbar(e, ref)) {
      this.removeListeners();
      window.addEventListener('mouseup', this.hide);
      window.addEventListener('mousemove', this.onWindowMouseMove);

      this.startPos = [e.pageX + ref.scrollLeft, e.pageY + ref.scrollTop];
      this.active = true;
      store.currentRegistry = this.registry;
    }
  };

  private onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { onScroll } = this.props;

    if (onScroll) onScroll(e);
    if (this.active) this.resize();
  };

  private toggleBox(visible?: boolean) {
    this.boxRef.current.style.display = visible ? 'block' : 'none';
  }

  render() {
    const { distance, style, children, onSelection, ...props } = this.props;

    return (
      <div
        ref={this.ref}
        onMouseDown={this.onMouseDown}
        onScroll={this.onScroll}
        style={{ position: 'relative', ...style }}
        {...props}
      >
        <RegistryContext.Provider value={this.registry}>
          {children}
        </RegistryContext.Provider>
        <Box ref={this.boxRef} />
      </div>
    );
  }
}
