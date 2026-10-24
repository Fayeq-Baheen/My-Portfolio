import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";

export default function Dashboard() {
  const { content, countUnread } = useStore();
  const [unread, setUnread] = useState(null);

  useEffect(() => {
    countUnread().then(setUnread).catch(() => setUnread(null));
  }, [countUnread]);

  const stats = [
    { label: "Projects", value: content.projects.length, to: "/admin/projects" },
    { label: "Skills", value: content.skills.length, to: "/admin/skills" },
    { label: "Unread messages", value: unread ?? "–", to: "/admin/messages" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mt-2">Every change you make here is saved to the database and appears on the live site immediately.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="rounded-xl bg-white p-6 shadow hover:shadow-md">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-4xl font-extrabold text-slate-900">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
