import { useEffect, useState } from "react";
import { useStore } from "../store.jsx";
import { btnSecondary } from "../components/ui.jsx";

export default function MessagesAdmin() {
  const { fetchMessages, setMessageRead, deleteMessage } = useStore();
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");

  const reload = () => fetchMessages().then(setMessages).catch((e) => setError(e.message));
  useEffect(() => { reload(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (fn) => {
    setError("");
    try {
      await fn();
      await reload();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Messages</h1>
      {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{error}</p>}
      {messages === null && !error && <p className="mt-4">Loading…</p>}
      {messages && messages.length === 0 && <p className="mt-4">No messages yet.</p>}

      <ul className="mt-6 space-y-3">
        {messages?.map((m) => (
          <li key={m.id} className={`rounded-xl bg-white p-4 shadow ${m.read ? "" : "border-l-4 border-indigo-600"}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-bold text-slate-900">{m.name} <a className="font-normal text-indigo-700 underline" href={`mailto:${m.email}`}>{m.email}</a></p>
              <time className="text-sm text-slate-500" dateTime={m.created_at}>{new Date(m.created_at).toLocaleString()}</time>
            </div>
            <p className="mt-2 whitespace-pre-line">{m.message}</p>
            <div className="mt-3 flex gap-2">
              <button className={btnSecondary} onClick={() => run(() => setMessageRead(m.id, !m.read))}>{m.read ? "Mark unread" : "Mark read"}</button>
              <button
                className="rounded border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
                onClick={() => window.confirm("Delete this message?") && run(() => deleteMessage(m.id))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
