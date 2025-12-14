import { Routes, Route } from "react-router-dom";
import DashboardElder from "./pages/DashboardElder";
import DashboardCaretaker from "./pages/DashboardCaretaker";

export default function App() {
  // TEMPORARY: dummy session for testing dashboards
  const session = { user: { email: "elder@example.com", role: "elder" } };
  // const session = { user: { email: "caretaker@example.com", role: "caretaker" } };

  const role = session.user.role;
  const email = session.user.email;

  return (
    <Routes>
      <Route
        path="/"
        element={
          role === "caretaker" ? (
            <DashboardCaretaker />
          ) : (
            <DashboardElder userEmail={email} />
          )
        }
      />
    </Routes>
  );
}
