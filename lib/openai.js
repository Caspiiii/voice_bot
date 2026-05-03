import OpenAI from "openai";

let client;

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}

export async function embedText(input) {
  const response = await getOpenAI().embeddings.create({
    model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    input
  });

  return response.data[0].embedding;
}

export async function createAnswer({ question, entries }) {
  const knowledge = entries
    .map(
      (entry, index) =>
        `[${index + 1}] ${entry.title}\n${entry.content}`
    )
    .join("\n\n");

  const response = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.4,
    max_tokens: 120,
    messages: [
      {
        role: "system",
        content: [
          "You answer using only the retrieved knowledge.",
          "If the retrieved knowledge contains a rule not to share something, follow that rule.",
          "If no relevant knowledge is found, say you don't know and offer to take a message.",
          "Tone: casual, friendly, human, short. Not corporate. Light slang is okay, but do not overdo it.",
          "Do not mention internal sources, entries, embeddings, or retrieval."
        ].join("\n")
      },
      {
        role: "user",
        content: `Retrieved knowledge:\n${knowledge}\n\nQuestion: ${question}`
      }
    ]
  });

  return response.choices[0]?.message?.content?.trim() || "I don't know, but I can take a message.";
}

