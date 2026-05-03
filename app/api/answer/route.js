import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { answerQuestion } from "@/lib/rag";
import { cleanString, readJson } from "@/lib/validation";

export async function POST(request) {
  const body = await readJson(request);
  const question = cleanString(body.question);

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  let result;

  try {
    result = await answerQuestion({
      question,
      matchCount: body.matchCount || 5,
      matchThreshold: body.matchThreshold || 0.15
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const includeSources = body.includeSources && (await isAdminRequest(request));

  return NextResponse.json({
    answer: result.answer,
    retrieved_entries: includeSources
      ? result.retrievedEntries.map((entry) => ({
          id: entry.id,
          title: entry.title,
          content: entry.content,
          similarity: entry.similarity
        }))
      : undefined
  });
}
