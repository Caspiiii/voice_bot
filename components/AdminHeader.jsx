"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader({ title, subtitle, actions }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
    window.location.href = "/admin";
  }

  return (
    <header className="adminHeader">
      <div>
        <p className="eyebrow">Knowledge admin</p>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="topActions">
        {actions}
        <Link className="ghostButton" href="/admin">
          Entries
        </Link>
        <button className="ghostButton" type="button" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  );
}

