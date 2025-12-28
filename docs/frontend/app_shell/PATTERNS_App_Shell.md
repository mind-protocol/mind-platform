# App Shell — Patterns: Consistent Layout and Global Functionality for Next.js Application

```
STATUS: DRAFT
CREATED: 2024-02-23
VERIFIED: 2024-02-23 against Initial documentation
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_App_Shell.md
BEHAVIORS:      ./BEHAVIORS_App_Shell.md (planned)
THIS:            ./PATTERNS_App_Shell.md (you are here)
MECHANISMS:     N/A
ALGORITHM:       N/A
VALIDATION:      ./VALIDATION_App_Shell.md (planned)
HEALTH:          ./HEALTH_App_Shell.md (planned)
IMPLEMENTATION:  ./IMPLEMENTATION_App_Shell.md (planned)
SYNC:            ./SYNC_App_Shell_State.md

IMPL:            app/layout.tsx
IMPL:            app/page.tsx
```

### Bidirectional Contract

**Before modifying this doc or the code:**
1. Read ALL docs in this chain first
2. Read the linked IMPL source file

**After modifying this doc:**
1. Update the IMPL source file to match, OR
2. Add a TODO in SYNC_App_Shell_State.md: "Docs updated, implementation needs: {what}"
3. Run tests: `pnpm lint` (or relevant frontend tests)

**After modifying the code:**
1. Update this doc chain to match, OR
2. Add a TODO in SYNC_App_Shell_State.md: "Implementation changed, docs need: {what}"
3. Run tests: `pnpm lint` (or relevant frontend tests)

---

## THE PROBLEM

Without a clear "app shell" pattern, Next.js applications can suffer from inconsistent user experiences, duplicated boilerplate code across pages, and difficulty in managing global styles or shared components. Each new route might inadvertently introduce visual drift or redundant logic for common elements like headers, footers, or navigation.

---

## THE PATTERN

The App Shell pattern centralizes the core layout, global styles, and overarching routing structure of the Next.js application. It leverages Next.js App Router conventions (`layout.tsx`, `page.tsx`, `globals.css`) to define a consistent wrapper around all application content. This includes global CSS imports, metadata definitions, and persistent UI elements (e.g., a navbar or sidebar) that remain present regardless of the specific route being viewed. Sub-modules and pages then "plug into" this shell.

---

## BEHAVIORS SUPPORTED

- **Consistent Navigation**: Users experience a stable navigation structure across the entire application.
- **Global Styling Application**: All components automatically inherit global styles defined at the root.
- **Centralized Metadata Management**: SEO and social media metadata are managed from a single source (`layout.tsx`).
- **Efficient Asset Loading**: Global assets (e.g., fonts, main CSS) are loaded once at the root.

## BEHAVIORS PREVENTED

- **UI Fragmentation**: Prevents individual pages from having wildly different layouts or visual inconsistencies.
- **Redundant Code**: Avoids copying and pasting common UI elements or style imports into every page file.
- **Metadata Drift**: Ensures consistent application-wide metadata without per-page overrides causing issues.

---

## PRINCIPLES

### Principle 1: Centralized Layout and Global Context

The root `layout.tsx` is the single source of truth for the overall application structure and shared React Context providers. This ensures a consistent wrapper for all pages and allows for global state or theme management.

### Principle 2: Global-First Styling

All fundamental CSS resets, utility classes (e.g., Tailwind CSS base), and application-wide custom styles are imported and managed via `globals.css`. This prevents style conflicts and ensures a cohesive visual language.

### Principle 3: Adherence to Next.js App Router Conventions

The App Shell strictly follows the Next.js App Router's file-system-based routing, component co-location, and data fetching conventions. This makes the application predictable, maintainable, and aligned with framework best practices.

---

## DATA

| Source | Type | Purpose / Description |
|--------|------|-----------------------|
| `app/globals.css` | FILE | Contains global CSS variables, Tailwind directives, and base styles applied across the entire application. |
| `app/layout.tsx` | FILE | Defines the root React component tree, including HTML structure, head metadata, and global UI components (e.g., `<html>`, `<body>`, `NavBar`). |
| `app/page.tsx` | FILE | The default route for the root URL (`/`), serving as the main landing page of the application. |
| `app/api/**` | DIR  | Houses Next.js API routes that provide backend functionality to the frontend. |
| `app/mind/**` | DIR  | Contains Next.js pages or components specific to the `mind` feature. |

---

## DEPENDENCIES

| Module | Why We Depend On It |
|--------|---------------------|
| `next` | Core framework for the application's routing, rendering, and build system. |
| `react` | Fundamental library for building user interfaces. |
| `app/connectome` | A feature module that relies on the `app_shell` for its layout and global context. |
| `app/mind` | A feature module that uses the `app_shell` for its page rendering. |
| `tailwindcss` | Provides utility-first CSS for rapid UI development and consistent styling. |
| `zustand` | (If used for global state) Provides a lightweight, fast, and scalable state-management solution. |

---

## INSPIRATIONS

- **Next.js App Router Documentation**: Direct guidance on structuring modern React applications.
- **Atomic Design Principles**: Encourages breaking down UI into reusable, hierarchical components, starting from global elements.
- **Single Page Application (SPA) Best Practices**: Emphasizes fast client-side navigation and a consistent shell experience.

---

## SCOPE

### In Scope

- Defining the root HTML, body, and head elements in `layout.tsx`.
- Importing and applying global CSS (`globals.css`).
- Managing application-wide metadata (title, description, favicons).
- Providing persistent UI elements (e.g., a top navigation bar, persistent sidebars, footers).
- Handling top-level routing (e.g., `page.tsx` as the home route).
- Orchestrating global context providers (e.g., theme providers, auth providers).
- Defining top-level API routes (`app/api/**`).
- Defining top-level application-specific pages (`app/mind/**`).

### Out of Scope

- Implementing specific application features or complex business logic → see: `app/connectome`, `app/mind`
- Managing database interactions or external service integrations → see: `mind/infrastructure/api/` (for backend APIs)
- Defining components that are only used within a specific feature module → see: `app/connectome/components/`
- Performing low-level styling not related to global defaults → handled by local component styles or Tailwind classes within components.

---

## MARKERS

> See VIEW_Escalation for full YAML formats. Use `mind solve-markers` to triage.

<!-- @mind:todo
title: "Add unit tests for global layout stability"
priority: medium
context: |
  Currently, there are no explicit tests ensuring the root layout components (`layout.tsx`, `page.tsx`) render correctly and consistently. Regressions could lead to visual breaks or functional issues. 
task: |
  Implement basic rendering tests for `layout.tsx` and `page.tsx` using a testing framework like `@testing-library/react` to assert the presence of key elements (e.g., 'html' tag, body, global CSS links) and proper rendering of children. 
-->

<!-- @mind:proposition
title: "Evaluate server-side rendering (SSR) vs. static site generation (SSG) for root pages"
priority: low
context: |
  The current Next.js setup defaults to SSR. For performance or caching benefits, SSG might be considered for static root pages if content doesn't change frequently. 
implications: |
  Changes data fetching strategies for `page.tsx` and potentially `layout.tsx`. 
suggested_changes: |
  Research the trade-offs of SSR vs. SSG for `app/page.tsx` and propose a strategy based on content dynamism and performance goals. 
-->
