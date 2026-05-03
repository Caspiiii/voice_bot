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
