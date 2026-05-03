import Link from "next/link";
import CustomerExperience from "@/components/CustomerExperience";

export default function CustomerPage() {
  return (
    <main className="customerShell">
      <header className="customerHeader">
        <div>
          <p className="eyebrow">Customer chat</p>
          <h1>Ask the bot</h1>
        </div>
        <Link className="ghostButton" href="/admin">
          Admin
        </Link>
      </header>
      <CustomerExperience />
    </main>
  );
}
