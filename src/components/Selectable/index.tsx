import { useSelectable } from '~/hooks/selectable';

type SetRef = (ref: HTMLElement) => void;

interface Props {
  data: any;
  children?: (setRef: SetRef) => JSX.Element;
}

export const Selectable = ({ data, children }: Props) => {
  const [setRef] = useSelectable(data);

  return children(setRef);
};
