# Design Guide

## Color Palette

### Layout Surfaces

| Element | Hex | Usage |
|---------|-----|-------|
| Title Bar | `#ECE4DD` | Top header bar containing search and navigation |
| App Bar (Nav Rail) | `#ECE4DD` | Far-left vertical icon navigation |
| Chat List | `#F6F2EE` | Chat list panel (right of the app bar) |
| Chat Canvas | `#FFFFFF` | Main area where chat messages are displayed |
| Agents Rail | `#FAFAFA` | Right-side rail for per-conversation agents |
| Channel Thread Rail | `#FFFFFF` | Right-side rail for a channel post's replies |

The title bar, app bar, and chat list form a warm neutral palette that matches current Microsoft Teams. The chat list is the lightest of the three so its surface reads as a container nested inside the chrome.

### Message Bubbles

| Element | Hex | Alignment |
|---------|-----|-----------|
| Other User | `#F5F5F5` | Left-aligned |
| Current User | `#E8EBFA` | Right-aligned |

### Chat List

| Element | Hex | Notes |
|---------|-----|-------|
| Chat item hover + selected | `#FCFBFA` | Same fill for both states — a chat doesn't get a separate "selected" treatment. Subtle off-white above the `#F6F2EE` panel. |
| Active tab text | `#242424` | Bold, no background fill |
| Inactive tab text | `#616161` | Regular weight, no background fill |

**Shape:** hover/selected fills render as a rounded rectangle with side insets (`margin: 0 8px`, `border-radius: 4px`, content `padding` reduced by the same amount) — the highlight does **not** stretch full-width of the panel. Applies uniformly to chat items, pinned items (Copilot / Quick views), team rows, and channel rows.

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
| Prompt-suggestions empty state | `72` |

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

Before adding an icon inline, check `src/components/common/Icon.jsx` — the shared library already covers common cases (`Close`, `Plus`, `ChevronDown`, `ChevronLeft`, `Send`, `Clock`, `Search`, `Dots`, `EmojiAdd`, `Edit`, `Lock`). Add new reusable icons there rather than inlining SVG in feature components.

### App Bar (Nav Rail) Icons

- **Inactive state:** Outlined icons, default icon color (`#616161`)
- **Active state:** Filled icons, purple accent (`#6264A7`)

## Message Patterns

### Reactions

Reaction pills render under the bubble (left-aligned for others' messages, right-aligned for mine). Pills are oval (`border-radius: 12px`, `height: 24px`), white background with a `1px solid #E0E0E0` border. A reaction the current user has added flips the border to Teams purple (`#6264A7`) so "mine" vs "theirs" is visually clear.

- **Hover toolbar** (`MessageActions`) appears above the bubble on hover: four quick-reaction emojis (`👍 ❤️ 😂 😮`), a full emoji-picker trigger, a divider, then `Edit` and `More options`. Quick reactions toggle the current-user flag on that emoji when clicked.

### Thread reply indicator

Under a bubble that has replies (channel posts with `replies`, private agent threads with a `threadReply` badge), a small pill shows:
- Up to 3 participant avatars (18px, overlapping `-6px` with a 1.5px white ring)
- `1 reply` / `N replies` label in 12px/600 Teams purple (`#6264A7`)
- Hover fills with `#F0F0F0`

Click behavior depends on surface:
- **Channel post:** opens `ChannelThreadRail` with root + replies + compose
- **Private agent thread (Jira demo flow):** toggles the `AgentsRail` open/closed on the agent who owns the thread

### Private (only-you) bubble

Used for the anchor message of an agent thread that's visible only to the user and the agent:
- A `PrivateDisclaimer` strip at the top: lock icon + `Only you can see this conversation` in 11px `#616161`
- A thin `1px solid #BDBDBD` border around the whole bubble
- Background stays the standard mine color (`#E8EBFA`)

### Channel posts

Channel chats render a "Threads" layout. Each post has a `subject` (15px/600) rendered inside the bubble above the body. Posts live in `src/data/channelPosts.js` keyed by channel contact id. Replies are shown in `ChannelThreadRail`, not in the main canvas — the main canvas only shows the root posts.

Channel post bubbles get a slightly wider max-width (`80%` vs the default `65%`) because they tend to be announcement-style and run longer.

### Prompt suggestions

New-session empty state for an agent chat: centered 72px avatar + agent name + short description + a 2×3 grid of suggestion cards. Defined in `src/data/promptSuggestions.js` keyed by agent contact id; each card has a `title`, `description`, the `text` to send, and a canned `response`.

## Adaptive Cards

**Agents send rich, interactive content via the [Adaptive Cards framework](https://adaptivecards.microsoft.com/)** — the format the Teams team recommends for agent-authored content. When the user asks you to have an agent send content (status summaries, ticket details, action prompts, etc.), reach for an adaptive card rather than freeform text when the content is structured.

In the prototype's message model, adaptive cards attach to a message via `message.cards` — an array of card objects. The minimal shape rendered today:

```js
{
  accentColor: '#CA5010',            // left border color
  title: 'Keep users logged in when switching between agents',
  facts: [
    { label: 'Status', value: 'In Progress' },
    { label: 'Priority', value: 'High' },
    { label: 'Due', value: 'April 22' },
  ],
  actions: ['View in Jira'],         // rendered as inline link-style buttons
}
```

Real Adaptive Cards support richer elements (images, input fields, action sets, containers). Extend the renderer in `MessageRow.jsx` and the CSS in `ChatView.css` (`.adaptive-card` and `.card-*`) as the prototype needs them — match the [official Adaptive Cards samples](https://adaptivecards.microsoft.com/) for visual fidelity.

## Teams and channels

Channels appear in the chat list grouped under their parent team:
- Teams are defined in `contacts.js` via the `teams` export (id, name, initials, color, `channels: [{ id, bold? }]`).
- Team icons use the rounded-square treatment (same as channel avatars), indent-aligned with their channel rows.
- Clicking a channel selects it; channel chats use the "Conversation" / "Shared" tabs (vs "Chat" / "Shared" / "Recap" / "Storyline" for regular chats).

## Demo Hint Arrows

Red pulsing arrows (`#E8173A`) cue the viewer where to click next during the demo. They animate with a ~1.5s opacity + translate nudge pointing *toward* the target:

- Main compose send button (initial `/Jira` draft)
- Main compose (after Jira flow completes, prefilled recap reply)

These are gated by `JIRA_FLOW_ENABLED` in `ChatView.jsx` — the CSS is retained so re-enabling the flow doesn't require restoring styles.
