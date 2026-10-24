import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";
import ProjectCard from "../components/ProjectCard.jsx";

export default function Home() {
  const { content } = useStore();
  const { profile, projects, skills } = content;
  return (
    <>
      <section className="bg-slate-900 px-4 py-24 text-center text-white">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Hi, I'm {profile.name}</h1>
        <p className="mt-3 text-xl text-indigo-300">{profile.role}</p>
        <p className="mx-auto mt-4 max-w-xl">{profile.intro}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/projects" className="rounded bg-indigo-600 px-6 py-3 font-semibold">View projects</Link>
          <Link to="/contact" className="rounded border border-white/40 px-6 py-3 font-semibold">Contact me</Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-extrabold text-slate-900">Featured projects</h2>
        {projects.length === 0 ? <p>No projects yet.</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>

      <section className="bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900">Skills</h2>
          <ul className="flex flex-wrap gap-3">
            {skills.map((s) => <li key={s.id} className="rounded-full bg-indigo-100 px-4 py-2 font-medium text-indigo-800">{s.name}</li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
