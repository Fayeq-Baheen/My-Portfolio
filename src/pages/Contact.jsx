import { useState } from "react";
import { useStore } from "../store.jsx";
import { useForm, ValidationError } from '@formspree/react';
import { Field, inputClass, btnPrimary } from "../components/ui.jsx";

export default function Contact() {
  const { content, sendMessage } = useStore();
  const { profile } = content;
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  }); // "website" = spam trap
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); 
  const [state, handleSubmit] = useForm("mwlvqzdq");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // const submit = async (e) => {
  //   e.preventDefault();
  //   const err = {};
  //   if (form.name.trim().length < 2) err.name = "Please enter your name.";
  //   if (!/^\S+@\S+\.\S+$/.test(form.email))
  //     err.email = "Please enter a valid email.";
  //   if (form.message.trim().length < 10)
  //     err.message = "Message must be at least 10 characters.";
  //   setErrors(err);
  //   if (Object.keys(err).length) return;

  //   // Bots fill the hidden field: pretend success, send nothing
  //   if (form.website) return setStatus("success");

  //   setStatus("sending");
  //   try {
  //     handleSubmit()
  //     await sendMessage({
  //       name: form.name.trim(),
  //       email: form.email.trim(),
  //       message: form.message.trim(),
  //     });
  //     setStatus("success");
  //     setForm({ name: "", email: "", message: "", website: "" });

  //   } catch {
  //     setStatus("error");
  //   }
  // };

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <h1 className="text-3xl font-extrabold text-slate-900">Contact</h1>
      <p className="mt-4 text-2xl tracking-wider">
        <a
          className="text-indigo-700 "
          href={`mailto:${profile.email}`}
        >
          Email
        </a>{" "}
        |{" "}
        <a
          className="text-indigo-700 "
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{" "}
        |{" "}
        <a
          className="text-indigo-700 "
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={change}
            className={inputClass}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            className={inputClass}
          />
        </Field>
        <Field id="message" label="Message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={form.message}
            onChange={change}
            className={inputClass}
          />
        </Field>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Leave this empty</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={change}
          />
        </div>
        <button disabled={status === "sending"} className={btnPrimary}>
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        <div aria-live="polite">
          {status === "success" && (
            <p className="text-green-700">Thank you! Your message was sent.</p>
          )}
          {status === "error" && (
            <p className="text-red-700">
              Could not send the message. Please email me directly.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
