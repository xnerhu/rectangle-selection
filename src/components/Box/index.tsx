import React, { forwardRef, CSSProperties } from 'react';

const style: CSSProperties = {
  position: 'absolute',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  display: 'none',
};

export const Box = forwardRef(
  (
    props: React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return <div ref={ref} style={{ ...style, ...props.style }} />;
  },
);
