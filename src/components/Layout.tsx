
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";

const menu = [
  { to: "/dashboard", label: "Panel" },
  { to: "/clientes", label: "Clientes" },
  { to: "/expedientes", label: "Expedientes" },
  { to: "/citas", label: "Agenda" },
  { to: "/facturas", label: "Facturación" },
  { to: "/cotizaciones", label: "Cotizaciones" },
];

export default function Layout() {
  const [open, setOpen] = useState(true);
  const { logout } = useAuth();
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <div
        className={clsx(
          "bg-slate-900 text-white transition-width duration-200",
          open ? "w-56" : "w-16"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <span className="font-bold tracking-wide">LexFlow</span>
          <button onClick={() => setOpen(!open)}>&#9776;</button>
        </div>
        <nav className="mt-6 space-y-2">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                clsx(
                  "block px-4 py-2 rounded hover:bg-slate-700",
                  isActive && "bg-slate-700"
                )
              }
            >
              {m.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="absolute bottom-4 left-4 text-sm text-red-400"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-end h-12 px-4 bg-white dark:bg-slate-900 shadow">
          {/* Future: currency switcher, dark mode toggle */}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
