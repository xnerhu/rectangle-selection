import * as React from 'react'

import { setElementStyle } from '~/utils';
import { Pos } from '~/interfaces';
import './style.css';

interface Props {
  children?: any;
}

interface State {
  activated?: boolean;
}

export class SelectionArea extends React.PureComponent<Props, State> {
  public state: State = {
    activated: false,
  }

  private ref = React.createRef<HTMLDivElement>();

  private boxRef = React.createRef<HTMLDivElement>();

  private startPos: Pos;

  private mousePos: Pos;

  public componentWillUnmount() {
    this.removeListeners();
  }

  private addListeners() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  private removeListeners() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  private onMouseDown = (e: React.MouseEvent) => {
    this.startPos = {
      top: e.pageY,
      left: e.pageX
    }

    this.setState({ activated: true });
    this.addListeners();

    this.updateBox();
  }

  private onMouseUp = () => {
    this.setState({ activated: false });
    this.removeListeners();
  }

  private onMouseMove = (e: MouseEvent) => {
    this.mousePos = {
      top: e.pageY + this.ref.current.scrollTop,
      left: e.pageX + this.ref.current.scrollLeft,
    }
    
    this.updateBox();
  }

  private updateBox() {
    const { activated } = this.state;

    if (activated) {
      const { width, height } = this.size;
      const rect = this.ref.current.getBoundingClientRect();
  
      const top = this.mousePos.top < this.startPos.top ? (this.startPos.top - height) : this.startPos.top;
      const left = this.mousePos.left < this.startPos.left ? (this.startPos.left - width) : this.startPos.left;
  
      setElementStyle(this.boxRef.current, {
        width: `${width}px`,
        height: `${height}px`,
        top: `${top - rect.top}px`,
        left: `${left - rect.left}px`,
      });
    }
  }

  public get size() {
    const width = Math.abs(this.mousePos.left - this.startPos.left);
    const height = Math.abs(this.mousePos.top - this.startPos.top);

    return { width, height };
  }

  render() {
    const { activated } = this.state;
    const { children } = this.props;

    const boxStyle = {
      display: activated ? 'block' : 'none'
    }

    return (
      <div ref={this.ref} className='rectangle-selection-area' onMouseDown={this.onMouseDown}>
        <div ref={this.boxRef} className='rectangle-selection-box' style={boxStyle} />
        {children}
      </div>
    );
  }
};
