# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A high-fidelity static shell of the Microsoft Teams Chat UI, intended as a **forkable starting point for prototyping new Teams features**. The shell already looks like Teams out of the box, so prototype work can focus on the new feature rather than rebuilding chrome. There is no backend; all data is mocked.

Seeded content (messages, chat names, session titles, agent replies) should sound like it came from a real person's Teams. Read `PERSONA.md` before generating any new content — it describes the user's role, active projects, collaborators, and communication style. Reuse names and details from there instead of inventing generic placeholders.

## Repo Layout

```
teams-shell/            ← repo root
├── CLAUDE.md
├── DESIGN_GUIDE.md
├── PERSONA.md
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
- **ChannelThreadRail** — a channel post's replies thread (channel chats only; opens when a reply indicator is clicked)

### State lives in `App.jsx`

Hoisted so rails and the canvas stay in sync:

- `activeChatId` — which chat is open
- `readChatIds` (`Set`) — chats the user has visited; dismisses `bold` + unread-dot in `ChatList`
- `sessions` — per-agent list of past sessions (starts from `data/sessions.js`, augmented at runtime)
- `dynamicSessionMessages` — messages for sessions created during the prototype session
- `navIntent` — one-shot signal to open a specific session when cross-navigating between chats

`ChatView` owns local state for compose input, which rail is open, per-chat ephemeral flags, scripted/demo flow progress, etc. When `activeChatId` changes, the chat-level state is reset via the render-phase state-adjustment pattern (not a `useEffect`).

### Data layer

All mocks live in `src/data/` and are re-exported by `src/data.js` (the barrel). Components should import from the barrel — don't reach into `./data/<module>` directly.

- `contacts.js` — `currentUser`, `contacts` (people + agents + groups + channels), `favorites`, `projectNorthwind`, `chatList`, `teams`
- `messages.js` — `messagesByContact` (default 1:1/group message history keyed by contact id)
- `channelPosts.js` — `channelPostsByContact` (thread-style posts for channel contacts, keyed by channel contact id)
- `agents.js` — extra agent definitions (`copilotAgent`, `designerAgent`, `pollyAgent`, `breakthuAgent`) used in the agents rail but not part of the main contacts list
- `sessions.js` — `agentSessions`, the initial per-agent session lists
- `sessionMessages.js` — message history keyed by session id
- `promptSuggestions.js` — the 2×3 grid of prompt cards shown in the empty state for a new agent session, keyed by agent contact id

### Contact types

Everything is in the `contacts` array. The flags on a contact decide how it's rendered:

| Flag          | Rendering                                                              |
|---------------|-----------------------------------------------------------------------|
| `isAgent`     | Circular avatar, agent logo or avatar image, no status dot            |
| `isGroup`     | Circular avatar, initials, no status dot, optional `memberCount`      |
| `isChannel`   | Rounded-square avatar, chat renders as "Threads" layout (channel posts) |
| *(none)*      | Circular avatar with status dot (regular person)                      |

Channels are additionally grouped into teams via the `teams` export. Each team has an `id`, `name`, `initials`, `color`, and a `channels` array of `{ id, bold? }` entries referencing contact ids.

### Component layers

- `src/components/common/` — shared primitives meant for reuse across surfaces (`Avatar`, `LinkCard`, `IconButton`, `Icon` library, `PrivateDisclaimer`). Add a new reusable primitive here; don't inline SVGs or hand-roll a button when a common one fits.
- `src/components/` — feature components for the current surface:
  - `TitleBar`, `NavRail`, `ChatList` — chrome
  - `ChatView` — the main canvas router; delegates to `ChatHeader`, `Compose`, and the rails
  - `ChatHeader`, `Compose` — split out from `ChatView` to keep it focused on state + routing
  - `MessageRow` — one message bubble (reactions, thread reply badge, link cards, Adaptive Cards)
  - `MessageActions` — hover toolbar above a message (quick reactions, emoji picker, edit, more)
  - `PromptSuggestions` — empty-state 2×3 grid of suggestion cards for a new agent session
  - `SessionsRail`, `AgentsRail`, `ChannelThreadRail` — the right-side rails

### Styling

Component-scoped CSS: each `Foo.jsx` has a sibling `Foo.css`. No CSS-in-JS, no Tailwind. Color tokens, spacing, and surface decisions are documented in `DESIGN_GUIDE.md` — always consult it before changing colors or layout surfaces, and update it when the user provides new design guidance.

## Key Conventions

- Messages from the current user are right-aligned; other users are left-aligned with avatar on the left.
- In 1:1 chats the current user's avatar is **not** rendered on their own messages. In group chats it is.
- My own messages don't show a sender-name label — only a timestamp. Sender names elsewhere are regular weight, not bold.
- Agents vs people vs groups vs channels are all in `contacts` — distinguished by `isAgent` / `isGroup` / `isChannel` flags. An agent has either an `avatar` URL or a `logo` key that resolves via `shared/agentLogos.jsx`.
- Channel chats render as "Threads" — each post is a top-level message with a `subject`, body, and optional replies. Replies live in `ChannelThreadRail`, opened via the reply indicator on the post.
- Agents send rich content via **Adaptive Cards** (`message.cards`) — the framework recommended by the Teams team. See `DESIGN_GUIDE.md` for the card anatomy and links.
- The prototype should look indistinguishable from real Microsoft Teams. When in doubt, reference the design tokens in `DESIGN_GUIDE.md`.
- `currentUser` is a generic placeholder by design — don't hardcode a specific name/photo into it.
- There is a disabled scripted demo flow in `ChatView.jsx` (the `jiraScript` array + `isJiraInvocation` branch, gated by `JIRA_FLOW_ENABLED`). Leave it alone unless a task specifically asks about scripted/demo flows — it's kept as a reference pattern.

## When Adding Features

- Set up the scenario in `src/data/` first (new contact, message, agent, session, channel post)
- Any time you author new copy — messages, chat names, session titles, agent responses, draft text — consult `PERSONA.md` and match the user's voice, active projects, and collaborators. Reuse existing names/tickets/surface references instead of inventing new ones.
- Reach for `components/common/` primitives before rolling a new button, icon, or avatar. Import icons from `./common` (or `../common`) — the library is in `components/common/Icon.jsx`.
- Import data from `src/data.js` (the barrel), not from individual `src/data/*` files.
- If the user provides design guidance (colors, spacing, icon styles, typography, card patterns), update `DESIGN_GUIDE.md` in addition to implementing the change
