import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase, isConfigured } from "./supabase.js";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const emptyProfile = { name: "", role: "", intro: "", email: "", github: "", linkedin: "", about: "" };

const toProject = (r) => ({
  id: r.id,
  title: r.title,
  description: r.description,
  details: r.details || "",
  image: r.image_url || "",
  alt: r.alt || "",
  tech: r.tech || [],
  live: r.live || "",
  code: r.code || "",
  position: r.position,
});

const toRow = (p) => ({
  title: p.title,
  description: p.description,
  details: p.details,
  image_url: p.image || null,
  alt: p.alt,
  tech: p.tech,
  live: p.live || null,
  code: p.code || null,
});

// Throws a readable error when Supabase reports one
function check({ error }) {
  if (error) throw new Error(error.message);
}
// Row-level security hides rows silently; make that visible
function mustChange({ data, error }) {
  check({ error });
  if (!data || data.length === 0) throw new Error("Nothing was saved. Please log in again and retry.");
}

export function StoreProvider({ children }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(isConfigured);
  const [loadError, setLoadError] = useState("");
  const [session, setSession] = useState(null);

  const load = useCallback(async () => {
    const [p, pr, s] = await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("projects").select("*").order("position", { ascending: true }),
      supabase.from("skills").select("*").order("position", { ascending: true }),
    ]);
    [p, pr, s].forEach(check);
    setProfile(p.data ? { ...emptyProfile, ...p.data } : emptyProfile);
    setProjects(pr.data.map(toProject));
    setSkills(s.data);
  }, []);

  useEffect(() => {
    if (!isConfigured) return;
    load()
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const api = {
    configured: isConfigured,
    loading,
    loadError,
    content: { profile, projects, skills },
    isAdmin: Boolean(session),

    // ---- auth ----
    async login(email, password) {
      check(await supabase.auth.signInWithPassword({ email, password }));
    },
    async logout() {
      await supabase.auth.signOut();
    },
    async changePassword(password) {
      check(await supabase.auth.updateUser({ password }));
    },

    // ---- profile ----
    async updateProfile(p) {
      const { name, role, intro, email, github, linkedin, about } = p;
      mustChange(
        await supabase.from("profile").upsert({ id: 1, name, role, intro, email, github, linkedin, about }).select()
      );
      await load();
    },

    // ---- projects ----
    async saveProject(p) {
      const row = toRow(p);
      if (p.id) {
        mustChange(await supabase.from("projects").update(row).eq("id", p.id).select());
      } else {
        const max = Math.max(0, ...projects.map((x) => x.position));
        mustChange(await supabase.from("projects").insert({ ...row, position: max + 1 }).select());
      }
      await load();
    },
    async deleteProject(id) {
      mustChange(await supabase.from("projects").delete().eq("id", id).select());
      await load();
    },
    async moveProject(id, dir) {
      const list = [...projects];
      const i = list.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return;
      [list[i], list[j]] = [list[j], list[i]];
      const results = await Promise.all(
        list
          .map((p, idx) => ({ id: p.id, position: idx + 1, old: p.position }))
          .filter((x) => x.position !== x.old)
          .map((x) => supabase.from("projects").update({ position: x.position }).eq("id", x.id).select())
      );
      results.forEach(mustChange);
      await load();
    },
    async uploadImage(blob) {
      const path = `${crypto.randomUUID()}.jpg`;
      check(await supabase.storage.from("project-images").upload(path, blob, { contentType: "image/jpeg" }));
      return supabase.storage.from("project-images").getPublicUrl(path).data.publicUrl;
    },

    // ---- skills ----
    async addSkill(name) {
      const max = Math.max(0, ...skills.map((s) => s.position));
      const { error } = await supabase.from("skills").insert({ name, position: max + 1 });
      if (error) throw new Error(error.code === "23505" ? "This skill already exists." : error.message);
      await load();
    },
    async removeSkill(id) {
      mustChange(await supabase.from("skills").delete().eq("id", id).select());
      await load();
    },

    // ---- messages ----
    async sendMessage({ name, email, message }) {
      check(await supabase.from("messages").insert({ name, email, message }));
    },
    async fetchMessages() {
      const res = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      check(res);
      return res.data;
    },
    async countUnread() {
      const res = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false);
      check(res);
      return res.count || 0;
    },
    async setMessageRead(id, read) {
      mustChange(await supabase.from("messages").update({ read }).eq("id", id).select());
    },
    async deleteMessage(id) {
      mustChange(await supabase.from("messages").delete().eq("id", id).select());
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
