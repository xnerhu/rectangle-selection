import React, {
  useRef,
  useCallback,
  useMemo,
  CSSProperties,
  ReactNode,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react';

import { IPos, IContext, IOnSelection } from '~/interfaces';
import { Registry, SelectionContext } from '~/models';
import { Box } from '../Box';
import {
  getScrollMousePos,
  toggleBox,
  isBoxVisible,
  updateBoxRect,
  isScrollbar,
  useWindowEvent,
} from '~/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onSelection?: IOnSelection;
  onSelectionStart?: () => void;
  onSelectionEnd?: () => void;
  distance?: number;
  boxStyle?: CSSProperties;
  children?: ReactNode;
  fast?: boolean;
}

export const SelectionArea = ({
  distance,
  onSelection,
  onSelectionStart,
  onSelectionEnd,
  boxStyle,
  fast,
  style,
  onMouseDown,
  onScroll,
  children,
  ...props
}: Props) => {
  const active = useRef(false);

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

  const clear = React.useCallback(() => {
    if (boxVisible.current && onSelectionEnd) {
      onSelectionEnd();
    }

    active.current = false;
    boxVisible.current = false;
    startPos.current = null;
    mousePos.current = null;

    toggleBox(boxRef.current);
  }, [onSelectionEnd]);

  const resize = useCallback(() => {
    updateBoxRect(
      ref.current,
      boxRef.current,
      mousePos.current,
      startPos.current,
    );

    provider.registry.getSelected();
  }, []);

  const _onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseDown) onMouseDown(e);

    if (e.button === 0 && !isScrollbar(ref.current, e)) {
      onWindowMouseUp.apply();
      onWindowMouseMove.apply();

      startPos.current = getScrollMousePos(e, ref.current);
      active.current = true;
    }
  }, []);

  const onWindowMouseUp = useWindowEvent(
    'mouseup',
    () => {
      if (fast) {
        provider.registry.getSelected(true);
      }

      clear();

      onWindowMouseMove.remove();
      onWindowMouseUp.remove();
    },
    [fast, clear],
  );

  const onWindowMouseMove = useWindowEvent(
    'mousemove',
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

          if (onSelectionStart) {
            onSelectionStart();
          }
        }
      }

      resize();
    },
    [onSelectionStart],
  );

  const _onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (onScroll) onScroll(e);
    if (active.current) resize();
  }, []);

  useEffect(() => {
    provider.registry.onSelection = onSelection;
    provider.registry.options = { fast };
  }, [onSelection, fast]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return (
    <div
      ref={ref}
      {...props}
      onMouseDown={_onMouseDown}
      onScroll={_onScroll}
      style={{ position: 'relative', ...style }}
    >
      <SelectionContext.Provider value={provider}>
        {children}
      </SelectionContext.Provider>
      <Box ref={boxRef} style={boxStyle} />
    </div>
  );
};

SelectionArea.defaultProps = {
  distance: 10,
} as Props;
