import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-3">This page does not exist.</p>
      <Link to="/" className="mt-6 inline-block font-semibold text-indigo-700 underline">Back to home</Link>
    </div>
  );
}
