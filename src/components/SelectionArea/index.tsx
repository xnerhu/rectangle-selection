import * as React from 'react'

import { setElementStyle, cursorDistance } from '~/utils';
import { Pos } from '~/interfaces';
import './style.css';

interface Props {
  children?: any;
}

interface State {
  visible?: boolean;
}

export class SelectionArea extends React.PureComponent<Props, State> {
  public state: State = {
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
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  private removeListeners() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  private onMouseDown = (e: React.MouseEvent) => {
    this.startPos = this.mousePos = {
      top: e.pageY,
      left: e.pageX
    };

    this.setState({ visible: true });
    this.addListeners();

    this.updateBox();
  }

  private onMouseUp = () => {
    this.setState({ visible: false });
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

    this.setState({
      visible: cursorDistance(this.startPos, this.mousePos) > 5,
    });
  }

  public get size() {
    const width = Math.abs(this.mousePos.left - this.startPos.left);
    const height = Math.abs(this.mousePos.top - this.startPos.top);

    return { width, height };
  }

  render() {
    const { visible } = this.state;
    const { children } = this.props;

    const boxStyle = {
      display: visible ? 'block' : 'none'
    }

    return (
      <div ref={this.ref} className='rectangle-selection-area' onMouseDown={this.onMouseDown}>
        <div ref={this.boxRef} className='rectangle-selection-box' style={boxStyle} />
        {children}
      </div>
    );
  }
};
