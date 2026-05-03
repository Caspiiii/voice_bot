# Voice Bot MVP

Prototype for an admin-editable RAG knowledge base that answers short caller questions.

## Local setup

1. Create `.env.local` from `.env.example`.
2. Run the SQL in `supabase/migrations/001_initial.sql` in the Supabase SQL editor.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

5. Open `/admin`, log in with `ADMIN_PASSWORD`, seed the example entries or add your own, and test questions.

## API quick tests

Log in for a cookie:

```bash
curl -i -X POST http://localhost:3000/api/admin/login ^
  -H "content-type: application/json" ^
  -d "{\"password\":\"YOUR_ADMIN_PASSWORD\"}"
```

Or use `x-admin-password` for local API testing:

```bash
curl -X POST http://localhost:3000/api/knowledge ^
  -H "content-type: application/json" ^
  -H "x-admin-password: YOUR_ADMIN_PASSWORD" ^
  -d "{\"title\":\"Opening hours\",\"content\":\"We are open until 17:00.\"}"
```

```bash
curl -X POST http://localhost:3000/api/answer ^
  -H "content-type: application/json" ^
  -d "{\"question\":\"When are you open until?\"}"
```

## Vapi web voice setup

The `/customer` page has a Talk mode powered by the Vapi Web SDK. Configure these values in Railway:

```bash
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your-vapi-assistant-id
VAPI_TOOL_SECRET=your-tool-secret
```

Create a Vapi server-based custom tool:

```text
Name: answer_question
Description: Use this for every customer question. It answers only from the company's knowledge base.
Parameter: question, string, required
Server URL: https://your-railway-domain/api/vapi/tool
Header: x-vapi-tool-secret: your-tool-secret
```

Assistant instruction:

```text
For customer questions, call answer_question with the user's exact question.
Say the tool result naturally and briefly.
Do not answer from general knowledge.
If the tool says it does not know, offer to take a message.
```
