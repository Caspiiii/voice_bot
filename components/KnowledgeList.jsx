"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function KnowledgeList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEntries() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/knowledge", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load entries");
      }

      setEntries(data.entries);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function deactivate(id) {
    const response = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Could not deactivate entry");
      return;
    }

    loadEntries();
  }

  if (loading) {
    return <p className="statusLine">Loading entries...</p>;
  }

  if (error) {
    return <p className="errorLine">{error}</p>;
  }

  if (!entries.length) {
    return <p className="statusLine">No knowledge entries yet.</p>;
  }

  return (
    <div className="entryList">
      {entries.map((entry) => (
        <article className="entry" key={entry.id}>
          <div className="entryTop">
            <h3>{entry.title}</h3>
            <span className={entry.active ? "badge" : "badge off"}>
              {entry.active ? "Active" : "Inactive"}
            </span>
          </div>
          <p>{entry.content}</p>
          <div className="entryActions">
            <Link className="button" href={`/admin/edit/${entry.id}`}>
              Edit
            </Link>
            {entry.active ? (
              <button
                className="dangerButton"
                type="button"
                onClick={() => deactivate(entry.id)}
              >
                Deactivate
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

