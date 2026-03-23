# Strine — Claude Code Project Guide

> /straɪn/ · Australian accent coaching app · React Native + Expo + Node.js
> GitHub: https://github.com/dmshuklaa/strine.git

---

## What this app is

Strine is a mobile app that helps non-native English speakers develop an authentic
Australian accent. Users record themselves saying curated Australian phrases daily
and receive real-time AI coaching. The name is itself an example of what the app
teaches — "Australian" spoken in a Broad Australian accent.

---

## Project structure

```
/                        ← Expo React Native app (root)
  /app                   ← Expo Router screens
    /(auth)              ← welcome, sign-in, sign-up
    /(tabs)              ← home, practice, progress
    /onboarding          ← 6-screen onboarding flow
    /paywall.tsx
    /settings.tsx
  /components            ← Reusable UI components
  /lib                   ← Supabase client, API client, auth, entitlements
  /store                 ← Zustand stores (auth, onboarding, session)
  /constants             ← colours, config, theme
  /assets                ← fonts, images, icons
  /supabase
    /migrations          ← SQL migration files

/backend                 ← Node.js + Fastify API (separate deployable)
  /src
    /routes              ← API route handlers
    /services            ← Whisper, Claude, ElevenLabs, streak, notifications
    /middleware          ← JWT auth validation
  /scripts               ← generateAudio.ts, seedPhrases.ts
  index.ts
  Dockerfile
```

---

## Tech stack — use exactly these, no substitutions

### Mobile (Expo app root)
- **Framework**: React Native + Expo SDK 51, TypeScript
- **Navigation**: expo-router (file-based routing)
- **State**: Zustand + @tanstack/react-query
- **Audio**: expo-av (recording + playback)
- **HTTP**: axios
- **Payments**: react-native-purchases (RevenueCat)
- **Notifications**: expo-notifications
- **Haptics**: expo-haptics
- **Fonts**: expo-font (Syne for headings)
- **Animations**: react-native-reanimated

### Backend (/backend)
- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Fastify (NOT Express)
- **Deployment**: Railway (Dockerfile provided)
- **Database client**: @supabase/supabase-js (service role key)

### External services
- **Database + Auth + Storage**: Supabase (PostgreSQL)
- **AI feedback**: Anthropic Claude — model: `claude-haiku-4-5-20251001`
- **Speech-to-text**: OpenAI Whisper — model: `whisper-1`, language: `en`, prompt: `"Australian English accent"`
- **TTS voices**: ElevenLabs — model: `eleven_multilingual_v2`

### DO NOT use
- Express (use Fastify)
- Redux (use Zustand)
- React Navigation (use expo-router)
- Any Claude model other than `claude-haiku-4-5-20251001` unless explicitly told to upgrade
- AsyncStorage for sensitive data (use Supabase session management)

---

## Brand + design

```
Navy:   #0D1B2A  ← primary background, buttons
Gold:   #E8A825  ← accent, streak badges, highlights
Teal:   #0F6E56  ← success states, skill bars
Coral:  #D9534F  ← record button, error states
White:  #FFFFFF  ← primary text on dark backgrounds
```

- Heading font: Syne (bold)
- Body font: System default
- Horizontal padding: 16px on all screens
- Border radius: 10–12px for cards, 8px for chips
- Support both light and dark mode via `useColorScheme()`

---

## Database schema (PostgreSQL via Supabase)

All tables have Row Level Security enabled. Users can only access their own data.

```sql
users               ← auth profile, streak, subscription_tier, voice_coach_id
voice_coaches       ← 4 coaches: Bruce, Shazza, Davo, Bonnie
phrases             ← phrase library (target: 100 phrases)
phrase_audio        ← cached ElevenLabs TTS, UNIQUE(phrase_id, voice_coach_id)
sessions            ← one per user per day, UNIQUE(user_id, date)
attempts            ← every recording attempt (core event table)
skill_scores        ← EMA score per category, updated by Postgres trigger
daily_selections    ← cached Sandwich Method selections, UNIQUE(user_id, date)
```

