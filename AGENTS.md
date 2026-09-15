# AGENTS.md

## Verification commands

- Type check: `npx tsc --noEmit` (strict mode is enabled in `tsconfig.json`)
- Production build: `npm run build`
- Dev server: `npm run dev`
- `next lint` has not been configured yet (no ESLint config present); running it
  will prompt for first-time setup.

## Notes

- `@types/react` / `@types/react-dom` are pinned to the 18.3.x line to match
  the `react`/`react-dom` runtime version — leaving them unpinned lets npm
  resolve a mismatched v19 types package transitively (via zustand/r3f
  dependents), which breaks `@react-three/fiber`'s JSX.IntrinsicElements
  augmentation under `strict` type checking.
- `app/page.tsx` wraps its `useSearchParams()` usage in a `Suspense` boundary;
  Next.js requires this for static export of pages that read search params.
