# Trinity — Indian Legal & Regulatory Compliance Notes

**Status:** Research notes for planning purposes. **Not legal advice.** Before real users, real documents, or real money touch this product, get a qualified Indian counsel (data protection + professional-regulation experience) to review this.

**Why this document exists:** Trinity is a two-sided marketplace connecting clients with regulated professionals (CA, Advocate, Company Secretary, Accountant). That combination — personal data + regulated professions + marketplace matching — pulls in several *overlapping* Indian legal regimes. This doc maps what applies, and specifically what's *risky about the product shape we've already built* (ratings, browse grids, a "Choose" button), not just generic law.

---

## 0. Where the prototype stands today

Everything currently shipped is **frontend-only**: mock data, state in React Context, persistence in the browser's `localStorage`. No server, no database, no real signups, no real documents, no real payments. Practically, none of the obligations below are legally "live" yet — there is no real Data Fiduciary processing real personal data. This document is here so the *next* decisions (real backend, real onboarding, real payments) are made with these constraints already in view, instead of retrofitting compliance after the fact.

---

## 1. Data protection — DPDP Act, 2023 + DPDP Rules, 2025

The **Digital Personal Data Protection Act, 2023** is India's core data-protection law. It was substantively brought to life when the **DPDP Rules, 2025 were notified on 13–14 November 2025** (Gazette G.S.R. 846(E)). [Source](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190655&reg=48&lang=2)

### 1.1 Compliance timeline (phased — this matters for planning)

| Milestone | When | What kicks in |
|---|---|---|
| Rules notified | 13–14 Nov 2025 | Base framework in force |
| Consent Manager regime | **~Nov 2026** (1 year after notification) | Rule 4 — organisations offering consent-management flows must be ready |
| Full regime | **~May 2027** (18 months after notification) | Rules 3, 5–16, 22, 23 — notices, security safeguards, breach notification, data erasure, children's data, cross-border transfer, Significant Data Fiduciary (SDF) obligations |

