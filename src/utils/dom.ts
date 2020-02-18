export const elementsCollide = (first: HTMLElement, second: HTMLElement) => {
  const rect1 = first.getBoundingClientRect();
  const rect2 = second.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
};
