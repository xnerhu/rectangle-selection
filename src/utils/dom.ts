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
