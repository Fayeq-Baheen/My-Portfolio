import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useStore } from "../store.jsx";

const items = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/profile", label: "Profile" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/settings", label: "Account" },
];

export default function AdminLayout() {
  const { logout } = useStore();
  const navigate = useNavigate();
  const cls = ({ isActive }) =>
    `block rounded px-3 py-2 font-medium ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-200"}`;

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="bg-white p-4 shadow md:min-h-screen md:w-60">
        <p className="mb-4 text-lg font-extrabold text-slate-900">Portfolio CMS</p>
        <ul className="flex flex-wrap gap-1 md:block md:space-y-1">
          {items.map((i) => <li key={i.to}><NavLink to={i.to} end={i.end} className={cls}>{i.label}</NavLink></li>)}
        </ul>
        <div className="mt-6 space-y-2 border-t pt-4 text-sm">
          <Link to="/" className="block text-indigo-700 underline">View site</Link>
          <button onClick={async () => { await logout(); navigate("/admin/login"); }} className="text-red-700 underline">Log out</button>
        </div>
      </aside>
      <section className="flex-1 p-4 md:p-8">
        <Outlet />
      </section>
    </div>
  );
}
