# BEHAVIORS — App Shell: Observable Effects and User Interactions

```
STATUS: DRAFT
CREATED: 2024-02-23
VERIFIED: N/A
```

---

## CHAIN

```
OBJECTIVES:       ./OBJECTIVES_App_Shell.md
PATTERNS:        ./PATTERNS_App_Shell.md
THIS:            ./BEHAVIORS_App_Shell.md
ALGORITHM:       ./ALGORITHM_App_Shell.md
VALIDATION:      ./VALIDATION_App_Shell.md
IMPLEMENTATION:  ./IMPLEMENTATION_App_Shell.md
HEALTH:          ./HEALTH_App_Shell.md
SYNC:            ./SYNC_App_Shell_State.md
```

### Bidirectional Contract

**Before modifying this doc or the code:**
1. Read ALL docs in this chain first
2. Read the linked IMPL source file (if any)

**After modifying this doc:**
1. Update the IMPL source file to match, OR
2. Add a TODO in SYNC_App_Shell_State.md: "Docs updated, implementation needs: {what}"
3. Run tests: `pnpm lint` (or relevant frontend tests)

**After modifying the code:**
1. Update this doc chain to match, OR
2. Add a TODO in SYNC_App_Shell_State.md: "Implementation changed, docs need: {what}"
3. Run tests: `pnpm lint` (or relevant frontend tests)

---

## CORE BEHAVIORS

The App Shell orchestrates the fundamental, observable behaviors that define the baseline user experience for the Next.js application.

### 1. Global Layout Rendering

- **Description**: Upon initial load and subsequent page navigations, the App Shell consistently renders the core HTML structure, including `<html>` and `<body>` tags. This provides a stable canvas upon which all other application content is displayed.
- **Inputs**: Incoming Next.js request, child route components.
- **Outputs**: Well-formed HTML document structure, acting as a container for feature-specific content.
- **Side Effects**: Sets global `lang` attribute for accessibility.

### 2. Global Styling Application

- **Description**: All global CSS (e.g., `globals.css`, `connectome.css`, `reactflow/dist/style.css`) is loaded and applied at the application root. This ensures that a consistent visual theme, utility classes, and component-level resets are available and active across all pages without explicit per-page imports.
- **Inputs**: CSS file paths from `layout.tsx`.
- **Outputs**: Visually styled application interface.
- **Side Effects**: Modifies the visual presentation of all rendered HTML elements.

### 3. Application-Wide Metadata Management

- **Description**: Essential SEO and browser metadata, such as the application title and description, are defined once in `layout.tsx` and applied globally. This ensures consistency for search engines and social media previews.
- **Inputs**: Static metadata object in `layout.tsx`.
- **Outputs**: HTML `<head>` elements containing global metadata.
- **Side Effects**: Influences how the application appears in browser tabs and search results.

### 4. Root Path Redirection

- **Description**: When a user accesses the application's root URL (`/`), the App Shell immediately redirects them to a designated primary feature route, specifically `/mind`. This ensures users land on a functional page rather than an empty or placeholder root.
- **Inputs**: Access to the root URL (`/`).
- **Outputs**: HTTP 307 (Temporary Redirect) response, followed by navigation to `/mind`.
- **Side Effects**: Changes the browser's URL and loads the content of the `/mind` route.

---
