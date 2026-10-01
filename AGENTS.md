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
  `components/canvas/GameClock.tsx`) and only advances while the game isn't
  frozen (`isFrozen` in `stores/gameStore.ts`: paused, or during the
  countdown after resuming — the countdown at the start of a game runs the
  world). Player input is locked separately (`areControlsLocked`: paused or
  any countdown). A match is a fixed length of game time (`config/match.ts`:
  start countdown + match length), so pausing during the start countdown
  restarts it (`resume()` resets `gameClock`), and the sun's position is
  calculated from `elapsed` rather than accumulated. Game logic/animation should use `useGameFrame`
  (`hooks/useGameFrame.ts`), which receives game-time `delta`/`elapsed` — not
  raw `useFrame`, `state.clock` or `Date.now()`. It still runs while frozen
  (with `delta` 0) so derived state (lighting, player positions) stays in
  place: scale logic by `delta`, and gate anything that isn't (e.g. firing)
  on player input. Raw `useFrame` is for work that needs wall time (rendering and the
  countdown zoom in `SplitScreen`, input edge tracking in
  `usePlayerControls`).
- Styles are plain native CSS (global, non-module, no Sass — `sass` is not
  installed) co-located with components: `Foo.tsx` does
  `import "./Foo.css";`. Only `styles/main.css` (imported in
  `app/layout.tsx`) is shared — it holds `:root` CSS custom properties
  (`--color-*`, `--font-*`) plus `html`/`body`/`h1`. Use `var(--color-…)`
  rather than hex literals. Write flat selectors — no CSS nesting, since
  Next 14's bundled PostCSS passes it through untranspiled. Since all CSS is
  global, prefix class names with the component name (e.g.
  `.scoreboard-player-health`) and don't rely on cross-file cascade order —
  use specificity instead. `styles.d.ts` declares `*.css` so these
  side-effect imports type-check under `noUncheckedSideEffectImports` (on by
  default in newer TypeScript / editors; Next only ships types for
  `*.module.css`).
- `app/page.tsx` wraps its `useSearchParams()` usage in a `Suspense` boundary;
  Next.js requires this for static export of pages that read search params.
