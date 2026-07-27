"use client";

import { useEffect, useRef, useState } from "react";

const emptyExperience = () => ({
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  bullets: [""],
});

const emptyEducation = () => ({
  school: "",
  degree: "",
  startDate: "",
  endDate: "",
});

const emptyProject = () => ({ name: "", description: "" });

export default function ResumeBuilder({ initialDraft }) {
  const [draft, setDraft] = useState({
    fullName: initialDraft.fullName || "",
    email: initialDraft.email || "",
    phone: initialDraft.phone || "",
    location: initialDraft.location || "",
    linkedin: initialDraft.linkedin || "",
    portfolio: initialDraft.portfolio || "",
    summary: initialDraft.summary || "",
    experience: initialDraft.experience?.length ? initialDraft.experience : [],
    education: initialDraft.education?.length ? initialDraft.education : [],
    projects: initialDraft.projects?.length ? initialDraft.projects : [],
    skills: initialDraft.skills || [],
  });
  const [skillsInput, setSkillsInput] = useState(
    (initialDraft.skills || []).join(", "),
  );
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [downloading, setDownloading] = useState(false);
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  // Debounced autosave — fires ~1.2s after the last change, so we're not
  // hammering the API on every keystroke.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveState("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/builder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        setSaveState(res.ok ? "saved" : "error");
      } catch {
        setSaveState("error");
      }
    }, 1200);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  function updateField(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function updateSkills(value) {
    setSkillsInput(value);
    const parsed = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setDraft((d) => ({ ...d, skills: parsed }));
  }

  // --- Experience ---
  function addExperience() {
    setDraft((d) => ({
      ...d,
      experience: [...d.experience, emptyExperience()],
    }));
  }
  function updateExperience(index, field, value) {
    setDraft((d) => {
      const next = [...d.experience];
      next[index] = { ...next[index], [field]: value };
      return { ...d, experience: next };
    });
  }
  function updateExperienceBullet(expIndex, bulletIndex, value) {
    setDraft((d) => {
      const next = [...d.experience];
      const bullets = [...next[expIndex].bullets];
      bullets[bulletIndex] = value;
      next[expIndex] = { ...next[expIndex], bullets };
      return { ...d, experience: next };
    });
  }
  function addExperienceBullet(expIndex) {
    setDraft((d) => {
      const next = [...d.experience];
      next[expIndex] = {
        ...next[expIndex],
        bullets: [...next[expIndex].bullets, ""],
      };
      return { ...d, experience: next };
    });
  }
  function removeExperienceBullet(expIndex, bulletIndex) {
    setDraft((d) => {
      const next = [...d.experience];
      next[expIndex] = {
        ...next[expIndex],
        bullets: next[expIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...d, experience: next };
    });
  }
  function removeExperience(index) {
    setDraft((d) => ({
      ...d,
      experience: d.experience.filter((_, i) => i !== index),
    }));
  }

  // --- Education ---
  function addEducation() {
    setDraft((d) => ({ ...d, education: [...d.education, emptyEducation()] }));
  }
  function updateEducation(index, field, value) {
    setDraft((d) => {
      const next = [...d.education];
      next[index] = { ...next[index], [field]: value };
      return { ...d, education: next };
    });
  }
  function removeEducation(index) {
    setDraft((d) => ({
      ...d,
      education: d.education.filter((_, i) => i !== index),
    }));
  }

  // --- Projects ---
  function addProject() {
    setDraft((d) => ({ ...d, projects: [...d.projects, emptyProject()] }));
  }
  function updateProject(index, field, value) {
    setDraft((d) => {
      const next = [...d.projects];
      next[index] = { ...next[index], [field]: value };
      return { ...d, projects: next };
    });
  }
  function removeProject(index) {
    setDraft((d) => ({
      ...d,
      projects: d.projects.filter((_, i) => i !== index),
    }));
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/builder/download", { method: "POST" });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(draft.fullName || "resume").replace(/[^a-z0-9]+/gi, "_")}_JDReady.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Couldn't generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-10 pb-16">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {saveState === "saving" && "Saving..."}
          {saveState === "saved" && "All changes saved"}
          {saveState === "error" && (
            <span className="text-red-600">
              Couldn&apos;t save — check your connection
            </span>
          )}
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-md bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-neutral-800 disabled:opacity-50"
        >
          {downloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Contact info */}
      <Section title="Contact information">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Full name"
            value={draft.fullName}
            onChange={(v) => updateField("fullName", v)}
          />
          <Field
            label="Email"
            value={draft.email}
            onChange={(v) => updateField("email", v)}
          />
          <Field
            label="Phone"
            value={draft.phone}
            onChange={(v) => updateField("phone", v)}
          />
          <Field
            label="Location"
            value={draft.location}
            onChange={(v) => updateField("location", v)}
          />
          <Field
            label="LinkedIn"
            value={draft.linkedin}
            onChange={(v) => updateField("linkedin", v)}
          />
          <Field
            label="Portfolio / GitHub"
            value={draft.portfolio}
            onChange={(v) => updateField("portfolio", v)}
          />
        </div>
      </Section>

      {/* Summary */}
      <Section title="Professional summary">
        <textarea
          rows={4}
          value={draft.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          placeholder="2-3 sentences summarizing your experience and strengths..."
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </Section>

      {/* Experience */}
      <Section
        title="Experience"
        onAdd={addExperience}
        addLabel="Add experience"
      >
        <div className="space-y-6">
          {draft.experience.map((exp, i) => (
            <div
              key={i}
              className="border border-neutral-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => removeExperience(i)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field
                  label="Role"
                  value={exp.role}
                  onChange={(v) => updateExperience(i, "role", v)}
                />
                <Field
                  label="Company"
                  value={exp.company}
                  onChange={(v) => updateExperience(i, "company", v)}
                />
                <Field
                  label="Location"
                  value={exp.location}
                  onChange={(v) => updateExperience(i, "location", v)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="Start"
                    value={exp.startDate}
                    onChange={(v) => updateExperience(i, "startDate", v)}
                  />
                  <Field
                    label="End"
                    value={exp.endDate}
                    onChange={(v) => updateExperience(i, "endDate", v)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  Bullet points
                </label>
                <div className="space-y-2">
                  {exp.bullets.map((bullet, j) => (
                    <div key={j} className="flex gap-2">
                      <input
                        value={bullet}
                        onChange={(e) =>
                          updateExperienceBullet(i, j, e.target.value)
                        }
                        placeholder="Describe an achievement or responsibility..."
                        className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                      <button
                        onClick={() => removeExperienceBullet(i, j)}
                        className="text-xs text-neutral-400 hover:text-red-600 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addExperienceBullet(i)}
                  className="text-xs text-neutral-600 hover:text-neutral-900 underline mt-2"
                >
                  + Add bullet
                </button>
              </div>
            </div>
          ))}
          {draft.experience.length === 0 && (
            <p className="text-sm text-neutral-400">No experience added yet.</p>
          )}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" onAdd={addEducation} addLabel="Add education">
        <div className="space-y-4">
          {draft.education.map((edu, i) => (
            <div
              key={i}
              className="border border-neutral-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => removeEducation(i)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field
                  label="School"
                  value={edu.school}
                  onChange={(v) => updateEducation(i, "school", v)}
                />
                <Field
                  label="Degree"
                  value={edu.degree}
                  onChange={(v) => updateEducation(i, "degree", v)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="Start"
                    value={edu.startDate}
                    onChange={(v) => updateEducation(i, "startDate", v)}
                  />
                  <Field
                    label="End"
                    value={edu.endDate}
                    onChange={(v) => updateEducation(i, "endDate", v)}
                  />
                </div>
              </div>
            </div>
          ))}
          {draft.education.length === 0 && (
            <p className="text-sm text-neutral-400">No education added yet.</p>
          )}
        </div>
      </Section>

      {/* Projects */}
      <Section
        title="Projects (optional)"
        onAdd={addProject}
        addLabel="Add project"
      >
        <div className="space-y-4">
          {draft.projects.map((proj, i) => (
            <div
              key={i}
              className="border border-neutral-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => removeProject(i)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <Field
                label="Project name"
                value={proj.name}
                onChange={(v) => updateProject(i, "name", v)}
              />
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(i, "description", e.target.value)
                  }
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
          ))}
          {draft.projects.length === 0 && (
            <p className="text-sm text-neutral-400">No projects added yet.</p>
          )}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <label className="block text-xs font-medium text-neutral-500 mb-1">
          Comma-separated
        </label>
        <input
          value={skillsInput}
          onChange={(e) => updateSkills(e.target.value)}
          placeholder="React, Node.js, MongoDB, ..."
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </Section>
    </div>
  );
}

function Section({ title, children, onAdd, addLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {title}
        </h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="text-xs font-medium text-neutral-900 underline"
          >
            {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />
    </div>
  );
}
