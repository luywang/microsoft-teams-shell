# Design Guide

## Color Palette

### Layout Surfaces

| Element | Hex | Usage |
|---------|-----|-------|
| Title Bar | `#EBEBEB` | Top header bar containing search and navigation |
| App Bar (Nav Rail) | `#EBEBEB` | Far-left vertical icon navigation |
| Chat List | `#F5F5F5` | Chat list panel (right of the app bar) |
| Chat Canvas | `#FFFFFF` | Main area where chat messages are displayed |

### Message Bubbles

| Element | Hex | Alignment |
|---------|-----|-----------|
| Other User | `#F5F5F5` | Left-aligned |
| Current User (Gino Buzzelli) | `#E8EBFA` | Right-aligned |

### Chat List

| Element | Hex | Notes |
|---------|-----|-------|
| Chat item hover | `#EBEBEB` | Slightly darker than panel background |
| Chat item selected | `#FFFFFF` | White to stand out from `#F5F5F5` panel |
| Active tab text | `#242424` | Bold, no background fill |
| Inactive tab text | `#616161` | Regular weight, no background fill |

## Dividers

Standard divider used throughout the app (chat list header rows, chat view tab bar, section separators):

- **Style:** `1px solid #E8E8E8`
- Use consistently anywhere a subtle horizontal rule is needed between sections.

## Iconography

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
