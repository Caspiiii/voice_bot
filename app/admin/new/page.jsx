import AdminGate from "@/components/AdminGate";
import AdminHeader from "@/components/AdminHeader";
import KnowledgeForm from "@/components/KnowledgeForm";

export default function NewEntryPage() {
  return (
    <AdminGate>
      <main className="shell">
        <AdminHeader
          title="New entry"
          subtitle="Saving creates an embedding and stores it in Supabase."
        />
        <KnowledgeForm />
      </main>
    </AdminGate>
  );
}

