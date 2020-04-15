import { useContext, useRef, useCallback, useEffect } from 'react';

import { RegistryContext } from '~/models/registry';

let _id = 0;

export const useSelectable = (data: any) => {
  const registry = useContext(RegistryContext);

  const id = useRef(_id++);

  const setRef = useCallback(
    (ref: HTMLDivElement) => {
      registry.register({
        id: id.current,
        data,
        ref,
      });
    },
    [registry, data],
  );

  useEffect(() => {
    return () => {
      registry.unregister(id.current);
    };
  }, [registry, data]);

  return [setRef];
};
