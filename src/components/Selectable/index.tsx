import React, { useContext, useRef, useCallback, useLayoutEffect } from 'react';

import { SelectionContext } from '~/models';

interface Props {
  data: any;
  children?: (ref: React.Ref<any>) => JSX.Element;
}

let _id = 0;

export const Selectable = (props: Props) => {
  const { registry } = useContext(SelectionContext);

  const id = useRef(_id++);
  const ref = useRef<any>();

  const setRef = useCallback((el: HTMLElement) => {
    ref.current = el;
  }, []);

  useLayoutEffect(() => {
    registry.register({ id: id.current, data: props.data, ref });

    return () => {
      registry.unregister(id.current);
    };
  }, [registry]);

  return props.children(setRef);
};
