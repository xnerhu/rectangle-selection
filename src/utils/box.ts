import { IPos } from '~/interfaces';

import { cursorDistance } from './cursor';
import { getRelPos } from './pos';

export const getBoxSize = ([mouseX, mouseY]: IPos, [startX, startY]: IPos) => {
  const width = Math.abs(mouseX - startX);
  const height = Math.abs(mouseY - startY);

  return [width, height];
};

export const getBoxPos = (
  ref: HTMLElement,
  [mouseX, mouseY]: IPos,
  [startX, startY]: IPos,
  width: number,
  height: number,
): IPos => {
  const rect = ref.getBoundingClientRect();

  const x = mouseX < startX ? startX - width : startX;
  const y = mouseY < startY ? startY - height : startY;

  return [x - rect.left, y - rect.top];
};

export const toggleBox = (ref: HTMLElement, visible = false) => {
  Object.assign(ref.style, {
    display: visible ? 'block' : 'none',
  });
};

export const isBoxVisible = (
  rawMousePos: IPos,
  startPos: IPos,
  ref: HTMLElement,
  minDistance: number,
) => {
  if (!rawMousePos || !startPos) return false;

  const relMousePos = getRelPos(rawMousePos, ref);
  const distance = cursorDistance(startPos, relMousePos);

  return distance >= minDistance;
};

const limitSize = (size: number, parentSize: number, offset: number) => {
  return Math.min(size, parentSize - offset);
};

export const updateBoxRect = (
  ref: HTMLElement,
  boxRef: HTMLElement,
  rawMousePos: IPos,
  startPos: IPos,
) => {
  if (!startPos) return;

  const mousePos = getRelPos(rawMousePos, ref);

  const [width, height] = getBoxSize(mousePos, startPos);
  const [x, y] = getBoxPos(ref, mousePos, startPos, width, height);

  Object.assign(boxRef.style, {
    width: `${limitSize(width, ref.scrollWidth, x)}px`,
    height: `${limitSize(height, ref.scrollHeight, y)}px`,
    left: `${x}px`,
    top: `${y}px`,
  });
};
