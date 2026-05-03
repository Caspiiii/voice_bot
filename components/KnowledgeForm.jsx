"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KnowledgeForm({ id }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    fetch(`/api/knowledge/${id}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load entry");
        }

        setTitle(data.entry.title);
        setContent(data.entry.content);
        setActive(Boolean(data.entry.active));
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const response = await fetch(id ? `/api/knowledge/${id}` : "/api/knowledge", {
      method: id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content, active })
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(data.error || "Save failed");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (loading) {
    return <section className="panel">Loading entry...</section>;
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          className="input"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Opening hours"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="content">Content</label>
        <textarea
          className="textarea"
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="We are open until 17:00."
          required
        />
      </div>
      <label className="checkboxLine">
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />
        Active
      </label>
      {error ? <p className="errorLine">{error}</p> : null}
      <button className="primaryButton" type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save entry"}
      </button>
    </form>
  );
}

