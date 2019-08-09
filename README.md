# rectangle-selection

[![NPM](https://img.shields.io/npm/v/rectangle-selection.svg?style=flat-square)](https://www.npmjs.com/package/rectangle-selection)

An easy to use items selection.

## Installing

```bash
$ npm install rectangle-selection
```

## Example

```tsx
let list: number[] = [];

for (let i = 0; i < 10; i++) {
  list.push(i);
}

interface SquareProps {
  selected?: boolean;
  size: number;
  onMouseDown?: (e: React.MouseEvent) => void;
}

const SquareComponent = ({ selected, size }: SquareProps) => {
  const style = {
    width: size,
    height: size,
    background: selected ? 'green' : 'red',
    margin: 16,
  };

  return <div style={style} />;
};

const Square = selectableItem<SquareProps>(SquareComponent); // HOC

const App = () => {
  const [selectedList, setSelected] = React.useState<number[]>([]);

  const onSelect = (items: number[]) => {
    setSelected(items);
  };

  const onCardMouseDown = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected([id]);
  };

  return (
    <div>
      <GlobalStyle />
      <SelectableGroup onSelect={onSelect}>
        {list.map(item => {
          const selected = selectedList.indexOf(item) !== -1;

          return (
            <Square
              key={item}
              itemKey={item}
              selected={selected}
              onMouseDown={onCardMouseDown(item)}
              size={32}
            />
          );
        })}
      </SelectableGroup>
    </div>
  );
};
```

## API

#### Methods

- `selectableItem<T>(component: React.ComponentType<T>): React.ComponentClass<T & Props>`

  A higher order component that allows `SelectableGroup` to access element's ref.

  ```tsx
  const Card = selectableItem<CardProps>(CardComponent);
  ```

### Components

- `SelectableGroup`

  **Props**

  | Name       | Type                 | Description                     |
  | ---------- | -------------------- | ------------------------------- |
  | `onSelect` | (items: any) => void | Invoked when items are selected |

# Related

- [Qusly](https://www.github.com/qusly/qusly) - full-featured FTP client.