[Source: Seclore DPDP Rules guide](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/), [Source: Matters.ai analysis](https://www.matters.ai/compliance/dpdp/dpdp-rules-2025)

**Implication for Trinity:** there's real runway before the heaviest obligations bind, but "notice + consent" and basic security-safeguard hygiene are good practice to build in from day one of a real backend, not deferred to the deadline.

### 1.2 Core obligations once real data is collected

- **Data Fiduciary / Data Principal**: Trinity (the platform) is the Data Fiduciary for both sides — clients *and* the CA/Advocate/CS/Accountant applicants (their name, email, category, experience, location are personal data too).
- **Notice + explicit consent** before collecting data — itemized, in clear language, not buried in a ToS. Today's sign-in/apply forms have no notice or consent checkbox at all.
- **Purpose limitation & data minimization** — only collect what's needed for matching + delivering the engagement.
- **Data Principal rights** — access, correction, erasure, and easy withdrawal of consent; a right to nominate someone to act on their behalf if they die or are incapacitated.
- **Grievance Officer** — must be appointed, with published contact details, once real.
- **Breach notification** — **72-hour** window to notify affected Data Principals after notifying the Data Protection Board, including plain-language description of what happened, what data was exposed, and protective steps. [Source](https://www.matters.ai/compliance/dpdp/dpdp-rules-2025)
- **Significant Data Fiduciary (SDF)** — if Trinity scales (volume/sensitivity of data), government can classify it as an SDF: adds a Data Protection Officer, independent annual data audits, and mandatory Data Protection Impact Assessments (DPIA).
- **Children's data** — parental consent needed if any user is a minor. Low relevance for a B2B/business-services app but note it exists.
- **Cross-border transfer** — generally permitted unless a country is specifically restricted by government notification — relevant if hosting outside India.
- **Retention vs. erasure tension** — DPDP wants data erased once purpose is served; Indian tax/company law (Income Tax Act, Companies Act) often *requires* retaining financial/compliance records for years (GST filings, ROC records). The privacy policy needs to reconcile this explicitly, not leave it implicit — "we retain X for Y years because Z statute requires it" is standard practice.

---

## 2. Professional-conduct rules — the part unique to *this* marketplace

This is the layer generic "build a marketplace" advice misses, and it directly affects the browse/rate/choose UX already built for `/providers`.

### 2.1 Advocates — the highest-risk category

- **Rule 36 of the Bar Council of India Rules, 1975** prohibits advocates from soliciting work or advertising, directly or indirectly — including through circulars, personal communication, or "furnishing" material for publication. [Source](https://ksandk.com/regulatory/indian-lawyers-no-ads-allowed-per-bar-council-rules/)
- **BCI has actively warned lawyers (March 2025)** against advertising via social media, promotional videos, and influencer endorsements. [Source](https://www.medianama.com/2025/03/223-the-bar-council-of-india-warns-against-legal-advertising-online/)
- **Madras High Court, *P.N. Vignesh v. Chairman & Members of the Bar Council of India* (3 July 2024)**: held that platforms like Quikr, Sulekha and JustDial were liable for hosting advocate advertisements. The court found that **grading lawyers, displaying prices, and connecting them to clients constitutes active solicitation** — a clear violation of BCI Rules 36/37 — and that this conduct **strips the platform of "safe harbour" protection under Section 79 of the IT Act**. The court directed BCI to register complaints and open disciplinary proceedings against advocates using such platforms. [Source](https://theindianlawyer.in/madras-high-court-directs-bar-council-of-india-to-take-action-against-advocates-and-websites-advertising-and-soliciting-legal-services/)
- **This is currently being contested** — JustDial has petitioned the Supreme Court, which has sought BCI's response (as of the most recent reporting). So the law is not fully settled, but the *direction of travel is hostile to exactly the pattern we built*: a rated, browsable, "Choose [Advocate name]" grid. [Source](https://www.thelawadvice.com/news/sc-seeks-bci-response-to-justdial-petition-challenging-madras-hc-order-on-advocate-misconduct-and-advertising)
- Advocates may only "furnish website information" in the specific form the BCI prescribes/approves — not open advertising.

**What this means for Trinity concretely:** the Advocate category in `/providers` (star ratings, review counts, "Choose Kavita Rao" button) is structurally the same thing the Madras HC just ruled against. Before this goes live with real advocates, the Advocate-facing UX likely needs to look different from the CA/CS/Accountant UX — e.g., informational directory listing only (no ratings, no comparative grading, no "matching" language), or advocates only reachable via their own furnished profile info rather than platform-driven selection. This needs a lawyer's sign-off specifically, not just a UI tweak.

### 2.2 Chartered Accountants — moderate risk, recently loosened

- ICAI amended its **Code of Ethics at the 447th Council Meeting (12 December 2025)**, giving CA firms more room to advertise and use "push technology" for services **not unique to the CA profession** (e.g. general accounting, consultancy). [Source](https://www.business-standard.com/india-news/icai-to-amend-code-of-ethics-allowing-ca-firms-to-advertise-use-websites-125102401239_1.html)
- **Key restriction that survives**: CAs/firms **may not list on app-based aggregator platforms for services *exclusively reserved* for CAs** (e.g. statutory audit sign-off). There is **no bar on listing for non-exclusive services** (bookkeeping, GST return preparation support, payroll, virtual CFO advisory-type work) — services a CA does but that aren't legally CA-exclusive.
- CAs are also permitted/encouraged to list on **government/regulator platforms** (e.g. GeM) and ICAI's own **"CA Connect"** listing portal.

**What this means for Trinity concretely:** the CA category is workable on an aggregator model *as long as the specific service being brokered isn't CA-exclusive work*. Worth explicitly separating "GST filing / bookkeeping / virtual CFO" (fine to list) from anything that amounts to statutory audit/attestation (CA-exclusive, don't list/broker that through a rated aggregator).

### 2.3 Company Secretaries — similar shape to Advocates, softer in practice

- Under **Part I of the First Schedule, Company Secretaries Act, 1980**, a CS in practice may not solicit clients or professional work directly or indirectly via circular, advertisement, personal communication, or any other means. [Source](https://www.icsi.edu/media/prb/pdf/GUIDANCE%20NOTE%20ON%20CODE%20OF%20CONDUCT%20FOR%20COMPANY%20SECRETARIES.pdf)
- **Exceptions**: responding to tenders/enquiries, and applying for work from another CS in practice, are both fine.
- **ICSI Guidelines for Advertisement, 2020** permit an informational write-up about services/firm — but it must not be used for solicitation, "portrayal of supremacy," or tall claims over other members.

**What this means for Trinity concretely:** similar caution to Advocates — a rated "Choose this CS" grid risks reading as solicitation. Framing the interaction as "you submitted a request, a CS responded to it" (closer to the tender/enquiry exception) is safer than "browse and pick from ranked profiles."

### 2.4 Net effect across categories

| Category | Aggregator/rating-style marketplace risk | Safer framing |
|---|---|---|
| Advocate | **High** — directly implicated by a 2024 HC ruling | Directory/informational listing, no ratings, no "matching"; may need to wait for the SC outcome |
| Company Secretary | **Medium** — solicitation rules similar to Advocates | Frame as "request → professional responds," not browse-and-pick |
| CA | **Medium-low**, recently loosened | Fine for non-exclusive services (GST/bookkeeping/CFO); avoid brokering CA-exclusive work (statutory audit) |
| Accountant (non-CA) | **Low** — not a regulated title with its own bar/institute solicitation rule the same way | Standard marketplace UX is fine |

---

## 3. Marketplace / e-commerce / intermediary rules

### 3.1 Consumer Protection (E-Commerce) Rules, 2020

Trinity, as a platform connecting clients to independent professionals (not selling the service itself), would be a **"Marketplace Entity"** under these rules. Key obligations once live: [Source](https://trilegal.com/knowledge_repository/consumer-protection-e-commerce-rules-2020/)

- Verify sellers'/professionals' credentials before listing them.
- Clearly display the professional's business name, contact details, and ratings (subject to §2 above re: whether ratings are even appropriate for Advocates/CS).
- Maintain a grievance redressal mechanism, return/refund-equivalent policy for services, and clear payment-method disclosures.
- Not manipulate search/ranking results in ways that mislead consumers about who they're being matched with.

### 3.2 IT (Intermediary Guidelines) Rules, 2021 / Section 79 IT Act "safe harbour"

- To keep intermediary safe-harbour (i.e., not be treated as legally responsible for what professionals post/do on the platform), Trinity would need to: publish terms of service & privacy policy, act on unlawful content when notified, provide a grievance mechanism, and **not play an "active role"** in creating/promoting the content (this is exactly the language the Madras HC used to strip Quikr/Sulekha/JustDial of safe harbour — active matching + ratings + pricing = active role).
- A **Grievance Officer** (India-resident, published contact) is required.

**This section and §2 are linked**: losing safe-harbour isn't just an abstract risk, it's the specific mechanism a court has already used against platforms shaped like Trinity's current `/providers` page.

---

## 4. Payments (only relevant once money moves through the platform)

Not needed for the current prototype (no payment flow exists), but flagged for when it's added:

- If Trinity ever **collects payment from a client and passes it to a professional** (classic marketplace payment flow), it falls under the **RBI's Payment Aggregator (PA) framework**, recently overhauled (2025 Master Directions). [Source](https://www.ikigailaw.com/article/639/rbi-rewrites-the-payment-aggregator-rulebook)
- Becoming an authorised PA yourself requires meaningful capital (₹15 crore net worth at application, rising to ₹25 crore by year three), an escrow account with a scheduled commercial bank, and merchant KYC.
- **Practical path for a startup-stage product**: route payments through an already-RBI-authorised PA (e.g. Razorpay, Cashfree, PayU) as a merchant/marketplace customer of theirs, rather than becoming a PA. This avoids the licensing burden entirely, at the cost of their fees and integration constraints.

---

## 5. What's already fine vs. what needs work — quick checklist

| Item | Current state | Needed before real launch |
|---|---|---|
| Notice & consent on sign-up | ❌ none | Add a notice + explicit consent checkbox before storing any personal data |
| Privacy policy / ToS | ❌ none | Draft one reconciling DPDP erasure duties with statutory retention (tax/company law) |
| Grievance Officer | ❌ none | Appoint + publish contact once real |
| Data Principal rights (access/correct/erase) | ❌ none (though profile edit exists in the mock dashboard) | Build real access/erasure flows against a real backend |
| Breach notification process | ❌ none (no real data to breach yet) | Have a plan before real data exists — 72-hour clock is unforgiving |
| Advocate listing UX (ratings/"Choose") | ⚠️ built exactly as current litigation targets | Get legal review before onboarding real advocates; likely needs a different, non-graded presentation |
| CA listing scope | ⚠️ not yet distinguishing "exclusive" vs "non-exclusive" CA work | Restrict brokered CA services to non-exclusive work only |
| CS listing UX | ⚠️ same browse/rate pattern as Advocates | Reframe as request/response rather than browse-and-pick |
| Marketplace seller verification (Consumer Protection E-Commerce Rules) | ❌ none — partner applications aren't actually verified, `/partner/admin` is a mock toggle | Real credential verification (ICAI/BCI/ICSI membership number check) before "approving" |
| Payments | Not built | Use a licensed PA (Razorpay/Cashfree/etc.), don't build one in-house |

---

## Sources

- [DPDP Rules, 2025 Notified — PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190655&reg=48&lang=2)
- [DPDP Rules 2025: India's Complete Compliance Guide — Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/)
- [DPDP Rules 2025: What the Rules Actually Say — Matters.ai](https://www.matters.ai/compliance/dpdp/dpdp-rules-2025)
- [BCI Tightens Rules on Lawyers Advertising Online — MediaNama](https://www.medianama.com/2025/03/223-the-bar-council-of-india-warns-against-legal-advertising-online/)
- [Indian Lawyers Are Banned From Advertising — KSandK](https://ksandk.com/regulatory/indian-lawyers-no-ads-allowed-per-bar-council-rules/)
- [Madras High Court Directs Bar Council of India to Take Action — The Indian Lawyer](https://theindianlawyer.in/madras-high-court-directs-bar-council-of-india-to-take-action-against-advocates-and-websites-advertising-and-soliciting-legal-services/)
- [SC Seeks BCI Response to JustDial Petition — The Law Advice](https://www.thelawadvice.com/news/sc-seeks-bci-response-to-justdial-petition-challenging-madras-hc-order-on-advocate-misconduct-and-advertising)
- [ICAI to Amend Code of Ethics, Allowing CA Firms to Advertise — Business Standard](https://www.business-standard.com/india-news/icai-to-amend-code-of-ethics-allowing-ca-firms-to-advertise-use-websites-125102401239_1.html)
- [ICSI Guidance Note on Code of Conduct for Company Secretaries](https://www.icsi.edu/media/prb/pdf/GUIDANCE%20NOTE%20ON%20CODE%20OF%20CONDUCT%20FOR%20COMPANY%20SECRETARIES.pdf)
- [Consumer Protection (E-Commerce) Rules, 2020 — Trilegal](https://trilegal.com/knowledge_repository/consumer-protection-e-commerce-rules-2020/)
- [Information Technology (Intermediary Guidelines) Rules, 2021 — Trilegal](https://trilegal.com/wp-content/uploads/2021/11/Information-Technology-Rules-2021.pdf)
- [RBI Rewrites the Payment Aggregator Rulebook — Ikigai Law](https://www.ikigailaw.com/article/639/rbi-rewrites-the-payment-aggregator-rulebook)
