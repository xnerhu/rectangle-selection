import React, {
  useRef,
  useCallback,
  useMemo,
  CSSProperties,
  ReactNode,
  useLayoutEffect,
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
  onMouseDown,
  onScroll,
  children,
  ...props
}: Props) => {
  const active = React.useRef(false);

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

  const _onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseDown) {
      onMouseDown(e);
    }

    if (!active.current && e.button === 0) {
      window.addEventListener('mousemove', onWindowMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      startPos.current = getScrollMousePos(e, ref.current);
      active.current = true;
    }
  }, []);

  const onMouseUp = useCallback(() => {
    if (active.current) {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      startPos.current = null;
      mousePos.current = null;
      boxVisible.current = false;
      active.current = false;

      toggleBox(boxRef.current);
    }
  }, []);

  const onWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!active.current) return;

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

  const _onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (onScroll) onScroll(e);

    if (!active.current) return;
    resize();
  }, []);

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

  useLayoutEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [distance]);

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
      display: 'none',
      ...boxStyle,
    };
  }, [boxStyle]);

  return (
    <div
      ref={ref}
      {...props}
      style={_style}
      onMouseDown={_onMouseDown}
      onScroll={_onScroll}
    >
      <SelectionContext.Provider value={provider}>
        {children}
      </SelectionContext.Provider>
      <div ref={boxRef} style={_boxStyle} />
    </div>
  );
};

SelectionArea.defaultProps = {
  distance: 10,
} as Props;
