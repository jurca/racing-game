# Project Guidelines

## Code Style
- Use TypeScript with strict typing and preserve the existing class-heavy architecture.
- Follow existing naming and visibility patterns from [engine/AbstractGameObject.ts](engine/AbstractGameObject.ts) and [engine/Vector3.ts](engine/Vector3.ts):
  - `PascalCase` for classes and types.
  - `camelCase` for methods and fields.
  - ECMAScript private fields (`#field`) for internal mutable state.
  - `readonly` for immutable references where possible.
- Prefer extending existing base abstractions instead of adding parallel patterns:
  - Objects: [engine/AbstractGameObject.ts](engine/AbstractGameObject.ts), [engine/TickUpdatedGameObject.ts](engine/TickUpdatedGameObject.ts)
  - Rendering: [engine/AbstractRenderer.ts](engine/AbstractRenderer.ts), [engine/Renderer.ts](engine/Renderer.ts)
  - Camera: [engine/AbstractCamera.ts](engine/AbstractCamera.ts), [game/Pseudo3DCamera.ts](game/Pseudo3DCamera.ts)

## Architecture
- Keep engine and game layers separated:
  - `engine/`: generic loop, math, renderer, camera, and game object abstractions.
  - `game/`: game-specific camera behavior, scene composition, track and object implementations.
  - `conf/`: static configuration (for example sprite descriptors).
  - `profiler/`: optional profiling/decorator components.
- Preserve render/update flow used by [game/main.ts](game/main.ts), [engine/Game.ts](engine/Game.ts), and [engine/TickUpdater.ts](engine/TickUpdater.ts).
- Reuse current object tree traversal and relative rendering model from [engine/AbstractRenderer.ts](engine/AbstractRenderer.ts) and [engine/Canvas2DRenderer.ts](engine/Canvas2DRenderer.ts).

## Build and Test
- Install dependencies: `npm ci`
- Lint check (`test` script): `npm test`
- TypeScript watch build: `npm run dev`
- Local static server: `npm start`
- Primary scripts are defined in [package.json](package.json).

## Project Conventions
- Implement per-tick logic in `updateTick(...)` for tick-updated objects; do not implement runtime behavior in `update(...)` for classes derived from [engine/TickUpdatedGameObject.ts](engine/TickUpdatedGameObject.ts).
- When adding track/segment logic, preserve assumptions in [game/object/Track.ts](game/object/Track.ts) (segments ordered by Z for culling/search behavior).
- Keep math utilities immutable (return new vectors instead of mutating inputs), consistent with [engine/Vector2.ts](engine/Vector2.ts) and [engine/Vector3.ts](engine/Vector3.ts).
- Avoid introducing additional global-script style code in new TypeScript modules.
- Class member order: public static fields, private static fields, public fields, protected fields, private fields, public methods, private methods.

## Agent Notes
- This workspace is performance-sensitive. Prefer changes that avoid per-frame allocations in hot paths unless readability or correctness requires it.
- Browser/GPU behavior is variable; avoid assumptions that only hold on one browser.
- Do NOT pay attention to the contents of the [README.md](README.md), that file is extremely outdated.
- Do not duplicate long design notes in instructions; link to [NOTES](NOTES) for roadmap and idea backlog.
