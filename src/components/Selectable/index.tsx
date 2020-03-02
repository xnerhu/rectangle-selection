import React, {
  useContext,
  useRef,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';

import { SelectionContext } from '~/models';

interface Props {
  data: any;
  children?: (ref: React.Ref<any>) => JSX.Element;
}

let _id = 0;

export const Selectable = ({ data, children }: Props) => {
  const { registry } = useContext(SelectionContext);

  const ref = useRef<HTMLDivElement>();
  const id = useRef(_id++);

  const setRef = useCallback((el: any) => {
    ref.current = el;
  }, []);

  useEffect(() => {
    registry.register({
      id: id.current,
      data,
      ref,
    });

    return () => {
      registry.unregister(id.current);
    };
  }, [registry, data]);

  return children(setRef);
};
