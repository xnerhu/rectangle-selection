# rectangle-selection

[![NPM](https://img.shields.io/npm/v/rectangle-selection.svg?style=flat-square)](https://www.npmjs.com/package/rectangle-selection)

An easy to use items selection.

![](https://qusly.app/public/screenshots/rectangle-selection.gif)

## Installing

```bash
$ npm install rectangle-selection --save-dev
```

## Example

```tsx
const App = () => {
  const items = React.useRef(Array.from(Array(10).keys()));

  const [selected, setSelected] = React.useState<number[]>([]);

  // Clear selected items on background click
  const onMouseDown = React.useCallback(() => {
    setSelected([]);
  }, []);

  const onSelection = React.useCallback((items: number[]) => {
    setSelected(items);
  }, []);

  const onItemMouseDown = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected([id]);
  };

  return (
    <SelectionArea
      onSelection={onSelection}
      onMouseDown={onMouseDown}
      style={{ width: 1000, height: 1000, background: '#eee' }}
    >
      {items.current.map(r => (
        <Selectable key={r} data={r}>
          {innerRef => (
            <div
              ref={innerRef}
              onMouseDown={onItemMouseDown(r)}
              style={{
                width: 64,
                height: 64,
                margin: 16,
                background: selected.indexOf(r) !== -1 ? 'green' : 'red',
              }}
            />
          )}
        </Selectable>
      ))}
    </SelectionArea>
  );
};
```

# Related

- [Qusly](https://www.github.com/qusly/qusly) - full-featured FTP client.
