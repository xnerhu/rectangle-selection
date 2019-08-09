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

export const elementsCollide = (first: HTMLElement, second: HTMLElement) => {
  const rect1 = first.getBoundingClientRect();
  const rect2 = second.getBoundingClientRect();

  return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}
