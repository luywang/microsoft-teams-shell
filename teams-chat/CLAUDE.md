# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A static UI prototype of Microsoft Teams Chat. The goal is pixel-accurate fidelity to the real Teams UI. Nothing is interactive — this is a visual shell for future prototyping efforts.

## Commands

```bash
npm run dev      # Start dev server (Vite, HMR)
npm run build    # Production build to /dist
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

Single-page React app (React 19, Vite 8). No routing, no state management, no backend.

**Layout hierarchy:** `App` renders four panels left-to-right:
- `TitleBar` — top header bar with search
- `NavRail` — far-left vertical icon navigation
- `ChatList` — scrollable conversation list with tabs and sections
- `ChatView` — active chat messages + compose box

**Data layer:** All mock data lives in `src/data.js` — `currentUser`, `contacts`, `chats`, and `activeMessages`. Components import directly from this file. Current user is Gino Buzzelli (GB).

**Styling:** Component-scoped CSS files (one `.css` per `.jsx`). No CSS-in-JS, no Tailwind. Color tokens and design decisions are documented in `DESIGN_GUIDE.md` — always reference it before changing colors or layout surfaces.

## Key Conventions

- Messages from the current user are right-aligned with avatar on the right; other users' messages are left-aligned with avatar on the left.
- The prototype should look indistinguishable from real Microsoft Teams. When in doubt, reference the screenshots in `/images` (project root, outside this directory).
- When the user provides design guidance (colors, spacing, icon styles, typography, etc.), always update `DESIGN_GUIDE.md` with the new information in addition to implementing the change.
