# Engagement Tracking & Documents — Plan

**Status: proposal, not built yet.** Review this, then we implement.

## The gap

Right now, once a client chooses a professional, an `active_services` row exists with exactly one of three flat states: `In Progress`, `Pending`, `Completed`. That's it. There's:
- no visibility into **what's actually happening** inside "In Progress" — a GST filing and a trademark registration both just say "In Progress" for however many days/weeks the real work takes
- no real **documents** — the Documents tab shows a fake, auto-generated "X Engagement Letter.pdf" line per engagement, not anything anyone actually uploaded
- no way for the professional to **tell the client** what stage things are at, or share a file, without leaving the app

This plan adds both: a **timeline** the client can watch progress on, and **real file sharing** between client and professional.

---

## 1. Engagement timeline ("what step it reached")

Rather than a rigid fixed pipeline (which doesn't fit GST filing, trademark work, and CFO advisory equally well), the professional posts free-form dated updates against an engagement — like a shipment tracker. The client sees them chronologically.

**New table:**
```sql
create table public.engagement_updates (
  id                  uuid primary key default gen_random_uuid(),
  active_service_id   uuid not null references public.active_services(id) on delete cascade,
  title               text not null,        -- e.g. "Documents requested", "Filed with GST portal"
  note                text,                 -- optional longer explanation, visible to the client
  created_by          uuid not null references public.profiles(id),
  created_at          timestamptz not null default now()
);
```

- **Who can post**: only the professional on their own engagement (keeps the log authoritative — one voice, not a chat thread). If you want the client to be able to reply/ask questions later, that's a natural v2 (a real two-way thread), called out here so it's not forgotten, but out of scope for this pass.
- **Who can read**: both participants (client and provider) on that engagement — same RLS shape already used for `documents` in Phase 1.
- The existing blunt `active_services.status` (`In Progress`/`Pending`/`Completed`) stays as the overall bucket — the timeline is the detail *inside* that bucket, not a replacement for it.

---

## 2. Real documents (Supabase Storage)

The `documents` table already exists (created in Phase 1, never wired to Storage — this finishes that).

- **New Storage bucket**: `documents`, private (not public).
- **Storage policies**: only the client or provider on the related `active_service` can read/write objects under that engagement's folder (`{active_service_id}/{filename}`).
- **Professional side**: upload a file against a specific client engagement.
- **Client side**: see real uploaded files, download them via a signed URL (time-limited, not a public link).
- Upload/download both go through Server Actions — the browser never gets direct, unscoped Storage access.

---

## 3. New pages needed

Both the timeline and documents are *per engagement*, not per-list — so this needs a proper detail page instead of cramming everything into the flat lists that exist today:

| Route | Who | Shows |
|---|---|---|
| `/dashboard/services/[id]` | Client | This one engagement: provider info, current status, the timeline, documents (view/download) |
| `/partner/dashboard/clients/[id]` | Professional | This one engagement: client info, status controls (already built), a form to post a timeline update, upload a document |

The existing list pages (`/dashboard/services`, `/partner/dashboard/clients`) become the entry point — each row links into its own detail page instead of doing everything inline.

---

## 4. Build phases

1. **Schema** — `engagement_updates` table + RLS, Storage bucket + Storage policies. Regenerate types.
2. **Client detail page** — `/dashboard/services/[id]`: read-only timeline + document list/download.
3. **Professional detail page** — `/partner/dashboard/clients/[id]`: post a timeline update (title + optional note), upload a document, existing status buttons moved here.
4. **Wire the list pages** — each row in `/dashboard/services` and `/partner/dashboard/clients` links to its detail page.
5. **Verify** — same as every phase so far: real accounts, real REST calls, a real headless-browser pass checking for console errors, not just `tsc`/`build`.

---

## 5. Open questions before I start

1. **File types/size** — any limit on what can be uploaded (PDF/images only? a size cap)? I'd default to a reasonable cap (e.g. 10MB, common document types) unless you want something specific.
2. **Notifications** — should the client get any kind of visible "new update" indicator (e.g. an unread badge), or is it enough that it's just there when they check? I'd default to *no notification system yet* (that's a bigger feature on its own — email/push) and keep this pass to "the data is real and visible."
3. **Can a professional delete/edit a posted update?** I'd default to *no* (it's a log, not a chat message) — simpler and matches "timeline," but flag it in case you want edit/delete.

Let me know if this shape is right, and answer the three questions (or say "use your defaults") — then I'll build it the same way as every phase so far: real schema, real verification, no mock data.
