# App Shell — Sync: Current State

```
LAST_UPDATED: 2024-02-23
UPDATED_BY: agent
STATUS: DESIGNING
```

---

## MATURITY

**What's canonical (v1):**
- The basic Next.js App Router structure with `layout.tsx`, `page.tsx`, and `globals.css` is in place.
- Module mapping in `modules.yaml` now includes `app_shell`.

**What's still being designed:**
- Detailed behaviors for global error handling and loading states.
- Specific performance optimization strategies for the root layout.
- Comprehensive test coverage for root components.

**What's proposed (v2+):**
- Dynamic theme switching at the app shell level.
- Advanced internationalization (i18n) integration in the root layout.

---

## CURRENT STATE

The `app_shell` module provides the foundational Next.js frontend application structure. It includes the `layout.tsx` for the global layout, `page.tsx` as the entry point for the home route, and `globals.css` for application-wide styles. The module also encompasses the top-level `api` routes and `mind` specific pages, ensuring a consistent user experience and architectural alignment across the frontend. The `modules.yaml` file has been updated to include a mapping for this module.

---

## IN PROGRESS

### Initial Module Documentation Creation

- **Started:** 2024-02-23
- **By:** agent  
- **Status:** In progress - docs created, `DOCS:` references pending.
- **Context:** This task aims to establish baseline documentation for the `app_shell` module, addressing the "UNDOCUMENTED" issue. The core doc files (OBJECTIVES, PATTERNS, SYNC) have been created, and the module is mapped in `modules.yaml`. The next step is to add `DOCS:` references to the primary source files.

---

## RECENT CHANGES

### 2024-02-23: Initial Documentation of App Shell Module

- **What:** Created `OBJECTIVES_App_Shell.md`, `PATTERNS_App_Shell.md`, and `SYNC_App_Shell_State.md` in `docs/frontend/app_shell/`. Updated `modules.yaml` to include the `app_shell` module mapping.
- **Why:** To address the "UNDOCUMENTED" issue for the `app` directory and provide a clear definition of the Next.js frontend application's core structure and responsibilities, following the `VIEW_Document_Create_Module_Documentation.md`.
- **Files:**
    - `modules.yaml`
    - `docs/frontend/app_shell/OBJECTIVES_App_Shell.md`
    - `docs/frontend/app_shell/PATTERNS_App_Shell.md`
    - `docs/frontend/app_shell/SYNC_App_Shell_State.md`
- **Struggles/Insights:** Identifying the exact scope of the "app" module, as subdirectories like `app/connectome` already have specific documentation. Decided to define `app_shell` as the overarching Next.js root, including global files and top-level feature directories (`api`, `mind`).

---

## KNOWN ISSUES

### Missing `DOCS:` References in Source Files

- **Severity:** medium
- **Symptom:** Source files (`app/layout.tsx`, `app/page.tsx`, etc.) do not yet contain `DOCS:` references pointing to `docs/frontend/app_shell/PATTERNS_App_Shell.md`.
- **Suspected cause:** This is part of the ongoing documentation task.
- **Attempted:** Not yet attempted; this is the next step.

---

## HANDOFF: FOR AGENTS

**Your likely VIEW:** `VIEW_Implement_Write_Or_Modify_Code.md` or `VIEW_Document_Update_Codebase_Documentation.md`

**Where I stopped:** After creating the initial module documentation files and updating `modules.yaml`. The `DOCS:` references in the source code are still pending.

**What you need to understand:**
The `app_shell` module is intended to cover the general Next.js application structure, layout, and global styling. Specific feature subdirectories like `app/connectome` will maintain their own detailed documentation chains. The glob pattern in `modules.yaml` for `app_shell` intentionally includes `api/**` and `mind/**` to ensure these top-level Next.js routes are associated with the main application documentation, even if they later get more specific docs.

**Watch out for:**
Do not duplicate existing `connectome` or other specific module documentation. Ensure `DOCS:` references are added at the top of the relevant `tsx` files, pointing to `docs/frontend/app_shell/PATTERNS_App_Shell.md`.

**Open questions I had:**
- Is the chosen glob pattern for `app_shell` (`app/{globals.css,layout.tsx,page.tsx,api/**,mind/**}`) sufficiently precise and encompassing for the module's intended scope?
- Should `app/api/**` or `app/mind/**` eventually become separate, more granular modules in `modules.yaml`, or are they appropriately grouped under `app_shell` for now as top-level application concerns?

---

## HANDOFF: FOR HUMAN

**Executive summary:**
Initial documentation for the Next.js frontend application shell (`app_shell`) has been created, including its objectives, design patterns, and current state. The module has been mapped in `modules.yaml` to resolve an "UNDOCUMENTED" issue. The next step is to link the documentation from the relevant source files.

**Decisions made:**
- Chose "app_shell" as the module name for the root Next.js application, located in `docs/frontend/app_shell/`.
- Defined the code glob for `app_shell` to include `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/api/**`, and `app/mind/**`.
- Classified the module's maturity as `DESIGNING` since it's newly documented and detailed behaviors are still evolving.

**Needs your input:**
- Confirmation on the chosen module name and its scope.
- Guidance on whether `app/api/**` and `app/mind/**` should remain part of `app_shell` or be broken out into their own modules in the future.

---

## POINTERS

- **OBJECTIVES**: `docs/frontend/app_shell/OBJECTIVES_App_Shell.md`
- **PATTERNS**: `docs/frontend/app_shell/PATTERNS_App_Shell.md`
- **MODULES MAPPING**: `modules.yaml` (See the `app_shell` entry for module scope definition.)

---

## TODO

### Doc/Impl Drift

- [ ] DOCS→IMPL: Add `DOCS:` references to `app/layout.tsx`, `app/page.tsx`, and potentially other key files within the `app_shell` scope (e.g., in `app/api/route.ts` files or `app/mind/page.tsx`).

### Tests to Run

```bash
pnpm lint
pnpm dev # (to manually verify the app still runs)
```

### Immediate

- [ ] Add `DOCS:` references to `app/layout.tsx` and `app/page.tsx`.
- [ ] Review `app/api/**/*.ts` and `app/mind/**/*.tsx` to determine if they need individual `DOCS:` references or if the `app_shell` reference is sufficient for now.

### Later

- [ ] Create `BEHAVIORS_App_Shell.md`, `VALIDATION_App_Shell.md`, `HEALTH_App_Shell.md`, and `IMPLEMENTATION_App_Shell.md`.
- IDEA: Integrate `app_shell` with a global theme provider for dynamic theme switching.

---

## CONSCIOUSNESS TRACE

**Mental state when stopping:**
Confident that the initial module documentation is in place and correctly mapped. The scope of `app_shell` seems reasonable for a top-level Next.js application module, but the inclusion of `api/**` and `mind/**` as part of its glob, while practical for initial mapping, might warrant further discussion for granularity in the future.

**Threads I was holding:**
- The distinction between the Python `app.py` (FastAPI) and the Next.js `app/` directory.
- Ensuring the `app_shell` documentation doesn't overlap or conflict with existing `connectome` documentation.
- The need to add `DOCS:` references in the actual source files, which is a critical next step.

**Intuitions:**
The `app` directory in Next.js serves a very specific "shell" role in many ways, handling global concerns. Grouping related top-level features like `api` and `mind` within its documentation makes sense as they are direct children and consumers of this shell.

**What I wish I'd known at the start:**
A clearer definition of what "app" meant in the context of "Target: `app`" (i.e., the Next.js frontend root vs. a backend `app.py`). It became clear during the `grep` and directory listing.
