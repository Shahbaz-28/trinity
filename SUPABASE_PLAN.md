# Trinity — Supabase Backend Plan (Phase 2)

**Relationship to `PLAN.md`**: that file covered Phase 1 — the frontend-only prototype (mock data, React Context, `localStorage`) — which is done and working. This document is Phase 2: replacing that mock layer with a real Supabase backend (Postgres + Auth + Storage) so the app is actually end-to-end. Nothing in this doc has been built yet — review it, then we build.

**Reference**: `COMPLIANCE.md` (written earlier) flags real legal constraints that this schema and flow need to respect from day one — consent capture, real professional verification, and the Advocate-listing risk. Called out inline below wherever relevant.

---

## 1. Assumptions I'm making (flag if wrong)

| Assumption | Default I'm planning around |
|---|---|
| Supabase project | Doesn't exist yet — Phase 0 creates one. You'll need to give me the project URL + anon key (never the service role key in chat). |
| Auth method | Email + password via Supabase Auth (simplest, well-documented). Magic link is a drop-in alternative if you'd rather. |
| One identity, one role | A person is either a client or a professional at a time (switchable), not both simultaneously — matches how the mock behaves today. |
| Professional verification | Manual only — admin eyeballs the application and approves/rejects. No automated ICAI/BCI/ICSI registry check (that's a real integration project on its own, out of scope here). |
| File uploads (documents) | Deferred to a later phase — the core data flow doesn't depend on Storage working first. |

---

## 2. Architecture shift

**Today**: `lib/app-state.tsx` (React Context) holds everything in memory + `localStorage`. Every "page" is a client component reading that context.

**After this phase**:
- **Supabase Postgres** is the source of truth (replacing Context + `localStorage` for persisted data).
- **Supabase Auth** replaces the fake `login()`/`logout()` (replacing "type any name and email" with real signup/sign-in).
- **Next.js Server Components** fetch data server-side directly from Supabase for each page (Dashboard, Browse Providers, Admin queue) instead of reading Context.
- **Server Actions** replace the Context mutator functions (`addActiveService`, `submitApplication`, `setApplicationStatus`, `updateUser`) — they become real database writes.
- **Middleware** (`middleware.ts`) handles session refresh + route protection for `/dashboard/*`, `/providers`, `/partner/apply`, `/partner/admin` — replacing the current client-side `useEffect` + `router.replace` guards, which only redirect *after* a flash of blank content. Middleware redirects before the page ever renders.
- A thin Context may still exist for pure UI state (e.g. search/filter text) but no longer owns persisted data.

---

## 3. Data model

```
profiles                 -- one row per Supabase Auth user
  id                uuid PK, references auth.users(id)
  full_name         text
  email             text
  role              text  check in ('client','professional','admin')  default 'client'
  consent_given_at  timestamptz          -- DPDP: when they accepted the privacy notice
  created_at        timestamptz default now()

provider_profiles         -- a professional's public listing (was the mock `Provider`)
  id                 uuid PK default gen_random_uuid()
  profile_id         uuid references profiles(id)   -- nullable, see note below
  category           text check in ('CA','Advocate','Company Secretary','Accountant')
  specialization     text
  experience_years   int
  location           text
  membership_number  text                 -- ICAI/BCI/ICSI membership # — compliance: step toward real verification
  avatar_initial     text
  rating             numeric default 5
  reviews_count      int default 0
  status             text check in ('pending','approved','rejected') default 'pending'
  reviewed_by        uuid references profiles(id)
  reviewed_at        timestamptz
  created_at         timestamptz default now()

active_services           -- a client's engagement with a provider (was mock `ActiveService`)
  id                   uuid PK default gen_random_uuid()
  client_id            uuid references profiles(id)
  provider_profile_id  uuid references provider_profiles(id)
  status               text check in ('In Progress','Pending','Completed') default 'In Progress'
  started_at           timestamptz default now()

documents                 -- Phase 5, deferred — file metadata + Supabase Storage path
  id                 uuid PK default gen_random_uuid()
  active_service_id  uuid references active_services(id)
  title              text
  storage_path       text
  uploaded_by        uuid references profiles(id)
  created_at         timestamptz default now()
```

**Why `provider_profiles.profile_id` is nullable**: the 8 seeded demo providers (Priya Sharma, Justin John, etc.) don't need real login accounts to be browsable — they seed as rows with `profile_id = null`, `status = 'approved'`. Real applicants always get a `profile_id` tied to their Supabase Auth account. This keeps the existing demo data usable without inventing fake logins for it.

---

## 4. Row Level Security (RLS) — non-negotiable on every table

Supabase tables are exposed directly to the browser via its client library, so RLS is the actual access-control layer (not app code). Planned policies:

- **`profiles`**: a user can `select`/`update` only their own row (`id = auth.uid()`); a `role = 'admin'` user can `select` all.
- **`provider_profiles`**: anyone authenticated can `select` rows where `status = 'approved'` (this is `/providers` browsing); the owner (`profile_id = auth.uid()`) can `select`/`update` their own row regardless of status (this is `/partner/apply`'s status view); only `admin` can `update` the `status` column on rows they don't own (this is `/partner/admin` approving).
- **`active_services`**: a client can `select`/`insert` rows where `client_id = auth.uid()`; a professional can `select` rows where `provider_profile_id` belongs to their own `provider_profiles` row; `admin` sees all.
- **`documents`** (Phase 5): access tied to being the client or provider on the linked `active_service`, or admin.

**Admin bootstrapping**: there's no self-serve way to become `role = 'admin'` — the first admin is set directly in the database by us after the schema exists. This directly fixes the compliance-doc finding that `/partner/admin` today is a public, unauthenticated mock page.

---

## 5. Route-by-route: mock → real

| Route | Today (mock) | After Phase 2 |
|---|---|---|
| `/signin` | Type any name/email, instantly "logged in" | Real Supabase Auth sign-in/sign-up form |
| `/providers` | Reads `approvedProviders` from Context | Server Component query: `provider_profiles` where `status = 'approved'` |
| Choosing a provider | `addActiveService()` mutates Context + `localStorage` | Server Action inserts a row into `active_services` |
| `/dashboard/*` | Reads `activeServices`/`user` from Context | Server Components query `active_services` + `profiles` per request, gated by middleware |
| `/dashboard/profile` | `updateUser()` mutates Context | Server Action updates `profiles` row |
| `/partner/apply` | Local form → `submitApplication()` into Context/`localStorage`, tracked by a `myApplicationId` in `localStorage` | Requires real sign-in first; Server Action inserts into `provider_profiles`; "my application" is just "the `provider_profiles` row where `profile_id = auth.uid()`" — no more `localStorage` pointer needed |
| `/partner/admin` | Public, unauthenticated, mock toggle | Gated by middleware to `role = 'admin'`; Server Action updates `status` for real |

---

## 6. Compliance hooks built into this phase (from `COMPLIANCE.md`)

- **Consent**: both sign-in and the partner application form get an explicit "I agree to the Privacy Notice" checkbox; `profiles.consent_given_at` records when. This is the minimum DPDP notice-and-consent step, not a full privacy program.
- **Real verification, not a rubber stamp**: `provider_profiles.membership_number` captures the ICAI/BCI/ICSI number at application time so a human admin has something concrete to check before approving — actual registry verification stays a manual/future step.
- **Advocate listing risk (unresolved by this phase)**: this plan doesn't change the Advocate browse UI (ratings + "Choose" button). That's a product/legal decision, not a backend one — flagging again so it isn't forgotten once real advocates are onboarded via this new pipeline.
- **Data rights (deferred)**: a "delete my account" / "export my data" Server Action is straightforward to add once the schema exists, but isn't in this phase's scope — noted for Phase 6+.

---

## 7. Build phases

0. **Supabase project setup** — create project, install `@supabase/supabase-js` + `@supabase/ssr`, add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` (confirm it's gitignored), verify connection.
1. **Schema + RLS** — SQL migration creating the four tables above, enabling RLS, writing the policies, seeding the 10 existing mock providers as real rows.
2. **Auth** — real sign-in/sign-up UI, `middleware.ts` for session refresh + route protection.
3. **Client flow on real data** — Browse Providers, choose-a-provider insert, Dashboard Overview/Services/Requests/Profile/Settings reading real rows.
4. **Professional flow on real data** — real `/partner/apply`, real `/partner/admin` gated by role.
5. **Storage/documents** (optional, can slip to later).
6. **Compliance wiring** — consent checkboxes + `consent_given_at`, a real privacy notice page.
7. **Cleanup** — remove the now-unneeded mock plumbing (`lib/app-state.tsx`'s Context-as-database, `localStorage` persistence, `lib/mock-data.ts` becomes a one-time seed script input instead of runtime data).

---

## 8. What I need from you before Phase 0 starts

1. A Supabase project (new or existing) — project URL + anon key.
2. Confirm or correct the assumptions in §1 (especially auth method and the one-role-at-a-time assumption).
3. Green light to proceed phase by phase, or build straight through 0→4 and pause before Storage/compliance polish.
