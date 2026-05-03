"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

export default function CustomerVoice() {
  const vapiRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Start a voice chat and ask me a question."
    }
  ]);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    return () => {
      vapiRef.current?.stop();
      vapiRef.current?.removeAllListeners();
    };
  }, []);

  function addMessage(role, content) {
    setMessages((current) => [...current, { role, content }]);
  }

  function wireEvents(vapi) {
    vapi.on("call-start", () => {
      setStatus("live");
      setError("");
    });

    vapi.on("call-end", () => {
      setStatus("idle");
      setVolume(0);
    });

    vapi.on("volume-level", (level) => {
      setVolume(Math.max(0, Math.min(1, Number(level) || 0)));
    });

    vapi.on("message", (message) => {
      if (message?.type !== "transcript" || message?.transcriptType !== "final") {
        return;
      }

      const transcript = message.transcript?.trim();

      if (!transcript) {
        return;
      }

      addMessage(message.role === "user" ? "user" : "assistant", transcript);
    });

    vapi.on("error", (event) => {
      setStatus("idle");
      setError(event?.message || "Voice chat could not start.");
    });
  }

  async function startCall() {
    if (!publicKey || !assistantId) {
      setError("Voice chat needs Vapi public key and assistant ID.");
      return;
    }

    try {
      setStatus("connecting");
      setError("");

      if (!vapiRef.current) {
        const vapi = new Vapi(publicKey);
        wireEvents(vapi);
        vapiRef.current = vapi;
      }

      await vapiRef.current.start(assistantId);
    } catch (event) {
      setStatus("idle");
      setError(event?.message || "Voice chat could not start.");
    }
  }

  async function stopCall() {
    await vapiRef.current?.stop();
    setStatus("idle");
    setVolume(0);
  }

  const isConfigured = Boolean(publicKey && assistantId);
  const isLive = status === "live";
  const isConnecting = status === "connecting";

  return (
    <section className="voiceWindow" aria-label="Voice bot">
      <div className="voiceStage">
        <div className={isLive ? "voiceOrb live" : "voiceOrb"}>
          <span style={{ transform: `scale(${1 + volume * 0.35})` }} />
        </div>
        <div>
          <p className="eyebrow">Voice bot</p>
          <h2>{isLive ? "Listening now" : "Talk to the bot"}</h2>
          <p>
            {isConfigured
              ? "Use your microphone and get spoken answers from the same knowledge base."
              : "Vapi is not configured on this deployment yet."}
          </p>
        </div>
        <div className="voiceActions">
          {isLive || isConnecting ? (
            <button className="dangerButton" type="button" onClick={stopCall}>
              End call
            </button>
          ) : (
            <button
              className="primaryButton"
              type="button"
              onClick={startCall}
              disabled={!isConfigured}
            >
              Start voice chat
            </button>
          )}
        </div>
      </div>
      {error ? <p className="errorLine">{error}</p> : null}
      <div className="voiceTranscript">
        {messages.map((message, index) => (
          <div className={`messageRow ${message.role}`} key={`${message.role}-${index}`}>
            <div className="messageBubble">{message.content}</div>
          </div>
        ))}
        {isConnecting ? (
          <div className="messageRow assistant">
            <div className="messageBubble thinking">Connecting...</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

