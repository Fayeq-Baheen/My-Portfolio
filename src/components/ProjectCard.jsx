import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      {project.image ? (
        <img src={project.image} alt={project.alt || project.title} loading="lazy" className="h-48 w-full object-cover object-top" />
      ) : (
        <div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500">No image yet</div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
        <p className="mt-2 flex-1">{project.description}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{t}</li>
          ))}
        </ul>
        <Link to={`/projects/${project.id}`} className="mt-4 font-semibold text-indigo-700 hover:underline">
          View details →
        </Link>
      </div>
    </article>
  );
}
