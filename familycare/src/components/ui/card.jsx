import React from "react";

// Main Card container
export function Card({ children, style, ...props }) {
  return (
    <div
      {...props}
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: 16,
        minWidth: 200,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Card header (optional)
export function CardHeader({ children, style, ...props }) {
  return (
    <div {...props} style={{ marginBottom: 8, ...style }}>
      {children}
    </div>
  );
}

// Card title
export function CardTitle({ children, style, ...props }) {
  return (
    <h3
      {...props}
      style={{
        fontSize: 18,
        fontWeight: 600,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h3>
  );
}

// Card content
export function CardContent({ children, style, ...props }) {
  return (
    <div {...props} style={{ marginTop: 4, ...style }}>
      {children}
    </div>
  );
}
