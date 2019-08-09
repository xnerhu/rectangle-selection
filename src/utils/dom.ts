interface Style {
  [key: string]: string;
}

export const setElementStyle = (el: HTMLElement, style: Style) => {
  return Object.assign(el.style, style);
}
