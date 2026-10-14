import { useState } from "react";
import { profile, projects, skills } from "./data.js";
import { useForm, ValidationError } from '@formspree/react';

// Create a free form at https://formspree.io and paste its URL here
const FORM_URL = "";

const links = ["home", "projects", "skills", "about", "contact"];

function Navbar() {
  
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-10 bg-white shadow">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <a href="#home" className="font-bold text-indigo-600">
          {profile.name}
        </a>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          Menu
        </button>
        <ul
          className={`${open ? "block" : "hidden"} absolute left-0 top-14 w-full bg-white p-4 md:static md:flex md:w-auto md:gap-6 md:p-0`}
        >
          {links.map((l) => (
            <li key={l} className="py-1">
              <a
                href={`#${l}`}
                onClick={() => setOpen(false)}
                className="capitalize hover:text-indigo-600"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg">
      <img
        src={project.image}
        alt={project.alt}
        loading="lazy"
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold border-b border-gray-300">
          {project.title}
        </h3>
        <p className="mt-4 text-justify h-80">{project.description}</p>
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center mt-2 inline-block rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 hover:shadow hover:shadow-lg hover:shadow-indigo-400"
        >
          Live demo
        </a>
      </div>
    </article>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [state, handleSubmit] = useForm("mwlvqzdq");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const input = "mt-1 w-full rounded border p-2";
  return (
    <form
      method="POST"
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-lg space-y-4"
    >
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={change}
          className={input}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={change}
          className={input}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={form.message}
          onChange={change}
          className={input}
        />
        {errors.message && (
          <p className="text-sm text-red-600">{errors.message}</p>
        )}
      </div>
      <button
        disabled={status === "sending"}
        className="rounded bg-indigo-600 px-5 py-2 text-white disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "success" && (
        <p className="text-green-700">Thank you! Your message was sent.</p>
      )}
      {status === "error" && (
        <p className="text-red-700">
          Could not send the message. Please email me directly.
        </p>
      )}
    </form>
  );
}

export default function App() {
  const section = "mx-auto max-w-5xl px-4 py-16";
  const title = "mb-8 text-3xl font-extrabold text-slate-900";
  return (
    <>
      <Navbar />
      <main>
        <section
          id="home"
          className="bg-slate-900 px-4 py-28 text-center text-white"
        >
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Hi, I'm {profile.name}
          </h1>
          <p className="mt-3 text-xl text-indigo-300">{profile.role}</p>
          <p className="mx-auto mt-4 max-w-xl">{profile.intro}</p>
          <a
            href="#projects"
            className="mt-8 inline-block rounded bg-indigo-600 px-6 py-3 font-semibold"
          >
            View my projects
          </a>
        </section>

        <section id="projects" className={section}>
          <h2 className={title}>Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>

        <section id="skills" className="bg-slate-50">
          <div className={section}>
            <h2 className={title}>Skills</h2>
            <ul className="flex flex-wrap gap-3">
              {skills.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-indigo-100 px-4 py-2 font-medium text-indigo-800"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="about" className={section}>
          <h2 className={title}>About</h2>
          <p className="max-w-2xl">{profile.about}</p>
        </section>

        <section id="contact" className="bg-slate-50">
          <div className={section}>
            <h2 className={title}>Contact</h2>
            <p className="mb-6 text-xl tracking-widest">
              <a
                className="text-indigo-700 text-decoration-none"
                href={`mailto:${profile.email}`}
              >
                Email
              </a>{" "}
              |{" "}
              <a
                className="text-indigo-700 text-decoration-none"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>{" "}
              |{" "}
              <a
                className="text-indigo-700 text-decoration-none"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </p>
            <Contact />
          </div>
        </section>
      </main>
      <footer className="p-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
