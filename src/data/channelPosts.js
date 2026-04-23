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

  // Agents Platform • Launch readiness
  27: [
    {
      id: 'p27-1',
      senderId: 12,
      time: 'Today 8:50 AM',
      subject: 'Readiness checklist — 3 days out',
      text:
        "Walking the launch readiness checklist this morning. Current state:\n\n" +
        "• PM — green. PRD final, partner FAQ drafted.\n" +
        "• Eng — yellow. Auth PR outstanding, should merge tomorrow.\n" +
        "• Docs — yellow. Blocked on the auth PR so David can finalize the migration note.\n" +
        "• Design — green.\n" +
        "• QA — green. Staging smoke tests passing for 48 hours.\n\n" +
        "Flagging the auth PR as the single critical path. If it slips past Wednesday we should talk.",
      reactions: [{ emoji: '👍', count: 5 }],
      replies: [
        {
          id: 'p27-1-r1',
          senderId: 15,
          text: "Auth PR is in final review — one comment from James on the token-refresh path. Expecting merge tomorrow morning.",
          time: 'Today 9:02 AM',
        },
        {
          id: 'p27-1-r2',
          senderId: 10,
          text: 'Migration guide draft is ready to pair against the PR as soon as it lands. 30 min turnaround on my side.',
          time: 'Today 9:10 AM',
        },
      ],
    },
    {
      id: 'p27-2',
      senderId: 'me',
      time: 'Yesterday 5:15 PM',
      subject: 'Draft launch blog — feedback welcome',
      text:
        "First pass at the launch blog is in the shared folder (Agent Platform / Launch / blog-draft.md). Length is about right but the middle section on handoffs runs long — happy to cut if it reads dense.\n\n" +
        "Looking for:\n" +
        "• Technical accuracy on the handoff section (James / Kevin)\n" +
        "• Partner-facing tone check (Rachel)\n" +
        "• Anything that should be in the FAQ instead",
      replies: [
        {
          id: 'p27-2-r1',
          senderId: 12,
          text: 'Skimmed — tone is good. Will do a real pass tonight and drop inline comments.',
          time: 'Yesterday 5:40 PM',
          reactions: [{ emoji: '🙏', count: 1 }],
        },
      ],
    },
  ],

  // Morgan Collective • General
  28: [
    {
      id: 'p28-1',
      senderId: 30,
      time: 'Today 9:40 AM',
      subject: 'Q2 capacity snapshot — who\'s booked, who\'s open',
      text:
        "Rolling into Q2 with two active engagements and a few pipeline conversations. Posting the snapshot so we can flag conflicts before May inbound picks up:\n\n" +
        "• Alex — Northwind Traders (lead, multi-quarter). Shipping April 25. ~30% opens in mid-May.\n" +
        "• Me — Contoso strategy review wrapping 5/16. Open for new work week of 5/19.\n" +
        "• Pipeline: seed-stage AI startup (inbound), referral from a former Contoso contact. Scoping calls next week.\n\n" +
        "Flag anything I missed in the capacity doc before Friday.",
      reactions: [{ emoji: '👍', count: 3 }],
      replies: [
        {
          id: 'p28-1-r1',
          senderId: 'me',
          text: "Looks right. One nuance — Northwind is asking about a post-launch scope extension (cross-tenant handoff work). Tracking in #client-engagements, but it would pull my May-open slot if we say yes.",
          time: 'Today 10:08 AM',
        },
        {
          id: 'p28-1-r2',
          senderId: 30,
          text: 'Good flag. Let\'s align on scoping before you send the proposal. 20 min Thursday?',
          time: 'Today 10:14 AM',
        },
        {
          id: 'p28-1-r3',
          senderId: 'me',
          text: 'Works. Putting 3pm on the calendar.',
          time: 'Today 10:15 AM',
          reactions: [{ emoji: '👍', count: 1 }],
        },
        {
          id: 'p28-1-r4',
          senderId: 30,
          text: 'Calendar invite sent. Jotting the Northwind scope extension on the agenda so we can time-box it.',
          time: 'Today 10:22 AM',
        },
      ],
    },
    {
      id: 'p28-2',
      senderId: 'me',
      time: 'Yesterday 4:12 PM',
      subject: 'Dogfooding the Northwind agent (internally)',
      text:
        "Spent an hour running our own client-intake notes through Northwind's agent platform this week to sanity-check the partner story. Two takeaways for us:\n\n" +
        "1. The handoff UX is genuinely good — I delegated a spec draft to the \"research\" agent and the pickup was seamless.\n" +
        "2. Onboarding is still 15+ clicks before you can do anything useful. We'll want to flag that in the partner readout.\n\n" +
        "If anyone wants to try it, ping me for a guest account.",
      replies: [
        {
          id: 'p28-2-r1',
          senderId: 30,
          text: 'Would love to try — send the guest invite. Useful to have firsthand POV before the May client-review deck.',
          time: 'Yesterday 4:45 PM',
        },
      ],
    },
    {
      id: 'p28-3',
      senderId: 30,
      time: '4/18 11:00 AM',
      subject: 'Conference — AI Product Summit, June 10–12',
      text:
        "AI Product Summit opened CFP yesterday. Two slots we could credibly submit for:\n\n" +
        "• Case study — \"Shipping an internal agent platform\" (Alex's Northwind engagement, sanitized)\n" +
        "• Panel — handoff patterns across agent platforms\n\n" +
        "Registration alone is worth it for pipeline. Flagging so we can decide this week if we want to put in a talk.",
      replies: [
        {
          id: 'p28-3-r1',
          senderId: 'me',
          text: "Case study only if Rachel's OK sanitizing. Handoff panel is an easy yes — I can pull material from the CA working group.",
          time: '4/18 11:22 AM',
          reactions: [{ emoji: '🎤', count: 2 }],
        },
      ],
    },
  ],

  // Morgan Collective • Client engagements
  29: [
    {
      id: 'p29-1',
      senderId: 'me',
      time: 'Today 12:05 PM',
      subject: 'Northwind — post-launch scope extension ask',
      text:
        "Rachel floated extending our Northwind engagement to cover cross-tenant handoff work post-launch. Quick assessment so we can decide together:\n\n" +
        "• Fits squarely in the engagement focus (AI / agent platform strategy).\n" +
        "• Would pull ~15–20 hrs/week through June.\n" +
        "• Overlaps with Taylor's May-open slot — may need to defer the Contoso referral by 2 weeks.\n\n" +
        "My read: lean yes, contingent on pipeline timing. Planning to send a proposal Thursday unless anyone pushes back.",
      reactions: [{ emoji: '💰', count: 2 }],
      replies: [
        {
          id: 'p29-1-r1',
          senderId: 30,
          text: "Yes from me. The Contoso referral can wait two weeks — I'll send them a heads-up. One ask: get Rachel to scope the SOW in 4-week increments so we have clean exit points if priorities shift.",
          time: 'Today 12:30 PM',
        },
        {
          id: 'p29-1-r2',
          senderId: 'me',
          text: 'Agree on the 4-week increments. Drafting now. Will circulate before I send.',
          time: 'Today 12:34 PM',
        },
      ],
    },
    {
      id: 'p29-2',
      senderId: 30,
      time: 'Yesterday 3:20 PM',
      subject: 'Contoso — final review deck, wrapping 5/16',
      text:
        "Contoso strategy review is in its final two weeks. Shipping the deck by next Friday, exec readout 5/9, written recommendations by 5/16.\n\n" +
        "Flagging one item: they asked if we have a follow-on partner for \"agent-readiness audits\" (their phrase). That's arguably the Handoff UX working-group pattern — could be a natural referral to the CA client Alex is advising. Worth a quick chat.",
      replies: [
        {
          id: 'p29-2-r1',
          senderId: 'me',
          text: "Happy to intro. The CA client has capacity and the fit is strong on paper. Let's sync Thursday — I want to check with them before we tee it up.",
          time: 'Yesterday 3:55 PM',
        },
      ],
    },
    {
      id: 'p29-3',
      senderId: 'me',
      time: '4/18 5:30 PM',
      subject: 'CA working group — prep for the 4/24 session',
      text:
        "Heads-up on what I'm bringing to next week's Conversational AI working group session (our smaller advisory client):\n\n" +
        "• Two real handoff traces from Northwind (anonymized) — to test the context-packet shape we aligned on last time.\n" +
        "• A strawman for measuring \"did the user notice the handoff\" — instrumentation spec + a 4-question survey.\n\n" +
        "Not asking for review, just visibility. Posting the materials here Wednesday EOD.",
      replies: [
        {
          id: 'p29-3-r1',
          senderId: 30,
          text: 'Appreciate the visibility. Let me know if you want me to skim the survey — I ran something similar for the Contoso engagement.',
          time: '4/18 6:02 PM',
          reactions: [{ emoji: '🙏', count: 1 }],
        },
      ],
    },
  ],
}
