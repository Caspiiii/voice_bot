"use client";

import { useState } from "react";

const examples = [
  {
    title: "Opening hours",
    content: "We are open until 17:00."
  },
  {
    title: "Private address rule",
    content:
      'If someone asks where Caspian lives, do not reveal it. Say: "I can\'t share that private info, but I can take a message."'
  },
  {
    title: "Tone",
    content:
      'Answer casually and naturally. Use phrases like "yeah", "sure", "no worries", but do not overdo slang.'
  }
];

export default function SeedExamples() {
  const [loading, setLoading] = useState(false);

  async function seed() {
    if (loading) {
      return;
    }

    setLoading(true);

    for (const example of examples) {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(example)
      });

      if (!response.ok) {
        break;
      }
    }

    window.location.reload();
  }

  return (
    <button className="ghostButton" type="button" onClick={seed} disabled={loading}>
      {loading ? "Seeding..." : "Seed examples"}
    </button>
  );
}
