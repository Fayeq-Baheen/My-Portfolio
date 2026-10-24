import { useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "../store.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  const { content } = useStore();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // New page = start at the top and close the mobile menu
  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  const cls = ({ isActive }) =>
    `block rounded px-3 py-2 font-medium ${isActive ? "bg-indigo-50 text-indigo-700" : "hover:text-indigo-600"}`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-white shadow">
        <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link to="/" className="font-bold text-indigo-600">{content.profile.name}</Link>
          <button className="md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
          <ul className={`${open ? "block" : "hidden"} absolute left-0 top-14 w-full bg-white p-3 shadow md:static md:flex md:w-auto md:gap-2 md:p-0 md:shadow-none`}>
            {links.map((l) => (
              <li key={l.to}><NavLink to={l.to} end={l.end} className={cls}>{l.label}</NavLink></li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t bg-slate-50 p-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {content.profile.name} ·{" "}
        <Link to="/admin" className="underline">Admin</Link>
      </footer>
    </div>
  );
}
