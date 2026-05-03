"use client";

import { useState } from "react";
import CustomerChat from "@/components/CustomerChat";
import CustomerVoice from "@/components/CustomerVoice";

export default function CustomerExperience() {
  const [mode, setMode] = useState("chat");

  return (
    <section className="customerExperience">
      <div className="modeSwitch" aria-label="Choose support mode">
        <button
          className={mode === "chat" ? "modeButton active" : "modeButton"}
          type="button"
          onClick={() => setMode("chat")}
        >
          Write
        </button>
        <button
          className={mode === "voice" ? "modeButton active" : "modeButton"}
          type="button"
          onClick={() => setMode("voice")}
        >
          Talk
        </button>
      </div>
      {mode === "chat" ? <CustomerChat /> : <CustomerVoice />}
    </section>
  );
}

