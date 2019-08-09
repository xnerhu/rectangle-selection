import * as React from 'react';
import { findDOMNode } from 'react-dom';

interface Props {
  itemKey: any;
}

interface State {
  selected: boolean;
}

export function createSelectable<T>(Wrapped: React.ComponentType<T>): React.ComponentClass<T & Props> {
  return class extends React.PureComponent<T & Props, State> {
    componentDidMount() {
      const ref = findDOMNode(this);
      const { ...props } = this.props;
      const { registerItem } = this.props as any;

      registerItem({
        ref: ref as HTMLElement,
        value: props.itemKey,
      });
    }

    render() {
      const { ...props } = this.props;

      return <Wrapped {...props} />
    }
  }
}
