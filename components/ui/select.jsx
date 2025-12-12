import React from 'react';

export function Select({ children, ...props }) {
  return <select {...props}>{children}</select>;
}

export function SelectTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectItem({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectValue({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
