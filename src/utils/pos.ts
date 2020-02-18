import { IPos } from '~/interfaces';

export const getScrollMousePos = (
  e: MouseEvent | React.MouseEvent,
  ref: HTMLElement,
): IPos => {
  return [e.pageX + ref.scrollLeft, e.pageY + ref.scrollTop];
};

export const getRelPos = (pos: IPos, ref: HTMLElement): IPos => {
  return [pos[0] + ref.scrollLeft, pos[1] + ref.scrollTop];
};
