export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
