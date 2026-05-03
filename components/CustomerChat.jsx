"use client";

import { useEffect, useRef, useState } from "react";

const starterMessages = [
  {
    role: "assistant",
    content: "Ask me anything and I will answer from the knowledge base."
  }
];

export default function CustomerChat() {
  const [messages, setMessages] = useState(starterMessages);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(event) {
    event.preventDefault();

    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) {
      return;
    }

    setQuestion("");
    setLoading(true);
    setMessages((current) => [
      ...current,
      { role: "user", content: cleanQuestion }
    ]);

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: cleanQuestion })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The bot could not answer right now.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error.message || "Something went wrong. I can take a message."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chatWindow" aria-label="Customer question chat">
      <div className="chatMessages">
        {messages.map((message, index) => (
          <div className={`messageRow ${message.role}`} key={`${message.role}-${index}`}>
            <div className="messageBubble">{message.content}</div>
          </div>
        ))}
        {loading ? (
          <div className="messageRow assistant">
            <div className="messageBubble thinking">Thinking...</div>
          </div>
        ) : null}
        <div ref={scrollRef} />
      </div>
      <form className="chatComposer" onSubmit={submit}>
        <input
          aria-label="Ask a question"
          className="chatInput"
          placeholder="Ask a question..."
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button className="chatSend" type="submit" disabled={loading || !question.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}

