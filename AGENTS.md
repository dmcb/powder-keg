# AGENTS.md

## Verification commands

- Type check: `npx tsc --noEmit` (strict mode is enabled in `tsconfig.json`)
- Production build: `npm run build` — don't run this while `npm run dev` is
  running: both write to `.next/`, and the build clobbers the dev server's
  output (e.g. `/_next/static/css/app/layout.css` starts 404ing and all
  styles disappear until the dev server is restarted). Prefer `npx tsc
--noEmit` for verification when a dev server is up.
- Dev server: `npm run dev`
- `next lint` has not been configured yet (no ESLint config present); running it
  will prompt for first-time setup.

## Notes

- `@types/react` / `@types/react-dom` are pinned to the 18.3.x line to match
  the `react`/`react-dom` runtime version — leaving them unpinned lets npm
  resolve a mismatched v19 types package transitively (via zustand/r3f
  dependents), which breaks `@react-three/fiber`'s JSX.IntrinsicElements
  augmentation under `strict` type checking.
- Audio goes through the `audio` singleton in `lib/audio.ts` (Web Audio, no
  howler/use-sound). Register new sounds in `config/sounds.ts` and call
  `audio.play(name)`. `components/ui/AudioUnlock.tsx` creates the context on
  app load and resumes it on the first user activation.
- Game time is centralized in `lib/gameClock.ts` (ticked by
  `components/canvas/GameClock.tsx`) and only advances while unpaused. Game
  logic/animation should use `useGameFrame` (`hooks/useGameFrame.ts`), which
  is skipped while paused and receives game-time `delta`/`elapsed` — not raw
  `useFrame`, `state.clock` or `Date.now()`. Raw `useFrame` is only for work
  that must run while paused (rendering in `SplitScreen`, input edge tracking
  in `usePlayerControls`).
- `app/page.tsx` wraps its `useSearchParams()` usage in a `Suspense` boundary;
  Next.js requires this for static export of pages that read search params.
