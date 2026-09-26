# Trinity — Frontend-Only Prototype Plan

## Goal
Extend the current marketing-site prototype so the flow feels like a real product:

**Home → Sign In (mock) → Browse Providers (CA / Advocate / CS / Accountant) → Pick one → Dashboard**

Everything stays **frontend-only**. No backend, no API routes, no real database, no real auth. All "data" is mock data living in a local file, and app state lives in React state (+ `localStorage` so a refresh doesn't wipe the demo).

---

## Constraints (explicit, so scope doesn't creep)
- No API routes (`app/api/*`), no server actions that talk to a real service, no database.
- "Sign in" is a form that instantly logs the user in — no password check, no OTP verification against a real service, no email actually sent.
- "Providers" (CAs, Advocates, CS, Accountants) are a hardcoded array of mock people — no real directory, no backend search.
- Booking/picking a provider just creates a local object that shows up in the dashboard — no real request goes anywhere.
- Persistence = `localStorage` only, so it survives a page refresh but is per-browser, fake, and resettable.

---

## New flow

```
Home / Explore / About (public, unchanged)
        │  click "Get Started" or "Login"
        ▼
   Sign In screen (mock)
        │  submit name + email/phone → instantly "logged in"
        ▼
   Browse Providers (marketplace grid: CA, Advocate, CS, Accountant)
        │  filter by category, search, click "Choose"
        ▼
   Confirm selection (lightweight modal/step)
        │  confirm → creates a mock "active service" tied to that provider
        ▼
   Dashboard
        - Active Services list now includes the provider(s) picked
        - Existing stat cards / upcoming panel stay mostly as-is (mock)
        - Logout button clears the mock session, back to Home
```

---

## Data model (mock only, no backend)

New file: `lib/mock-data.ts`

```ts
export type ProviderCategory = 'CA' | 'Advocate' | 'Company Secretary' | 'Accountant'

export type Provider = {
  id: string
  name: string
  category: ProviderCategory
  specialization: string   // e.g. "GST & Tax Filing", "Corporate Law"
  experienceYears: number
  rating: number            // e.g. 4.8
  reviews: number
  location: string
  avatarInitial: string
}

export const providers: Provider[] = [ /* ~8-10 hardcoded entries */ ]
```

New file: `lib/types.ts`
```ts
export type User = { name: string; email: string }
export type ActiveService = { id: string; provider: Provider; status: 'In Progress' | 'Pending' | 'Completed'; startedAt: string }
```

---

## State management (still no backend)

New file: `lib/app-state.tsx` — a small React Context provider wrapping the app:

- `user: User | null`, `login(user)`, `logout()`
- `activeServices: ActiveService[]`, `addActiveService(provider)`
- On mount: read `user` + `activeServices` from `localStorage`
- On change: write back to `localStorage`

This replaces prop-drilling as the app grows past the current single `page.tsx` view-switch.

---

## Component/file breakdown

Right now everything lives in one dense `app/page.tsx`. Split it out as we add screens:

- `components/sign-in.tsx` — mock login form (name + email/phone), calls `login()` from context, redirects to Providers screen
- `components/providers-browse.tsx` — marketplace grid, reuses the existing `Explore` search/filter pattern but sourced from `providers` mock data, category filter chips (CA / Advocate / CS / Accountant / All)
- `components/provider-card.tsx` — card showing avatar initial, name, category badge, specialization, rating, "Choose" button
- `components/provider-confirm.tsx` — simple confirmation step/modal before finalizing the pick
- `components/dashboard.tsx` — existing dashboard, but "Active Services" section now maps over `activeServices` from context instead of the hardcoded array
- `app/page.tsx` — becomes the thin view router (`home | explore | about | signin | providers | dashboard`), wrapped in `AppStateProvider`

---

## Build order (phases)

1. **Mock data + context** — `lib/mock-data.ts`, `lib/types.ts`, `lib/app-state.tsx`. No UI yet, just the foundation.
2. **Sign In screen** — new view, simple form, wires into context `login()`, redirects to Providers.
3. **Browse Providers screen** — grid + category filter + search, using mock data (mirrors the existing Explore page's look/feel for consistency).
4. **Pick → Confirm → Dashboard** — clicking "Choose" on a provider adds an `ActiveService` via context and routes to Dashboard.
5. **Wire Dashboard to real (mock) state** — Active Services list reflects what was picked instead of the fully hardcoded rows; keep stat cards/upcoming panel as static mock content for now.
6. **Polish** — logout clears session, empty state when no providers picked yet ("You haven't chosen a service provider yet" → CTA back to Browse), minor loading/transition touches.

---

## Explicitly out of scope for this prototype
- Real authentication/session security
- Real payments or provider payouts
- Real provider directory, ratings, or availability
- Any server-side persistence — clearing browser storage resets everything
