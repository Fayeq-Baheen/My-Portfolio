import { useStore } from "../store.jsx";

export default function About() {
  const { profile, skills } = useStore().content;
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900">About me</h1>
      <p className="mt-6 whitespace-pre-line text-lg">{profile.about}</p>
      <h2 className="mt-10 text-xl font-bold text-slate-900">Skills</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {skills.map((s) => <li key={s.id} className="rounded-full bg-indigo-100 px-4 py-1 font-medium text-indigo-800">{s.name}</li>)}
      </ul>
    </div>
  );
}
