import React, {
  CSSProperties,
  ReactNode,
  PureComponent,
  createRef,
} from 'react';

import { updateBoxRect, toggleBox, isBoxVisible } from '~/utils/box';
import { IPos } from '~/interfaces';
import { isScrollbar, getScrollMousePos } from '~/utils/pos';
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

  private startMousePos: IPos;
  private currentMousePos: IPos;

  private active = false;
  private boxVisible = false;

  public componentWillUnmount() {
    this.removeListeners();
  }

  private removeListeners() {
    window.removeEventListener('mouseup', this.hide);
    window.removeEventListener('mousemove', this.onWindowMouseMove);
  }

  private resize() {
    const { onSelection } = this.props;

    updateBoxRect(
      this.ref.current,
      this.boxRef.current,
      this.startMousePos,
      this.currentMousePos,
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

    toggleBox(this.boxRef.current);
    this.removeListeners();
  };

  private onWindowMouseMove = (e: MouseEvent) => {
    const { distance, onSelectionStart } = this.props;

    this.currentMousePos = [e.pageX, e.pageY];

    if (!this.boxVisible) {
      const visible = isBoxVisible(
        this.currentMousePos,
        this.startMousePos,
        this.ref.current,
        distance,
      );

      if (visible) {
        this.boxVisible = true;

        toggleBox(this.boxRef.current, true);

        if (onSelectionStart) {
          onSelectionStart();
        }
      }
    }

    this.resize();
  };

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseDown } = this.props;

    if (onMouseDown) {
      onMouseDown(e);
    }

    if (e.button === 0 && !isScrollbar(this.ref.current, e)) {
      window.addEventListener('mouseup', this.hide);
      window.addEventListener('mousemove', this.onWindowMouseMove);

      this.startMousePos = getScrollMousePos(e, this.ref.current);
      this.active = true;
    }
  };

  private onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { onScroll } = this.props;

    if (onScroll) {
      onScroll(e);
    }

    if (this.active) {
      this.resize();
    }
  };

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
