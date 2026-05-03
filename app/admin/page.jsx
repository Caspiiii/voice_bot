import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import AdminHeader from "@/components/AdminHeader";
import KnowledgeList from "@/components/KnowledgeList";
import SeedExamples from "@/components/SeedExamples";
import TestQuestion from "@/components/TestQuestion";

export default function AdminPage() {
  return (
    <AdminGate>
      <main className="shell">
        <AdminHeader
          title="Knowledge entries"
          subtitle="Add facts and behavior rules the bot is allowed to use."
          actions={
            <>
              <SeedExamples />
              <Link className="primaryButton" href="/admin/new">
                New entry
              </Link>
            </>
          }
        />
        <div className="grid">
          <section className="panel">
            <h2>Entries</h2>
            <KnowledgeList />
          </section>
          <TestQuestion />
        </div>
      </main>
    </AdminGate>
  );
}
