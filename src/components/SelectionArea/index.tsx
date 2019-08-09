import * as React from 'react'

import { setElementStyle, cursorDistance, getBoxRect } from '~/utils';
import { Pos } from '~/interfaces';
import './style.css';

interface Props {
  children?: any;
}

interface State {
  active?: boolean;
  visible?: boolean;
}

export class SelectionArea extends React.PureComponent<Props, State> {
  public state: State = {
    active: false,
    visible: false,
  }

  private ref = React.createRef<HTMLDivElement>();

  private boxRef = React.createRef<HTMLDivElement>();

  private startPos: Pos;

  private mousePos: Pos;

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

  private onMouseDown = (e: React.MouseEvent) => {
    this.setState({ active: true, });
    this.addListeners();

    this.startPos = {
      top: e.pageY + this.ref.current.scrollTop,
      left: e.pageX + this.ref.current.scrollLeft,
    }
    
    this.updateMousePos(e);
  }

  private onMouseUp = () => {
    this.setState({ active: false });
    this.removeListeners();
  }

  private updateMousePos = (e: MouseEvent | React.MouseEvent) => {
    const { active } = this.state;

    if (active) {    
      this.mousePos = {
        top: e.pageY,
        left: e.pageX,
      }

      this.updateBox();
    }
  }

  private get relMousePos() {
    const { top, left } = this.mousePos;

    return {
      top: top + this.ref.current.scrollTop,
      left: left + this.ref.current.scrollLeft,
    }
  }

  private onScroll = (e: any) => {
    const { active } = this.state;
    if (active) this.updateBox();
  }

  private updateBox() {
    const { width, height, top, left } = getBoxRect(this.ref.current, this.relMousePos, this.startPos);

    setElementStyle(this.boxRef.current, {
      width: `${width}px`,
      height: `${height}px`,
      top: `${top}px`,
      left: `${left}px`,
    });

    this.setState({
      visible: cursorDistance(this.startPos, this.relMousePos) > 5,
    });
  }

  render() {
    const { active, visible } = this.state;
    const { children } = this.props;

    const boxStyle = {
      display: active && visible ? 'block' : 'none'
    }

    return (
      <div ref={this.ref} className='rectangle-selection-area' onMouseDown={this.onMouseDown} onScroll={this.onScroll}>
        <div ref={this.boxRef} className='rectangle-selection-box' style={boxStyle} />
        {children}
      </div>
    );
  }
};
