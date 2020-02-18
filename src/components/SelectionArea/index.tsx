import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  CSSProperties,
  ReactNode,
} from 'react';

import { IPos, IContext } from '~/interfaces';
import { Registry, SelectionContext } from '~/models';
import {
  getScrollMousePos,
  toggleBox,
  isBoxVisible,
  updateBoxRect,
} from '~/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onSelection?: (items: any[]) => void;
  distance?: number;
  boxStyle?: CSSProperties;
  children?: ReactNode;
}

export const SelectionArea = ({
  distance,
  onSelection,
  boxStyle,
  style,
  children,
  ...props
}: Props) => {
  const [active, setActive] = useState(false);

  const ref = useRef<HTMLDivElement>();
  const boxRef = useRef<HTMLDivElement>();
  const boxVisible = useRef(false);

  const startPos = useRef<IPos>();
  const mousePos = useRef<IPos>(); // without scroll offset

  const provider = useMemo<IContext>(
    () => ({
      registry: new Registry(boxRef),
    }),
    [],
  );

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setActive(true);

    startPos.current = getScrollMousePos(e, ref.current);

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, []);

  const onMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', onWindowMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    startPos.current = null;
    mousePos.current = null;
    boxVisible.current = false;

    toggleBox(boxRef.current);
    setActive(false);
  }, []);

  const onWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      mousePos.current = [e.pageX, e.pageY];

      if (!boxVisible.current) {
        const visible = isBoxVisible(
          mousePos.current,
          startPos.current,
          ref.current,
          distance,
        );

        if (visible) {
          boxVisible.current = true;

          toggleBox(boxRef.current, true);
        }
      }

      resize();
    },
    [distance],
  );

  const onScroll = useCallback(() => {
    if (!active) return;
    resize();
  }, [active]);

  const resize = useCallback(() => {
    updateBoxRect(
      ref.current,
      boxRef.current,
      mousePos.current,
      startPos.current,
    );

    const selected = provider.registry.getSelected();

    if (selected !== false) {
      onSelection(selected);
    }
  }, [onSelection]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const _style = React.useMemo<CSSProperties>(() => {
    return {
      position: 'relative',
      ...style,
    };
  }, [style]);

  const _boxStyle = React.useMemo<CSSProperties>(() => {
    return {
      position: 'absolute',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      pointerEvents: 'none',
      ...boxStyle,
    };
  }, [boxStyle]);

  return (
    <div
      ref={ref}
      {...props}
      style={_style}
      onMouseDown={onMouseDown}
      onScroll={onScroll}
    >
      <SelectionContext.Provider value={provider}>
        {children}
      </SelectionContext.Provider>
      {active && <div ref={boxRef} style={_boxStyle} />}
    </div>
  );
};

SelectionArea.defaultProps = {
  distance: 10,
} as Props;
