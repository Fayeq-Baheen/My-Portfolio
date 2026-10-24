import { useState } from "react";
import { useStore } from "../store.jsx";
import { inputClass, btnPrimary } from "../components/ui.jsx";

export default function SkillsAdmin() {
  const { content, addSkill, removeSkill } = useStore();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    const skill = value.trim();
    if (!skill) return setError("Type a skill first.");
    if (await run(() => addSkill(skill))) setValue("");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold text-slate-900">Skills</h1>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <label htmlFor="skill" className="sr-only">New skill</label>
        <input id="skill" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass + " mt-0"} placeholder="e.g. TypeScript" />
        <button disabled={busy} className={btnPrimary}>Add</button>
      </form>
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 flex flex-wrap gap-2">
        {content.skills.map((s) => (
          <li key={s.id} className="flex items-center gap-2 rounded-full bg-indigo-100 py-1 pl-4 pr-2 font-medium text-indigo-800">
            {s.name}
            <button disabled={busy} onClick={() => run(() => removeSkill(s.id))} aria-label={`Remove ${s.name}`} className="rounded-full px-2 hover:bg-indigo-200">×</button>
          </li>
        ))}
      </ul>
      {content.skills.length === 0 && <p className="mt-4">No skills yet.</p>}
    </div>
  );
}
