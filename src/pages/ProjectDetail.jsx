import { Link, useParams } from "react-router-dom";
import { useStore } from "../store.jsx";
import NotFound from "./NotFound.jsx";

export default function ProjectDetail() {
  const { id } = useParams();
  const { content } = useStore();
  const project = content.projects.find((p) => p.id === id);
  if (!project) return <NotFound />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <Link to="/projects" className="text-indigo-700 hover:underline">← All projects</Link>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">{project.title}</h1>
      {project.image && <img src={project.image} alt={project.alt || project.title} className="mt-6 w-full rounded-xl border" />}
      <p className="mt-6 whitespace-pre-line text-lg">{project.details || project.description}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((t) => <li key={t} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{t}</li>)}
      </ul>
      <div className="mt-8 flex gap-3">
        {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="rounded bg-indigo-600 px-5 py-2 font-semibold text-white">Live demo</a>}
        {project.code && <a href={project.code} target="_blank" rel="noopener noreferrer" className="rounded border px-5 py-2 font-semibold">Source code</a>}
      </div>
    </article>
  );
}
