# AI-RECRUITER
App for interviewing candidates in enterprises and giving feedback and final hiring decision using AI.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### 1. Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables. You can get these keys from their respective service dashboards.

```bash
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL="https://xkonzampbdghyayjsuhz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrb256YW1wYmRnaHlheWpzdWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTgzNjQsImV4cCI6MjA2MzMzNDM2NH0.salBgAWJxFOgHUp63FX4h-kJbPdVx1rORnGPnHVCWyc

# Vapi Public Key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=043f2a4a-41e2-4eeb-bd03-8557a46ba007

# OpenAI API Key (for server-side API routes)
OPENAI_API_KEY=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
