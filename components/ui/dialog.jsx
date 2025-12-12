import React from 'react';

export function Dialog({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function DialogContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function DialogHeader({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function DialogTitle({ children, ...props }) {
  return <h3 {...props}>{children}</h3>;
}

export function DialogTrigger({ children, ...props }) {
  return <button {...props}>{children}</button>;
}
