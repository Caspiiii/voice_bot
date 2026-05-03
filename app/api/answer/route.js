import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { embedText, createAnswer } from "@/lib/openai";
import { getSupabaseAdmin, toVectorLiteral } from "@/lib/supabase";
import { cleanString, readJson } from "@/lib/validation";

export async function POST(request) {
  const body = await readJson(request);
  const question = cleanString(body.question);

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const questionEmbedding = await embedText(question);
  const { data: entries, error } = await getSupabaseAdmin().rpc(
    "match_knowledge_entries",
    {
      query_embedding: toVectorLiteral(questionEmbedding),
      match_count: body.matchCount || 5,
      match_threshold: body.matchThreshold || 0.15
    }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!entries?.length) {
    return NextResponse.json({
      answer: "I don't know that yet, but I can take a message.",
      retrieved_entries: []
    });
  }

  const answer = await createAnswer({ question, entries });
  const includeSources = body.includeSources && (await isAdminRequest(request));

  return NextResponse.json({
    answer,
    retrieved_entries: includeSources
      ? entries.map((entry) => ({
          id: entry.id,
          title: entry.title,
          content: entry.content,
          similarity: entry.similarity
        }))
      : undefined
  });
}

