export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateKnowledgeInput(body) {
  const title = cleanString(body.title);
  const content = cleanString(body.content);

  if (!title) {
    return { error: "Title is required" };
  }

  if (!content) {
    return { error: "Content is required" };
  }

  return {
    title,
    content,
    active: typeof body.active === "boolean" ? body.active : true
  };
}

