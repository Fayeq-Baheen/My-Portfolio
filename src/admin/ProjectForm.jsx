import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useStore } from "../store.jsx";
import { Field, inputClass, btnPrimary, btnSecondary, resizeImage } from "../components/ui.jsx";

const empty = { title: "", description: "", details: "", image: "", alt: "", tech: "", live: "", code: "" };
const isUrl = (v) => /^https?:\/\/\S+$/.test(v);

export default function ProjectForm() {
  const { id } = useParams();
  const { content, saveProject, uploadImage } = useStore();
  const navigate = useNavigate();
  const existing = content.projects.find((p) => p.id === id);

  const [form, setForm] = useState(existing ? { ...existing, tech: existing.tech.join(", ") } : empty);
  const [errors, setErrors] = useState({});
  const [imgError, setImgError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (id && !existing) return <p>Project not found. <Link className="underline" to="/admin/projects">Back</Link></p>;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImgError("");
      setUploading(true);
      const url = await uploadImage(await resizeImage(file));
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setImgError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.title.trim()) err.title = "Title is required.";
    if (!form.description.trim()) err.description = "Short description is required.";
    if (form.live && !isUrl(form.live)) err.live = "Must start with http:// or https://";
    if (form.code && !isUrl(form.code)) err.code = "Must start with http:// or https://";
    if (form.image && !form.image.startsWith("/") && !isUrl(form.image))
      err.image = "Use an https:// link or upload a file.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setSaving(true);
    setSaveError("");
    try {
      await saveProject({
        ...form,
        id: existing ? existing.id : undefined,
        title: form.title.trim(),
        description: form.description.trim(),
        tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      });
      navigate("/admin/projects");
    } catch (e2) {
      setSaveError(e2.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900">{existing ? "Edit project" : "New project"}</h1>

      <Field id="title" label="Title *" error={errors.title}>
        <input id="title" name="title" value={form.title} onChange={change} className={inputClass} />
      </Field>
      <Field id="description" label="Short description *" error={errors.description} hint="Shown on the project card.">
        <input id="description" name="description" value={form.description} onChange={change} className={inputClass} />
      </Field>
      <Field id="details" label="Full details" hint="Shown on the project's own page.">
        <textarea id="details" name="details" rows="6" value={form.details} onChange={change} className={inputClass} />
      </Field>
      <Field id="tech" label="Technologies" hint="Separate with commas: React, Tailwind, API">
        <input id="tech" name="tech" value={form.tech} onChange={change} className={inputClass} />
      </Field>

      <Field id="image" label="Screenshot" error={errors.image || imgError} hint="Paste an image link, or upload a file below (it is resized and stored in your database storage).">
        <input id="image" name="image" value={form.image} onChange={change} className={inputClass} />
      </Field>
      <input type="file" accept="image/*" onChange={upload} disabled={uploading} aria-label="Upload screenshot" />
      {uploading && <p role="status" className="text-sm">Uploading…</p>}
      {form.image && (
        <div>
          <img src={form.image} alt="Preview" className="mt-2 max-h-48 rounded border" />
          <button type="button" onClick={() => setForm({ ...form, image: "" })} className="mt-1 text-sm text-red-700 underline">Remove image</button>
        </div>
      )}
      <Field id="alt" label="Image description (alt text)" hint="Describe what the screenshot shows, for screen readers.">
        <input id="alt" name="alt" value={form.alt} onChange={change} className={inputClass} />
      </Field>

      <Field id="live" label="Live demo URL" error={errors.live}>
        <input id="live" name="live" value={form.live} onChange={change} className={inputClass} placeholder="https://..." />
      </Field>
      <Field id="code" label="Source code URL" error={errors.code}>
        <input id="code" name="code" value={form.code} onChange={change} className={inputClass} placeholder="https://github.com/..." />
      </Field>

      {saveError && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{saveError}</p>}
      <div className="flex gap-3">
        <button disabled={saving || uploading} className={btnPrimary}>{saving ? "Saving..." : "Save project"}</button>
        <Link to="/admin/projects" className={btnSecondary}>Cancel</Link>
      </div>
    </form>
  );
}
