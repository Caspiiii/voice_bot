import AdminGate from "@/components/AdminGate";
import AdminHeader from "@/components/AdminHeader";
import KnowledgeForm from "@/components/KnowledgeForm";

export default async function EditEntryPage({ params }) {
  const { id } = await params;

  return (
    <AdminGate>
      <main className="shell">
        <AdminHeader
          title="Edit entry"
          subtitle="Saving re-embeds the content so search stays current."
        />
        <KnowledgeForm id={id} />
      </main>
    </AdminGate>
  );
}

