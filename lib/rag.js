import { embedText, createAnswer } from "@/lib/openai";
import { getSupabaseAdmin, toVectorLiteral } from "@/lib/supabase";

export async function answerQuestion({
  question,
  matchCount = 5,
  matchThreshold = 0.15
}) {
  const questionEmbedding = await embedText(question);
  const { data: entries, error } = await getSupabaseAdmin().rpc(
    "match_knowledge_entries",
    {
      query_embedding: toVectorLiteral(questionEmbedding),
      match_count: matchCount,
      match_threshold: matchThreshold
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!entries?.length) {
    return {
      answer: "I don't know that yet, but I can take a message.",
      retrievedEntries: []
    };
  }

  return {
    answer: await createAnswer({ question, entries }),
    retrievedEntries: entries
  };
}

