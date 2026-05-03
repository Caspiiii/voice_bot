"use client";

import { useState } from "react";

export default function TestQuestion() {
  const [question, setQuestion] = useState("Where does Caspian live?");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, includeSources: true })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Test failed");
      }

      setAnswer(data.answer);
      setSources(data.retrieved_entries || []);
    } catch (testError) {
      setError(testError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2>Test question</h2>
      <div className="field">
        <label htmlFor="question">Question</label>
        <input
          className="input"
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="When are you open?"
        />
      </div>
      <button className="primaryButton" type="submit" disabled={loading}>
        {loading ? "Testing..." : "Test"}
      </button>
      {error ? <p className="errorLine">{error}</p> : null}
      {answer ? <div className="answerBox">{answer}</div> : null}
      {sources.length ? (
        <div className="sources">
          {sources.map((source) => (
            <div className="source" key={source.id}>
              <strong>{source.title}</strong>
              <small>Similarity: {Number(source.similarity).toFixed(3)}</small>
              <p>{source.content}</p>
            </div>
          ))}
        </div>
      ) : null}
    </form>
  );
}

