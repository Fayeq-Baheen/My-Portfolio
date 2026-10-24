import { useState } from "react";
import { useStore } from "../store.jsx";
import { Field, inputClass, btnPrimary } from "../components/ui.jsx";

export default function SettingsAdmin() {
  const { changePassword } = useStore();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8) return setMsg({ type: "error", text: "Use at least 8 characters." });
    setBusy(true);
    try {
      await changePassword(pw);
      setPw("");
      setMsg({ type: "ok", text: "Password changed." });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-extrabold text-slate-900">Account</h1>
      <Field id="pw" label="New password">
        <input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputClass} />
      </Field>
      <button disabled={busy} className={btnPrimary}>{busy ? "Saving..." : "Change password"}</button>
      <p aria-live="polite" className={msg.type === "error" ? "text-red-700" : "text-green-700"}>{msg.text}</p>
    </form>
  );
}
