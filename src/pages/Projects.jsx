import { useState } from "react";
import { useStore } from "../store.jsx";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Projects() {
  const { content } = useStore();
  const [filter, setFilter] = useState("All");
  const allTech = ["All", ...new Set(content.projects.flatMap((p) => p.tech))];
  const shown = filter === "All" ? content.projects : content.projects.filter((p) => p.tech.includes(filter));

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900">Projects</h1>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
        {allTech.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            aria-pressed={filter === t}
            className={`rounded-full px-4 py-1 text-sm font-semibold ${filter === t ? "bg-indigo-600 text-white" : "bg-slate-100 hover:bg-slate-200"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {shown.length === 0 ? <p className="mt-8">No projects found.</p> : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}
