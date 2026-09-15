# Powder Keg — Restructuring Plan

## Current State (post-upgrade)

- **Next.js 14.2** / React 18.3 / TypeScript 5.7
- **R3F v8.18** / drei 9.x / three 0.170
- **@react-three/cannon** for physics (unmaintained since 2023)
- **Zustand 5** for state
- Local multiplayer via Gamepad API, Pusher for networking
- SCSS for styling

---

## Phase 1: Code Cleanup & Typing

### 1.1 Enable strict TypeScript

- Set `"strict": true` in tsconfig and fix all resulting errors
- Add explicit return types to exported functions
- Replace `any` / untyped props (e.g. `Ocean(props)`, `Player.tsx` dynamic key access)

### 1.2 Fix the playerStore data model

The current store hard-codes `player0`–`player3` as separate fields with dynamic key access (`state["player" + number]`). Replace with a `players: Player[]` array:

```ts
type PlayerStore = {
  players: Player[];
  joinedPlayers: number[];
  updatePlayer: (index: number, data: Partial<Player>) => void;
  updatePlayerHealth: (index: number, delta: number) => void;
};
```

### 1.3 Remove dead code

- Commented-out camera lerp logic in `Camera.tsx`
- Unused `useLayoutEffect` import in `Camera.tsx`
- Unused `axios` dependency (only used for Pusher? verify)
- Console.log statements in production paths

### 1.4 Extract constants & config

- Move magic numbers (cooldowns, physics params, camera distances, color scales) into a `config/` directory
- Separate biome color definitions into `config/biomes.ts`
- Seed word lists into `config/seeds.ts`

---

## Phase 2: Architecture for Expansion

### 2.1 Proposed directory structure

```
app/
  layout.tsx
  page.tsx
  api/
    pusher/

components/
  canvas/           # R3F canvas wrappers & providers
    GameCanvas.tsx
    LobbyCanvas.tsx
  entities/         # Game objects with logic + visuals
    Player/
      Player.tsx
      PlayerShip.tsx
      PlayerCannon.tsx
      usePlayerControls.ts
    Cannonball.tsx
  environment/      # Scene dressing (no game logic)
    Terrain.tsx
    Ocean.tsx
    Sun.tsx
    Border.tsx
  ui/               # HTML overlays
    Lobby/
    HUD/
    Scoreboard/

config/
  biomes.ts
  physics.ts
  camera.ts
  seeds.ts

hooks/
  useGamepad.ts
  useCountdown.ts
  usePhysicsSubscription.ts

lib/
  noise.ts
  kelvin.ts
  pusher.ts

stores/
  gameStore.ts
  playerStore.ts
  inputStore.ts       # merge gamepad + keyboard + network input
```

### 2.2 Separate concerns in Player

`Player.tsx` (270 lines) mixes physics, input, audio, and rendering. Split into:

- **`usePlayerControls.ts`** — reads gamepad, emits intents (turn, setSails, fire)
- **`usePlayerPhysics.ts`** — applies forces, subscribes to cannon body
- **`PlayerShip.tsx`** — visual mesh (Ship) + sail state
- **`PlayerCannon.tsx`** — cannonball spawning & lifecycle

### 2.3 Input abstraction layer

Create `hooks/useGamepad.ts` that normalizes gamepad input into actions, making it easy to add keyboard/touch/network input sources later:

```ts
type PlayerInput = {
  steer: number; // -1 to 1
  sailUp: boolean;
  sailDown: boolean;
  firePort: boolean;
  fireStarboard: boolean;
};
```

### 2.4 Scene management

Replace the string-based `gameScene` state with a proper scene system:

```ts
type GameScene = "lobby" | "countdown" | "playing" | "results";
```

Move countdown logic out of `Game.tsx` into a shared hook or state transition.

---

## Phase 3: Physics Migration (cannon → rapier)

### Why

- `@react-three/cannon` is unmaintained (last release Aug 2023)
- `@react-three/rapier` is actively maintained, faster, and supports R3F v9
- Enables upgrade path to React 19 + Next.js 15 + R3F v9

### Migration steps

1. Install `@react-three/rapier`
2. Replace `<Physics>` provider (gravity API is similar)
3. Replace `useCompoundBody` → `<RigidBody>` + `<CuboidCollider>` / `<BallCollider>`
4. Replace `useTrimesh` → `<TrimeshCollider>` on terrain
5. Replace `api.applyImpulse` / `api.applyTorque` with rapier equivalents
6. Remove `@react-three/cannon`
7. Upgrade to R3F v9 + React 19 + Next.js 15

### Estimated scope

- ~200 lines of physics code across `Player.tsx`, `Board.tsx`, `Terrain.tsx`, `Cannonball.tsx`, `Border.tsx`
- API is conceptually similar; main effort is testing collision behavior

---

## Phase 4: Gameplay Expansion Readiness

### 4.1 Entity system

Introduce a lightweight entity pattern so new game objects (power-ups, obstacles, AI ships) follow a consistent structure:

```
entities/
  [EntityName]/
    [EntityName].tsx          # R3F visual component
    use[EntityName]Logic.ts   # Game logic hook
    [EntityName].config.ts    # Tunables
```

### 4.2 Event system

Add a simple Zustand middleware for game events (damage, pickups, scoring) so systems can react without tight coupling.

### 4.3 Audio system

Replace per-component `useSound` calls with a centralized audio manager that handles pooling, volume, and spatial audio.

---

## Priority Order

| Priority | Task                              | Effort  |
| -------- | --------------------------------- | ------- |
| 1        | Phase 1.2 — Fix playerStore model | Small   |
| 2        | Phase 2.2 — Split Player.tsx      | Medium  |
| 3        | Phase 2.3 — Input abstraction     | Small   |
| 4        | Phase 1.1 — Strict TypeScript     | Medium  |
| 5        | Phase 2.1 — Directory restructure | Medium  |
| 6        | Phase 3 — Rapier migration        | Large   |
| 7        | Phase 4 — Expansion systems       | Ongoing |
