// Channel "posts" — Threads layout. Each post is a top-level message with
// an optional subject and an inline reply thread. Keyed by channel contact id.
//
// Shape:
//   { id, senderId, time, subject?, text, reactions?, replies: [ {id, senderId, text, time, reactions?} ] }
//
// Replies mirror MessageRow's shape (senderId of 'me' = current user).

export const channelPostsByContact = {
  // Agents Platform • General
  25: [
    {
      id: 'p25-1',
      senderId: 12,
      time: 'Yesterday 3:02 PM',
      subject: 'API review Thursday — agenda + pre-reads',
      text:
        "Landing the agenda for Thursday's API review. Please skim the pre-reads and drop comments inline before the meeting — we only have 45 minutes and I'd rather resolve the easy ones async.\n\n" +
        "Topics:\n" +
        "• Manifest schema v2 — parameter validation, required vs optional semantics\n" +
        "• Plugin lifecycle hooks — onActivate / onDeactivate / onConfigChange\n" +
        "• Deprecation policy for v1 endpoints — 9-month vs 12-month sunset\n\n" +
        "Pre-reads are in the shared PM folder under Agent Platform / API Review / April 24.",
      reactions: [{ emoji: '👍', count: 5 }, { emoji: '👀', count: 2 }],
      replies: [
        {
          id: 'p25-1-r1',
          senderId: 'me',
          text:
            "I'll bring the strawman for the manifest schema. Want ~15 min on the required/optional semantics — there's one nested-param edge case we haven't nailed down.",
          time: 'Yesterday 3:22 PM',
        },
        {
          id: 'p25-1-r2',
          senderId: 10,
          text:
            'Happy to walk through the sunset rubric we landed on in the data-warehouse thread — same pattern should work for v1 endpoints. 9 months default, 12 only when a major partner flags migration risk.',
          time: 'Yesterday 3:30 PM',
        },
        {
          id: 'p25-1-r3',
          senderId: 15,
          text: "+1 on 9 months. If we need longer we can always extend; shortening is what gets ugly.",
          time: 'Yesterday 3:41 PM',
          reactions: [{ emoji: '💯', count: 2 }],
        },
      ],
    },
    {
      id: 'p25-2',
      senderId: 7,
      time: 'Today 9:12 AM',
      subject: 'Handoff analytics — `reason` enum now live in staging',
      text:
        "Quick FYI for anyone wiring telemetry: `HandoffInitiated` and `HandoffCompleted` now carry a `reason` enum — `explicit`, `timeout`, `fallback`. Live in staging as of this morning.\n\n" +
        "Most debugging I've done this week would have been 10 minutes faster with this. If you have a dashboard filter by outcome, add `reason` as a secondary facet — the timeout vs fallback split is where the interesting failure modes show up.",
      reactions: [{ emoji: '🎉', count: 6 }, { emoji: '🙌', count: 3 }],
      replies: [
        {
          id: 'p25-2-r1',
          senderId: 'me',
          text:
            'Nice. Can we also capture `contextSizeBytes` on the completed event? Will be useful once plugin sandboxing lands and we start seeing truncation.',
          time: 'Today 9:20 AM',
        },
        {
          id: 'p25-2-r2',
          senderId: 7,
          text: "Yep, already drafted — pushing today. Will be nullable on the v1 event path so existing consumers don't break.",
          time: 'Today 9:24 AM',
        },
      ],
    },
    {
      id: 'p25-3',
      senderId: 1,
      time: 'Today 10:48 AM',
      subject: 'Empty-state mocks for partner onboarding — feedback by Thursday',
      text:
        "Three variants for the partner onboarding empty state are in Figma (link in the thread). Looking for reactions before Thursday's crit — specifically:\n\n" +
        "1. Does variant C's copy feel too marketing-y now that it's been tightened?\n" +
        "2. The illustration in A is heavier than what we usually do — intentional, but happy to swap if it reads wrong in context.\n\n" +
        "Going with the 8px corner radius from the design-guide update across all three.",
      replies: [
        {
          id: 'p25-3-r1',
          senderId: 'me',
          text: 'C reads cleanest to me. Copy is good now — one nit: "instantly" in the subhead is doing a lot of work. Maybe just drop it?',
          time: 'Today 11:02 AM',
        },
        {
          id: 'p25-3-r2',
          senderId: 3,
          text: 'Agree on C. Illustration in A is lovely but feels like a hero, not an empty state.',
          time: 'Today 11:15 AM',
          reactions: [{ emoji: '👍', count: 2 }],
        },
      ],
    },
  ],

  // Agents Platform • Announcements
  26: [
    {
      id: 'p26-1',
      senderId: 12,
      time: 'Today 8:30 AM',
      subject: 'Agents Platform v2 launch — April 25 is a go',
      text:
        "Confirming we're shipping v2 on April 25. Readiness check this morning was green across PM, eng, design, docs. Thanks to everyone for grinding through the last two weeks.\n\n" +
        "What this means for the team:\n" +
        "• Thursday 10am — final go/no-go\n" +
        "• Friday EOD — code freeze, release branch cut\n" +
        "• Monday 9am PT — staged rollout to 10% of tenants\n" +
        "• Full rollout targeted Tuesday EOD if no P1s\n\n" +
        "Launch blog and partner FAQ will circulate Friday. Huge thanks to Kevin, James, Olivia, Sarah, David, and Emma for the sprint.",
      reactions: [{ emoji: '🎉', count: 14 }, { emoji: '🚀', count: 9 }, { emoji: '❤️', count: 4 }],
      replies: [
        {
          id: 'p26-1-r1',
          senderId: 'me',
          text: 'Proud of this team. The last-mile polish on the handoff UX really shows.',
          time: 'Today 8:38 AM',
          reactions: [{ emoji: '❤️', count: 3 }],
        },
        {
          id: 'p26-1-r2',
          senderId: 10,
          text: 'Migration guide lands tomorrow alongside the auth PR merge. Will drop a link here once it does.',
          time: 'Today 8:44 AM',
        },
      ],
    },
    {
      id: 'p26-2',
      senderId: 10,
      time: '4/18 4:20 PM',
      subject: 'SDK v2 preview — docs site + two worked examples',
      text:
        "The Agent Extensibility SDK v2 preview is live for partners. What's in:\n\n" +
        "• Getting-started guide (15 min end-to-end)\n" +
        "• Full reference for the plugin lifecycle hooks\n" +
        "• Two worked examples — a slash-command plugin (~120 lines) and a message-action plugin (~180 lines)\n\n" +
        "Feedback goes in the dogfood channel. We kept the slash-command sample under 150 lines on purpose — the v1 version was 400 and nobody finished it.",
      reactions: [{ emoji: '🔥', count: 7 }, { emoji: '👏', count: 4 }],
      replies: [
        {
          id: 'p26-2-r1',
          senderId: 17,
          text: 'Ran through the slash-command sample this morning. 12 minutes from clone to working plugin. Huge improvement.',
          time: '4/18 5:02 PM',
          reactions: [{ emoji: '🎉', count: 2 }],
        },
      ],
    },
  ],
}
