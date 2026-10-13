# الفطنة (Al-Fitnah)
1. GitHub > Settings > Developer settings > OAuth Apps > New. Callback URL: https://YOUR-DOMAIN/api/auth/callback
2. Deploy to Vercel (import this repo). Add env vars from .env.example.
3. Open the site, sign in with GitHub once. Session lasts 1 year (encrypted httpOnly cookie).
Provider API keys are stored only in the user's browser (localStorage) and sent through /api/chat per request.
