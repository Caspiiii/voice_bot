"use client";

import { useEffect, useState } from "react";

export default function AdminGate({ children }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      setError("Password was not accepted.");
      return;
    }

    setAuthenticated(true);
  }

  if (checking) {
    return (
      <main className="loginWrap">
        <div className="loginCard">Checking session...</div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="loginWrap">
        <form className="loginCard" onSubmit={submit}>
          <p className="eyebrow">Admin</p>
          <h1>Enter the admin password.</h1>
          <p>The password stays server-side and creates an HTTP-only cookie.</p>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              className="input"
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? <p className="errorLine">{error}</p> : null}
          <button className="primaryButton" type="submit">
            Log in
          </button>
        </form>
      </main>
    );
  }

  return children;
}

