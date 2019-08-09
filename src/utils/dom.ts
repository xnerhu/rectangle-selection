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

const checkRects = (rects: ClientRect, fileRects: ClientRect, horizontal = true) => {
  const sideA = horizontal ? 'left' : 'top';
  const sideB = horizontal ? 'right' : 'bottom';

  return rects[sideA] < fileRects[sideA] && rects[sideB] > fileRects[sideB] ||
    rects[sideA] > fileRects[sideA] && rects[sideB] < fileRects[sideB] ||
    rects[sideA] < fileRects[sideA] && fileRects[sideA] < rects[sideB] ||
    fileRects[sideB] > rects[sideA] && fileRects[sideB] < rects[sideB];
}

export const elementsCollide = (first: HTMLElement, second: HTMLElement) => {
  const firstRect = first.getBoundingClientRect();
  const secondRect = second.getBoundingClientRect();

  return checkRects(firstRect, secondRect) && checkRects(firstRect, secondRect, false);
}