Key constraint: `phrase_audio` has `UNIQUE(phrase_id, voice_coach_id)`.
Never call ElevenLabs if a row already exists — check first, always.

---

## Critical business rules

### Process-and-Purge audio policy (NON-NEGOTIABLE)
User-recorded audio is NEVER written to disk or Supabase Storage in the default flow.

```
Device mic → memory buffer → Whisper API → release buffer
```

No file writes. No storage uploads. Audio exists only in RAM during the Whisper call.

Exception: Starred attempts (Pro users only) — upload to `user-audio/{user_id}/{attempt_id}.mp3`
in Supabase Storage only when the user explicitly taps the Star button.

### ElevenLabs caching (NON-NEGOTIABLE)
Before EVERY ElevenLabs API call, check `phrase_audio` table for an existing row.
If row exists → return cached URL. If not → generate, upload, insert row, return URL.
NEVER call ElevenLabs twice for the same (phrase_id, voice_coach_id) combination.

### Record button idempotency
Disable the Record button immediately on tap-to-stop. Set `isProcessing = true`.
Re-enable ONLY after the full API response is received and rendered.
Backend: reject duplicate (user_id + phrase_id) requests within 5 seconds.

### Sandwich Method — daily phrase selection (3 slots, strict order)
```
Slot 1 — WARM-UP:  easy difficulty · any category user scores > 70 · never weakest category
Slot 2 — CORE:     weakest category · medium difficulty · targeted improvement
Slot 3 — EXPLORE:  new unexplored category · easy difficulty · discovery
```
Avoid phrases seen in last 30 days. If streak > 14 and avg_score > 80, Slot 2 may use hard.
Cache result in `daily_selections` table — don't recalculate if row exists for today.

### Skill score updates
Use an exponential moving average (alpha = 0.3):
`new_score = 0.3 * attempt.score + 0.7 * current_score`
Updated automatically via a Postgres trigger on `attempts INSERT` — do NOT update
skill_scores manually from application code.

### Streak logic
- streak_last_date = yesterday → increment streak_current, update streak_last_date
- streak_last_date = today → already counted, no change
- streak_last_date < yesterday → reset to 1
- Always update streak_best if streak_current > streak_best

---

## API routes

