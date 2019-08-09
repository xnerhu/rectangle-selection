import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { RegistryItem } from '~/interfaces';

interface Props {
  selected?: boolean;
}

interface Registry {
  registerItem: (item: RegistryItem) => void;
  unregisterItem: (ref: HTMLElement) => void;
}

interface State {
  selected: boolean;
}

export function createSelectable<T>(Wrapped: React.ComponentType<any>): React.ComponentClass<T & Props> {
  return class extends React.PureComponent<T & Props, State> {
    public state: State = {
      selected: false,
    };

    componentDidMount() {
      const ref = findDOMNode(this);
      const { registerItem } = this.props as unknown as Registry;

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

      return <Wrapped selected={selected} {...props} />
    }
  }
}
