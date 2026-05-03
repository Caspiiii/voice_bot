import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/rag";
import { cleanString, readJson } from "@/lib/validation";

function verifyVapiSecret(request) {
  const expectedSecret = process.env.VAPI_TOOL_SECRET;

  if (!expectedSecret) {
    return true;
  }

  const auth = request.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice("bearer ".length).trim()
    : "";
  const headerSecret = request.headers.get("x-vapi-tool-secret") || "";

  return bearer === expectedSecret || headerSecret === expectedSecret;
}

function parseArguments(value) {
  if (!value) {
    return {};
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }

  return value;
}

function extractQuestion(toolCall) {
  const args = parseArguments(toolCall.arguments || toolCall.function?.arguments);

  return cleanString(
    args.question ||
      args.query ||
      args.message ||
      args.input ||
      args.text ||
      toolCall.question
  );
}

function vapiResult(value) {
  return cleanString(value).replace(/\s+/g, " ");
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "vapi-tool" });
}

export async function POST(request) {
  if (!verifyVapiSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readJson(request);
  const toolCalls = body.message?.toolCallList || body.toolCallList || [];

  if (!Array.isArray(toolCalls) || !toolCalls.length) {
    return NextResponse.json({ error: "No tool calls found" }, { status: 400 });
  }

  const results = await Promise.all(
    toolCalls.map(async (toolCall) => {
      const question = extractQuestion(toolCall);

      if (!question) {
        return {
          toolCallId: toolCall.id,
          result: "I did not get a clear question, but I can take a message."
        };
      }

      try {
        const { answer } = await answerQuestion({ question });

        return {
          toolCallId: toolCall.id,
          result: vapiResult(answer)
        };
      } catch {
        return {
          toolCallId: toolCall.id,
          result: "I am having trouble checking that right now, but I can take a message."
        };
      }
    })
  );

  return NextResponse.json({ results });
}
