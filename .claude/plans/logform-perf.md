# LogForm Performance Optimization

## Problem
`LogForm.tsx` (2232 lines) causes 1.7s render on submit click. Every `setState` re-renders the entire component including 25 substance-specific form sections and the MIND Analysis card.

## Root Cause
Single monolithic component with 20+ state variables. When `setSubmitting(true)` fires, React reconciles 2232 lines of JSX — all 25 `{tab === 'xxx' && (...)}` blocks, the yoga timer, the analysis card, etc.

## Strategy: Split into 3 extracted components

### 1. `SubstanceFields.tsx` (NEW) — biggest win
Extract lines 401-1960 (~1560 lines) into a single component:
```tsx
const SubstanceFields = React.memo(function SubstanceFields({
  tab, details, setDetails, t
}: { ... }) {
  switch (tab) {
    case 'thc': return <ThcFields details={details} setDetails={setDetails} />;
    case 'cbd': return <CbdFields ... />;
    // ...etc
  }
});
```
- Each substance section becomes a function inside SubstanceFields (no need for 25 separate files)
- `React.memo` prevents re-render when `submitting`, `mindAnalysis`, `feedback`, `yogaTimer*` change
- Only re-renders when `tab` or `details` change (which is the correct behavior)

### 2. `MindAnalysisCard.tsx` (NEW)
Extract lines 2047-2227 (~180 lines):
```tsx
const MindAnalysisCard = React.memo(function MindAnalysisCard({
  analysis, analyzing
}: { ... }) {
  const [collapsed, setCollapsed] = useState(false);
  // ... render
});
```
- Owns its own `collapsed` state (removes `analysisCollapsed` from parent)
- `React.memo` prevents re-render on tab/amount/details changes

### 3. `YogaSection.tsx` (NEW)
Extract yoga timer + analysis (~200 lines, from within the `{tab === 'yoga' && ...}` block):
```tsx
function YogaSection({
  onTimerDone, onAnalysis, t
}: { ... }) {
  const [timerSecs, setTimerSecs] = useState(180);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(180);
  // ... timer effect, analyze function, render
}
```
- Owns all yoga state (removes 7 state variables from parent)
- Timer interval is fully self-contained

## Expected Result
- Parent LogForm drops from ~2232 to ~400 lines
- Submit click re-renders only: parent shell (~400 lines) + MindAnalysisCard (memo, skipped if analysis unchanged)
- Tab switch re-renders: parent shell + SubstanceFields (just one substance's JSX)
- Yoga timer ticks: only YogaSection re-renders

## Files to create/modify
1. **CREATE** `app/[locale]/(public)/tracker/components/SubstanceFields.tsx`
2. **CREATE** `app/[locale]/(public)/tracker/components/MindAnalysisCard.tsx`
3. **CREATE** `app/[locale]/(public)/tracker/components/YogaSection.tsx`
4. **MODIFY** `app/[locale]/(public)/tracker/components/LogForm.tsx` — remove extracted code, import new components

## Risks
- Props interface between parent and SubstanceFields needs to pass `details`/`setDetails` — stable references via useCallback
- Yoga section uses `yogaStartTime` ref and calls parent's `submit()` — pass as callback prop
- No behavior change — pure refactor, same UI
