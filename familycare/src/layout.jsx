// src/layout.jsx
export default function Layout({ children }) {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: 20 }}>
        <h1>FamilyCare App</h1>
      </header>
      <main>{children}</main>
      <footer style={{ marginTop: 20, fontSize: 12 }}>© 2025 FamilyCare</footer>
    </div>
  );
}
