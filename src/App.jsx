import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./admin/Login.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import ProjectsAdmin from "./admin/ProjectsAdmin.jsx";
import ProjectForm from "./admin/ProjectForm.jsx";
import ProfileAdmin from "./admin/ProfileAdmin.jsx";
import SkillsAdmin from "./admin/SkillsAdmin.jsx";
import SettingsAdmin from "./admin/SettingsAdmin.jsx";
import MessagesAdmin from "./admin/MessagesAdmin.jsx";

function RequireAdmin({ children }) {
  const { isAdmin } = useStore();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

// HashRouter = URLs like /#/projects, so hosting needs no extra setup
function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-extrabold text-slate-900">
        Backend not connected yet
      </h1>
      <p className="mt-3">
        Create a <code>.env</code> file (copy <code>.env.example</code>) and set{" "}
        <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>,
        then restart <code>npm run dev</code>. Full steps are in the README.
      </p>
    </div>
  );
}

export default function App() {
  const { configured, loading, loadError } = useStore();

  if (!configured) return <SetupNotice />;
  if (loading)
    return (
      <p role="status" className="p-8 text-center">
        Loading…
      </p>
    );
  if (loadError)
    return (
      <div className="mx-auto max-w-xl p-8">
        <h1 className="text-2xl font-extrabold text-red-700">
          Could not load the site
        </h1>
        <p className="mt-3">{loadError}</p>
        <p className="mt-3 text-sm">
          Check your Supabase URL/key and that you ran{" "}
          <code>supabase/schema.sql</code>.
        </p>
      </div>
    );

  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="admin/login" element={<Login />} />
        <Route
          path="admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id" element={<ProjectForm />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