All backend routes require a valid Supabase JWT (except /api/webhooks/*).

```
POST /api/analyse              ← audio multipart → Whisper + Claude → attempt row
GET  /api/phrases/daily        ← Sandwich Method selection for today
GET  /api/phrases/:id          ← phrase details + cached audio URL
POST /api/sessions             ← create/update today's session
GET  /api/progress             ← skill_scores + streak + last 14 days
POST /api/attempts/:id/star    ← Pro only — upload audio to storage
GET  /api/admin/storage-stats  ← admin only — storage usage
POST /api/webhooks/revenuecat  ← subscription status sync
POST /api/notifications/send-reminders ← cron-protected, CRON_SECRET header
```

---

## Claude Haiku prompt structure (POST /api/analyse)

System: `"You are an Australian accent coach. Be specific, warm, and brief. Always return valid JSON only — no markdown, no preamble."`

User message JSON fields:
```
target_phrase, user_said, voice_coach (name + gender + accent_type),
user_level (1-3), attempt_number, category, focus_sounds[], previous_tip (nullable)
```

Required response shape:
```json
{
  "score": 0-100,
  "rhythm": "natural" | "stilted" | "rushed",
  "issues": ["max 3 specific phonetic issues"],
  "tip": "one actionable sentence, max 15 words",
  "highlight_word": "single word",
  "encouragement": "1 sentence in coach voice",
  "improved_from_last": true | false
}
```

Always parse with try/catch. On JSON parse failure, return a safe default object —
never surface a raw error to the user.

---

## Voice coaches

| Name   | Gender | Accent      | Region     | ElevenLabs Voice ID           |
|--------|--------|-------------|------------|-------------------------------|
| Bruce  | male   | broad       | Queensland | nPczCjzI2devNBz1zQrb (Brian)  |
| Shazza | female | general     | Sydney     | XB0fDUnXU5powFXDhCwa (Charlotte) |
| Davo   | male   | cultivated  | Melbourne  | TX3LPaxmHKxFdv7VOQHJ (Liam)  |
| Bonnie | female | broad       | Perth      | FGY2WhTYpPnrIDTdsKH5 (Matilda) |

Free plan: Bruce + Shazza only. Davo + Bonnie gated behind Pro entitlement.

---

## Subscription tiers

```
free  → 3 phrases/day, Bruce + Shazza voices only, no Starred recordings
pro   → Unlimited phrases, all 4 voices, Starred recordings, future: phoneme scoring
```

RevenueCat entitlement ID: `"pro"`
Products: `com.strine.pro.monthly` ($4.99) · `com.strine.pro.annual` ($39.99)
Check entitlements via `/lib/entitlements.ts` → `isPro()` function.

---

## Environment variables

### Expo app (.env)
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=              ← Railway backend URL
```

### Backend (/backend/.env)
```
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=             ← service role key (not anon)
SUPABASE_JWT_SECRET=              ← for validating user JWTs
PORT=3000
CRON_SECRET=                      ← protects /api/notifications/send-reminders
```

---

## Onboarding flow (6 screens, value-before-signup)

```
Screen 1  /onboarding/index     ← Welcome — no auth yet
Screen 2  /onboarding/goal      ← Why learning? → users.goal
Screen 3  /onboarding/accent    ← Native accent (fixed list + Other) → users.native_accent
Screen 4  /onboarding/voice-coach ← Pick coach, hear sample audio → users.voice_coach_id
Screen 5  /onboarding/try-it    ← Record 1 phrase, see waveform + score BEFORE sign-up
Screen 6  /onboarding/account   ← Create account → set onboarding_done = true
```

Screen 5 has TWO feedback layers:
1. Immediate (no API): waveform overlay — user (navy) vs native coach (gold)
2. ~1.6s later: AI score + tip from Claude

After onboarding_done = true → redirect to /(tabs)/home.

---

## Sprint plan (reference)

| Sprint | Weeks | Focus |
|--------|-------|-------|
| 1 | 1–2 | Repo scaffold, Supabase schema, Auth, Onboarding 6 screens |
| 2 | 3–4 | Backend API, Whisper+Claude pipeline, Practice screen, Sandwich Method |
| 3 | 5   | Streak engine, Progress screen, Push notifications |
| 4 | 6   | ElevenLabs TTS cache, Process-and-Purge policy, RevenueCat |
| 5 | 7   | Polish, 100-phrase library, TestFlight + Play Store |

Current sprint/stage will be noted at the start of each prompt session.

---

## Code standards

- TypeScript strict mode — no `any` types
- All async functions use try/catch with meaningful error messages
- API responses always include `{ success: boolean, data?, error? }`
- No TODO comments in committed code — either implement or create a GitHub issue
- All Supabase queries use the typed client generated from schema
- Console.log only in development — use a logger in production
- Test with `npx expo start` before committing any screen changes

---

## What NOT to do (common mistakes to avoid)

- Do NOT call ElevenLabs without checking phrase_audio table first
- Do NOT write user audio to disk or Supabase Storage (Process-and-Purge)
- Do NOT use Express — this project uses Fastify
- Do NOT use a Claude model other than `claude-haiku-4-5-20251001`
- Do NOT update skill_scores from application code — the Postgres trigger handles it
- Do NOT re-enable the Record button until the full API response arrives
- Do NOT store API keys in the Expo app — all AI calls go through the backend
- Do NOT skip the idempotency check on POST /api/analyse
