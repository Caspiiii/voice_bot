import { NextResponse } from "next/server";
import { embedText } from "@/lib/openai";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin, toVectorLiteral } from "@/lib/supabase";
import { readJson, validateKnowledgeInput } from "@/lib/validation";

export async function GET(request, { params }) {
  const unauthorized = await requireAdmin(request);

  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await params;
  const { data, error } = await getSupabaseAdmin()
    .from("knowledge_entries")
    .select("id,title,content,active,created_at,updated_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ entry: data });
}

export async function PATCH(request, { params }) {
  const unauthorized = await requireAdmin(request);

  if (unauthorized) {
    return unauthorized;
  }

  const input = validateKnowledgeInput(await readJson(request));

  if (input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  const { id } = await params;
  const embedding = await embedText(input.content);
  const { data, error } = await getSupabaseAdmin()
    .from("knowledge_entries")
    .update({
      title: input.title,
      content: input.content,
      active: input.active,
      embedding: toVectorLiteral(embedding)
    })
    .eq("id", id)
    .select("id,title,content,active,created_at,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin(request);

  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await params;
  const { data, error } = await getSupabaseAdmin()
    .from("knowledge_entries")
    .update({ active: false })
    .eq("id", id)
    .select("id,title,content,active,created_at,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}

