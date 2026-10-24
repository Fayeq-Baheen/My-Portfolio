import { useState } from "react";
import { useStore } from "../store.jsx";
import { Field, inputClass, btnPrimary } from "../components/ui.jsx";

const fields = [
  { name: "name", label: "Name" },
  { name: "role", label: "Role / title" },
  { name: "intro", label: "Short intro (home page)" },
  { name: "email", label: "Email" },
  { name: "github", label: "GitHub URL" },
  { name: "linkedin", label: "LinkedIn URL" },
];

export default function ProfileAdmin() {
  const { content, updateProfile } = useStore();
  const [form, setForm] = useState(content.profile);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const change = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email.";
    for (const k of ["github", "linkedin"]) {
      if (form[k] && !/^https?:\/\/\S+$/.test(form[k])) err[k] = "Must start with http:// or https://";
    }
    setErrors(err);
    if (Object.keys(err).length) return;
    setSaving(true);
    setSaveError("");
    try {
      await updateProfile(form);
      setSaved(true);
    } catch (e2) {
      setSaveError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900">Profile</h1>
      {fields.map((f) => (
        <Field key={f.name} id={f.name} label={f.label} error={errors[f.name]}>
          <input id={f.name} name={f.name} value={form[f.name]} onChange={change} className={inputClass} />
        </Field>
      ))}
      <Field id="about" label="About me (full text)">
        <textarea id="about" name="about" rows="8" value={form.about} onChange={change} className={inputClass} />
      </Field>
      <button disabled={saving} className={btnPrimary}>{saving ? "Saving..." : "Save profile"}</button>
      <p aria-live="polite" className="text-green-700">{saved && "Saved."}</p>
      {saveError && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{saveError}</p>}
    </form>
  );
}
