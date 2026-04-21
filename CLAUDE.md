# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A high-fidelity static shell of the Microsoft Teams Chat UI, intended as a **forkable starting point for prototyping new Teams features**. The shell already looks like Teams out of the box, so prototype work can focus on the new feature rather than rebuilding chrome. There is no backend; all data is mocked.

## Repo Layout

```
teams-shell/            ← repo root
├── CLAUDE.md
├── DESIGN_GUIDE.md
├── README.md
├── images/avatars/     Agent logo/avatar sources (Copilot, Designer, Jira, Claude)
├── public/             Static assets (avatars, favicon, icons)
└── src/                App code
```

## Commands

Run from the repo root:

```bash
npm run dev      # Vite dev server with HMR (http://localhost:5173)
npm run build    # Production build to dist/
npm run lint     # ESLint
npm run preview  # Serve the production build locally
```

No test runner is configured.

## Architecture

Single-page React 19 app built with Vite 8. No routing, no state management library. All paths below are relative to the repo root.

### Layout

`src/App.jsx` owns the top-level state and renders:

```
┌──────────────────────── TitleBar ───────────────────────┐
│ NavRail │ ChatList │ ChatView (+ optional right rails) │
└─────────┴──────────┴──────────────────────────────────────┘
```

`ChatView` can render up to two right-hand rails alongside the main canvas:
- **SessionsRail** — list of past agent sessions for the active agent chat (agent chats only)
- **AgentsRail** — agents in the current conversation + per-agent private chat thread

### State lives in `App.jsx`

Hoisted so rails and the canvas stay in sync:

- `activeChatId` — which chat is open
- `readChatIds` (`Set`) — chats the user has visited; dismisses `bold` + unread-dot in `ChatList`
- `sessions` — per-agent list of past sessions (starts from `data/sessions.js`, augmented at runtime)
- `dynamicSessionMessages` — messages for sessions created during the prototype session
- `navIntent` — one-shot signal to open a specific session when cross-navigating between chats

`ChatView` owns local state for compose input, which rail is open, scripted/demo flow progress, etc.

### Data layer

All mocks live in `src/data/` and are re-exported by `src/data.js` (the barrel). Components import from either — prefer the barrel.

- `contacts.js` — `currentUser`, `contacts` (people + agents + groups), `favorites`, `chatList`
- `messages.js` — `messagesByContact` (default message history keyed by contact id)
- `agents.js` — extra agent definitions (`copilot`, `designer`, `polly`, `breakthu`) not in the main contacts list
- `sessions.js` — `agentSessions`, the initial per-agent session lists
- `sessionMessages.js` — message history keyed by session id

### Component layers

- `src/components/common/` — shared primitives meant for reuse across surfaces (`Avatar`, `LinkCard`, `IconButton`, `Icon` library, `PrivateDisclaimer`). Add a new reusable primitive here; don't inline SVGs or hand-roll a button when a common one fits.
- `src/components/` — feature components for the current surface (`TitleBar`, `NavRail`, `ChatList`, `ChatView`, `MessageRow`, `SessionsRail`, `AgentsRail`).

### Styling

Component-scoped CSS: each `Foo.jsx` has a sibling `Foo.css`. No CSS-in-JS, no Tailwind. Color tokens, spacing, and surface decisions are documented in `DESIGN_GUIDE.md` — always consult it before changing colors or layout surfaces, and update it when the user provides new design guidance.

## Key Conventions

- Messages from the current user are right-aligned; other users are left-aligned with avatar on the left.
- In 1:1 chats the current user's avatar is **not** rendered on their own messages. In group chats it is.
- My own messages don't show a sender-name label — only a timestamp. Sender names elsewhere are regular weight, not bold.
- Agents vs people vs groups are all in `contacts` — distinguished by `isAgent` / `isGroup` flags. An agent has either an `avatar` URL or a `logo` key that resolves via `shared/agentLogos.jsx`.
- The prototype should look indistinguishable from real Microsoft Teams. When in doubt, reference the design tokens in `DESIGN_GUIDE.md`.
- `currentUser` is a generic placeholder by design — don't hardcode a specific name/photo into it.
- There is a disabled scripted demo flow in `ChatView.jsx` (the `jiraScript` array + `isJiraInvocation` branch, gated by `JIRA_FLOW_ENABLED`). Leave it alone unless a task specifically asks about scripted/demo flows — it's kept as a reference pattern.

## When Adding Features

- Set up the scenario in `src/data/` first (new contact, message, agent, or session)
- Reach for `components/common/` primitives before rolling a new button, icon, or avatar
- If the user provides design guidance (colors, spacing, icon styles, typography), update `DESIGN_GUIDE.md` in addition to implementing the change
