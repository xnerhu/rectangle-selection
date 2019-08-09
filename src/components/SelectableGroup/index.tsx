import * as React from 'react'

import { setElementStyle, cursorDistance, getBoxRect, elementsCollide } from '~/utils';
import { Pos, RegistryItem } from '~/interfaces';
import './style.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: (items: any) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => boolean | void;
  children?: any;
}

interface State {
  active?: boolean;
  visible?: boolean;
}

export class SelectableGroup extends React.PureComponent<Props, State> {
  public state: State = {
    active: false,
    visible: false,
  }

  private ref = React.createRef<HTMLDivElement>();

  private boxRef = React.createRef<HTMLDivElement>();

  private startPos: Pos;

  private mousePos: Pos;

  private registry: RegistryItem[] = [];

  private lastItemsCount = 0;

  public componentWillUnmount() {
    this.removeListeners();
  }

  private addListeners() {
    window.addEventListener('mousemove', this.updateMousePos);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  private removeListeners() {
    window.removeEventListener('mousemove', this.updateMousePos);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseDown } = this.props;

    if (onMouseDown) {
      const cancel = onMouseDown(e);
      if (cancel) return;
    }

    this.setState({ active: true, });
    this.addListeners();

    this.startPos = {
      top: e.pageY + this.ref.current.scrollTop,
      left: e.pageX + this.ref.current.scrollLeft,
    }
    
    this.updateMousePos(e);
    this.emitItems([]);
  }

  private onMouseUp = () => {
    this.setState({ active: false, visible: false });
    this.removeListeners();
  }

  private updateMousePos = (e: MouseEvent | React.MouseEvent) => {
    const { active } = this.state;

    if (active) {    
      this.mousePos = {
        top: e.pageY,
        left: e.pageX,
      }

      this.resize();
    }
  }

  private get relMousePos() {
    const { top, left } = this.mousePos;

    return {
      top: top + this.ref.current.scrollTop,
      left: left + this.ref.current.scrollLeft,
    }
  }

  private onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { onScroll } = this.props;
    const { active } = this.state;

    if (onScroll) onScroll(e);
    if (active) this.resize();
  }

  private resize() {
    const { width, height, top, left } = getBoxRect(this.ref.current, this.relMousePos, this.startPos);

    setElementStyle(this.boxRef.current, {
      width: `${width}px`,
      height: `${height}px`,
      top: `${top}px`,
      left: `${left}px`,
    });
    
    this.selectElements();
    this.setState({
      visible: cursorDistance(this.startPos, this.relMousePos) > 5,
    });
  }

  private selectElements() {
    const { active } = this.state;
    if (!active) return;

    const items: any[] = [];

    this.registry.forEach(item => {
      const collide = elementsCollide(item.ref, this.boxRef.current);
      if (collide) items.push(item.value);
    });

    this.emitItems(items);
  }

  private registerItem = (item: RegistryItem) => {
    this.registry.push(item);
  }

  private unregisterItem = (value: any) => {
    this.registry = this.registry.filter(r => r.value !== value);
  }

  private emitItems = (items: any[]) => {
    const { onSelect } = this.props;

    if (onSelect && this.lastItemsCount !== items.length) {
      onSelect(items);
      this.lastItemsCount = items.length;
    }
  }

  render() {
    const { active, visible } = this.state;
    const { style, children } = this.props;

    const boxStyle = {
      display: active && visible ? 'block' : 'none'
    }

    return (
      <div ref={this.ref} className='selection-container' onMouseDown={this.onMouseDown} onScroll={this.onScroll} style={style}>
        <div ref={this.boxRef} className='selection-rectangle' style={boxStyle} />
        {React.Children.map(children, child => {
          return React.cloneElement(child, {
            registerItem: this.registerItem,
            unregisterItem: this.unregisterItem
          });
        })}
      </div>
    );
  }
};