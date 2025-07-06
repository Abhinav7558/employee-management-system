// ProtectedLayout.tsx
import Navbar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";

function ProtectedLayout() {
  const location = useLocation();
  const hiddenRoutes = ["/", "/login", "/register"];

  if (hiddenRoutes.includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedLayout;
