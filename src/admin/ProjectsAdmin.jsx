import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";
import { btnPrimary, btnSecondary } from "../components/ui.jsx";

export default function ProjectsAdmin() {
  const { content, deleteProject, moveProject } = useStore();
  const { projects } = content;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = (p) => {
    if (window.confirm(`Delete "${p.title}"? This cannot be undone.`)) run(() => deleteProject(p.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">Projects</h1>
        <Link to="/admin/projects/new" className={btnPrimary}>+ New project</Link>
      </div>
      {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{error}</p>}

      {projects.length === 0 ? (
        <p className="mt-6">No projects yet. Add your first one.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {projects.map((p, i) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow">
              <div>
                <p className="font-bold text-slate-900">{p.title}</p>
                <p className="text-sm text-slate-500">{p.tech.join(", ") || "No technologies"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={btnSecondary} disabled={busy || i === 0} onClick={() => run(() => moveProject(p.id, -1))} aria-label={`Move ${p.title} up`}>↑</button>
                <button className={btnSecondary} disabled={busy || i === projects.length - 1} onClick={() => run(() => moveProject(p.id, 1))} aria-label={`Move ${p.title} down`}>↓</button>
                <Link to={`/admin/projects/${p.id}`} className={btnSecondary}>Edit</Link>
                <button disabled={busy} onClick={() => remove(p)} className="rounded border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
