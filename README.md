# MIXR

🎉 MIXR is a real-time party games platform built for crowds. It is designed to support live play at scale, with a focus on fast joining, shared game state, and experiences that can handle 500+ players.

`Meme It` is the first game on the platform. Players join with a code or QR, write captions for meme images, vote in real time, and watch the winners get revealed on the host screen.

## Why MIXR 🚀

- Built for large live groups, with a target of 500+ players.
- Real-time sync powered by Convex.
- No player account required to join and play.
- Designed as a platform for more games beyond `Meme It`.

## How It Works 🎮

1. A host creates a game.
2. Players join on their phones with a code or QR.
3. Everyone plays together in real time.

## Tech Stack

- React
- TypeScript
- Vite
- Convex

## Getting Started 🛠️

```bash
pnpm install
```

Create a local env file and add the values from `.env-example`:

```bash
CONVEX_DEPLOYMENT=
VITE_CONVEX_URL=
VITE_CONVEX_SITE_URL=
```

Start the app:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm typecheck
pnpm check
```
