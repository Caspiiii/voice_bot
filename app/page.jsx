import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Voice Bot MVP</p>
        <h1>Admin-editable answers for a caller-facing RAG bot.</h1>
        <p>
          Add knowledge, test questions, and use the answer API as the core
          endpoint for the voice layer.
        </p>
        <div className="topActions">
          <Link className="primaryButton" href="/customer">
            Start chat
          </Link>
          <Link className="ghostButton" href="/admin">
            Open admin
          </Link>
        </div>
      </section>
    </main>
  );
}
