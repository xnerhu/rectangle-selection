import * as React from 'react';
import { findDOMNode } from 'react-dom';

interface Props {
  itemKey?: any;
}

interface State {
  selected: boolean;
}

export function selectableItem<T>(Wrapped: React.ComponentType<T>): React.ComponentClass<T & Props> {
  return class extends React.PureComponent<T & Props, State> {
    componentDidMount() {
      const ref = findDOMNode(this);
      const { registerItem, itemKey, key } = this.props as any;

      registerItem({
        ref: ref as HTMLElement,
        value: itemKey || key,
      });
    }

    componentWillUnmount() {
      const { itemKey, unregisterItem } = this.props as any;

      unregisterItem(itemKey);
    }

    render() {
      return <Wrapped {...this.props} />
    }
  }
}
