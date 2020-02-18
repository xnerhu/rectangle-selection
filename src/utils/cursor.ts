import { IPos } from '~/interfaces';

export const cursorDistance = (
  [firstX, firstY]: IPos,
  [secondX, secondY]: IPos,
) => {
  return Math.sqrt(
    Math.pow(firstY - secondY, 2) + Math.pow(firstX - secondX, 2),
  );
};
