import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useStore } from "../store.jsx";
import { Field, inputClass, btnPrimary } from "../components/ui.jsx";

export default function Login() {
  const { login, isAdmin } = useStore();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email.trim(), pw);
      navigate("/admin");
    } catch {
      setError("Wrong email or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-extrabold text-slate-900">Admin login</h1>
        <Field id="email" label="Email">
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field id="pw" label="Password" error={error}>
          <input id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputClass} />
        </Field>
        <button disabled={busy} className={`${btnPrimary} w-full`}>{busy ? "Logging in..." : "Log in"}</button>
        <p className="text-center text-sm"><Link to="/" className="text-indigo-700 underline">← Back to site</Link></p>
      </form>
    </div>
  );
}
