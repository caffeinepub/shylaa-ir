# Specification

## Summary
**Goal:** Build a Persian-first (RTL) SEO & content marketing dashboard for shylaa.ir with authenticated admin/workspace features, a curated free listing directory + tracking workflow, content drafting with SEO analysis, keyword workflows, and lightweight performance tracking.

**Planned changes:**
- Create a responsive RTL-first UI with Persian typography/numerals and an English (LTR) language toggle.
- Add Internet Identity sign-in/out and restrict all create/edit/delete actions to authenticated sessions (public browsing for reference content only).
- Implement the “Free Site Listing” catalog with stored platform entries, list/filter UI, and per-platform detail pages.
- Add per-user submission planning and tracking (status, notes, evidence URLs, dates) plus a status summary dashboard.
- Build the “SEO Content Generator” workspace to create projects from a topic (optional image upload), generate structured drafts, store version history, and export/copy as Markdown.
- Add keyword research workflows with admin-configurable external REST keyword provider endpoints and a manual keyword mode with scoring and density targets.
- Implement an SEO analyzer for drafts (title/meta length checks, heading structure, keyword density, readability heuristics, reading time) and store results.
- Add “Performance Tracking” for pages/keywords with manual metrics entry, CSV import/export, association to drafts, and comparison/timeline charts.
- Provide an in-app admin panel to manage platforms, submission plans, drafts, keywords/providers, and performance records with search/filtering, timestamps, and destructive-action confirmations.
- Implement persistent storage and authorization-aware CRUD/query APIs in a single Motoko actor for all core entities.
- Apply a distinctive, coherent visual theme (non-blue/purple primary palette) and add bilingual in-app help tips plus a dismissible onboarding checklist.

**User-visible outcome:** Users can browse a curated directory of free listing platforms publicly; signed-in users can manage the catalog, create and track a submission plan for shylaa.ir, generate and version SEO drafts (with keyword inputs and analysis), record performance metrics with CSV import/export and charts, and administer all records through a themed, RTL-polished dashboard with Persian/English help content.
