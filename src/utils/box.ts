import { Pos } from '~/interfaces';

export const getBoxSize = (mouse: Pos, start: Pos) => {
  const width = Math.abs(mouse.left - start.left);
  const height = Math.abs(mouse.top - start.top);

  return { width, height };
}

export const getBoxPosition = (el: HTMLDivElement, mouse: Pos, start: Pos, width: number, height: number): Pos => {
  const rect = el.getBoundingClientRect();

  const top = mouse.top < start.top ? (start.top - height) : start.top;
  const left = mouse.left < start.left ? (start.left - width) : start.left;

  return {
    top: top - rect.top,
    left: left - rect.left,
  };
}

export const getBoxRect = (el: HTMLDivElement, mousePos: Pos, startPos: Pos) => {
  const size = getBoxSize(mousePos, startPos);
  const pos = getBoxPosition(el, mousePos, startPos, size.width, size.height);

  return { ...size, ...pos };
}
