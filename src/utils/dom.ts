import { Pos } from '~/interfaces';

interface Style {
  [key: string]: string;
}

export const setElementStyle = (el: HTMLElement, style: Style) => {
  return Object.assign(el.style, style);
}

export const cursorDistance = (first: Pos, second: Pos) => {
  return Math.sqrt(Math.pow(first.top - second.top, 2) +
    Math.pow(first.left - second.left, 2));
}

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
