import { NextResponse } from "next/server";
import { embedText } from "@/lib/openai";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin, toVectorLiteral } from "@/lib/supabase";
import { readJson, validateKnowledgeInput } from "@/lib/validation";

export async function GET(request) {
  const unauthorized = await requireAdmin(request);

  if (unauthorized) {
    return unauthorized;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("knowledge_entries")
    .select("id,title,content,active,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}

export async function POST(request) {
  const unauthorized = await requireAdmin(request);

  if (unauthorized) {
    return unauthorized;
  }

  const input = validateKnowledgeInput(await readJson(request));

  if (input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: existing, error: lookupError } = await supabase
    .from("knowledge_entries")
    .select("id,title,content,active,created_at,updated_at")
    .eq("title", input.title)
    .eq("content", input.content)
    .order("active", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (existing) {
    if (existing.active === input.active) {
      return NextResponse.json({ entry: existing, duplicate: true });
    }

    const { data: reactivated, error: reactivateError } = await supabase
      .from("knowledge_entries")
      .update({ active: input.active })
      .eq("id", existing.id)
      .select("id,title,content,active,created_at,updated_at")
      .single();

    if (reactivateError) {
      return NextResponse.json({ error: reactivateError.message }, { status: 500 });
    }

    return NextResponse.json({ entry: reactivated, duplicate: true });
  }

  const embedding = await embedText(input.content);
  const { data, error } = await supabase
    .from("knowledge_entries")
    .insert({
      title: input.title,
      content: input.content,
      active: input.active,
      embedding: toVectorLiteral(embedding)
    })
    .select("id,title,content,active,created_at,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data }, { status: 201 });
}
