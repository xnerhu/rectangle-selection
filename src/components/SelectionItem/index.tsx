import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { RegistryItem } from '~/interfaces';

interface Props {
  registerItem: (item: RegistryItem) => void;
  unregisterItem: (ref: HTMLElement) => void;
  props: any;
}

interface State {
  selected: boolean;
}

export const createSelectable = (Component: any) => {
  return class extends React.PureComponent<Props, State> {
    public state: State = {
      selected: false,
    };

    componentDidMount() {
      const ref = findDOMNode(this);
      const { registerItem } = this.props;

      registerItem({
        ref: ref as HTMLElement,
        onSelect: this.onSelect,
      });
    }

    public onSelect = (selected: boolean) => {
      this.setState({ selected });
    }

    render() {
      const { ...props } = this.props;
      const { selected } = this.state;

      return <Component selected={selected} {...props} />
    }
  }
}
