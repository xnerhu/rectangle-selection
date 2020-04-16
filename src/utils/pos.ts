import React from 'react';

export const isOnScrollbar = (
  e: React.MouseEvent | MouseEvent,
  ref: HTMLElement,
) => {
  const rect = ref.getBoundingClientRect();
  return e.pageX + ref.scrollLeft - rect.left >= ref.scrollWidth;
};

export const elementsCollide = (first: DOMRect, second: DOMRect) => {
  return !(
    first.right < second.left ||
    first.left > second.right ||
    first.bottom < second.top ||
    first.top > second.bottom
  );
};
