import { useEffect, DependencyList, useCallback, useRef } from 'react';

type IWindowEvent = 'mousemove' | 'mouseup' | 'mousedown';

type ICallback = (...args: any[]) => any;

export const useWindowEvent = (
  type: IWindowEvent,
  cb: ICallback,
  deps?: DependencyList,
) => {
  const handler = useRef<ICallback>();

  const apply = useCallback(() => {
    window.addEventListener(type, handler.current);
  }, [type]);

  const remove = useCallback(() => {
    window.removeEventListener(type, handler.current);
  }, [type]);

  useEffect(() => {
    handler.current = cb;
  }, [cb, ...deps]);

  useEffect(() => {
    return () => {
      window.removeEventListener(type, handler.current);
    };
  }, [handler.current, type]);

  return { apply, remove };
};
