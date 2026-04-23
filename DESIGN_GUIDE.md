# Design Guide

## Color Palette

### Layout Surfaces

| Element | Hex | Usage |
|---------|-----|-------|
| Title Bar | `#ECE4DD` | Top header bar containing search and navigation |
| App Bar (Nav Rail) | `#ECE4DD` | Far-left vertical icon navigation |
| Chat List | `#F6F2EE` | Chat list panel (right of the app bar) |
| Chat Canvas | `#FFFFFF` | Main area where chat messages are displayed |

The title bar, app bar, and chat list form a warm neutral palette that matches current Microsoft Teams. The chat list is the lightest of the three so its surface reads as a container nested inside the chrome.

### Message Bubbles

| Element | Hex | Alignment |
|---------|-----|-----------|
| Other User | `#F5F5F5` | Left-aligned |
| Current User | `#E8EBFA` | Right-aligned |

### Chat List

| Element | Hex | Notes |
|---------|-----|-------|
| Chat item hover | `#ECE4DD` | Matches the title/app bar for visual cohesion — ~4% darker than the `#F6F2EE` panel |
| Chat item selected | `#FFFFFF` | White to stand out from `#F6F2EE` panel |
| Active tab text | `#242424` | Bold, no background fill |
| Inactive tab text | `#616161` | Regular weight, no background fill |

## Typography

Sourced from live Teams (dev-tools inspection).

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui,
             'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Web', sans-serif;
```

Set globally on `body` in `src/index.css`. All components should inherit — avoid overriding `font-family` in component CSS.

### Base Body Text

- **Size:** `14px` (Teams expresses this as `1.4rem` on a `10px` root; we use px directly)
- **Line height:** `1.4286` (unitless, inherited; produces 20px for 14px text)

### Chat List Item Names

- Size: 14px
- Weight: `400` regular, `600` when the chat is bold/unread

### Chat Header Name

- Size: 18px
- Weight: `700`
- Line height: inherits the body `1.4286` (≈25.7px at 18px)

### Chat Header Tabs

- Size: 14px
- Weight: `400` inactive, `600` active
- Color: `#424242` inactive, `#242424` active
- Spacing: `6px` gap between tabs
- Truncation: `max-width: 150px` with `text-overflow: ellipsis` and `white-space: nowrap` — keeps long chat names from breaking the header layout
- Active tab marker: 3px underline in Teams purple (`#6264A7`), `2px` border-radius, spans the tab label width only (not the full button click area — rendered via `::after` on the content box)

## Avatar Sizing

Pass `size` to the common `Avatar` component. Established sizes:

| Surface | Size |
|---|---|
| Chat list item | `20` |
| Title bar (current user) | `28` |
| Chat view header | `28` |
| Message row | `32` |
| Agents rail list + detail header | `24` |

The status dot scales automatically (~28% of avatar size, min 6px) — no need to tune it per surface. Matches real Teams: 20px avatar → 6px dot, 28px → 8px, 32px → 9px, 36px → 10px.

### Avatar Shape

- **People, groups, agents:** circle (`border-radius: 50%`).
- **Channels** (`contact.isChannel`): rounded square. Radius is ~18% of size (min 3px) so it scales with the surface — matches the way Teams visually distinguishes channels from chats in the unified chat list.

## Dividers

Standard divider used throughout the app (chat list header rows, chat view tab bar, section separators):

- **Style:** `1px solid #E8E8E8`
- Use consistently anywhere a subtle horizontal rule is needed between sections.

## Iconography

When you need a new icon, start your search at [fluenticons.co](https://fluenticons.co/) — it's the Fluent UI icon set that matches Teams' visual language.

### App Bar (Nav Rail) Icons

- **Inactive state:** Outlined icons, default icon color (`#616161`)
- **Active state:** Filled icons, purple accent (`#6264A7`)

## Threaded Agent Replies

Agent interactions (e.g. `/Jira` invocations) follow the Teams thread pattern: the user's message is the anchor in the main chat canvas; the agent's replies live in the right rail.

- **Anchor message (private):** the anchor bubble is visible only to the user and the agent, so it carries two visual cues:
  - A lock icon + `Only you can see this conversation` at the top of the bubble (11px `#616161`, no divider below).
  - A thin `1px solid #BDBDBD` border around the whole bubble.
  Background stays the standard mine color (`#E8EBFA`).
- **Reply indicator:** below the anchor bubble, a small clickable pill shows the participants' avatars (18px, overlapping `-6px` with a 1.5px white ring) + `1 reply` / `N replies` in 12px/600 `#6264A7`. Hover fills with `#F0F0F0`. Clicking toggles the right rail open/closed.
- **Thread view:** the existing agent rail. The rail opens immediately when the anchor is sent, shows the anchor at the top, then the agent's typing indicator above the rail's compose, then the reply.

## Demo Hint Arrows

Red pulsing arrows (`#E8173A`) cue the viewer where to click next during the demo. They animate with a ~1.5s opacity + translate nudge pointing *toward* the target:

- Main compose send button (initial `/Jira` draft)
- Main compose (after Jira flow completes, prefilled recap reply)
