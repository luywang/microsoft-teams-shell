import { useState, useEffect, useRef } from 'react'
import { messagesByContact, contacts, currentUser, favorites, projectNorthwind, chatList } from '../data'
import { sessionMessages } from '../data/sessionMessages'
import { promptSuggestions } from '../data/promptSuggestions'
import { copilotLogo } from '../shared/assets'
import { copilotAgent, designerAgent, pollyAgent, breakthuAgent } from '../data/agents'
import { Avatar } from './common'
import MessageRow from './MessageRow'
import SessionsRail from './SessionsRail'
import AgentsRail from './AgentsRail'
import PromptSuggestions from './PromptSuggestions'
import './ChatView.css'

// Flip to true to re-enable the scripted Jira demo flow (draft → private thread → reply → seeded compose).
const JIRA_FLOW_ENABLED = false

const jiraScript = [
  {
    text: 'You have 1 blocker for the April 25 milestone — the PR is in review with all signoffs and CI passing. Want me to merge it?',
    link: {
      source: 'jira',
      title: 'Handle delegation timeout during agent handoff',
      subtitle: 'JIRA-4552 · In review · Due April 22',
      url: '#',
    },
    seed: 'Yes',
  },
  {
    text: 'Merged — here\'s the PR:',
    link: {
      source: 'github',
      title: 'Handle delegation timeout during agent handoff',
      subtitle: 'teams/agent-handoff #4552 · Merged',
      url: '#',
    },
    seed: null,
  },
]

export default function ChatView({ activeChatId, onSelectChat, sessions, addSession, updateSession, updateSessionMessages, dynamicSessionMessages, navIntent, clearNavIntent }) {
  const activeContact = contacts.find(c => c.id === activeChatId)
  const baseMessages = messagesByContact[activeChatId] || []
  const participantCount = activeContact.isGroup
    ? activeContact.memberCount ?? new Set(baseMessages.map(m => m.senderId)).size
    : 2
  const allChats = [...favorites, ...projectNorthwind, ...chatList]
  const chatEntry = allChats.find(c => c.contactId === activeChatId)
  const draft = chatEntry?.draft || ''

  const parseDraft = (d) => {
    const m = d.match(/^\/Jira\b\s*/i)
    return m ? { mention: 'Jira', text: d.slice(m[0].length) } : { mention: null, text: d }
  }
  const parsedDraft = parseDraft(draft)

  const isAgent = activeContact.isAgent && !activeContact.isGroup
  const hasSessions = isAgent && sessions[activeChatId]

  const [extraMessages, setExtraMessages] = useState({})
  const [inputValue, setInputValue] = useState(parsedDraft.text)
  const [composeMention, setComposeMention] = useState(parsedDraft.mention)
  const [showSessions, setShowSessions] = useState(hasSessions)
  const [showAgents, setShowAgents] = useState(false)
  const [selectedRailAgent, setSelectedRailAgent] = useState(null)
  const [agentChatMessages, setAgentChatMessages] = useState({})
  const [railComposeHint, setRailComposeHint] = useState(null)
  const [railTypingAgentId, setRailTypingAgentId] = useState(null)
  const [railJiraStep, setRailJiraStep] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [showMainComposeHint, setShowMainComposeHint] = useState(false)
  const [jiraGroupSessionId, setJiraGroupSessionId] = useState(null)
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [jiraThreadAnchorId, setJiraThreadAnchorId] = useState(null)
  const [mainTypingAgentId, setMainTypingAgentId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const p = parseDraft(draft)
    setInputValue(p.text)
    setComposeMention(p.mention)
    setShowAgents(false)
    setSelectedRailAgent(null)
    setRailJiraStep(0)
    setRailComposeHint(null)
    setRailTypingAgentId(null)
    setShowMainComposeHint(false)
    setJiraThreadAnchorId(null)
    if (navIntent && navIntent.chatId === activeChatId) {
      setShowSessions(true)
      if (navIntent.sessionId) setActiveSessionId(navIntent.sessionId)
      clearNavIntent()
    } else {
      setShowSessions(!!hasSessions)
      const agentSessionList = sessions[activeChatId]
      setActiveSessionId(agentSessionList?.length > 0 ? agentSessionList[0].id : null)
    }
  }, [activeChatId, draft, navIntent, clearNavIntent, hasSessions])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [extraMessages, activeChatId, activeSessionId, mainTypingAgentId])

  useEffect(() => {
    if (!jiraGroupSessionId) return
    const msgs = agentChatMessages[4] || []
    const converted = msgs
      .filter((m) => !String(m.id).startsWith('intro-'))
      .map((m) => ({
        id: m.id,
        senderId: m.from === 'me' ? 'me' : 4,
        text: m.text,
        time: m.time,
        link: m.link,
      }))
    updateSessionMessages(jiraGroupSessionId, converted)
  }, [agentChatMessages, jiraGroupSessionId, updateSessionMessages])

  const sessionMsgs = activeSessionId && (dynamicSessionMessages[activeSessionId] || sessionMessages[activeSessionId])
  const displayBaseMessages = sessionMsgs || baseMessages
  // Per-session bucket for in-canvas messages so switching to a new pending
  // session starts with a blank canvas instead of inheriting the previous
  // session's messages. Non-session chats fall back to the chat id.
  const canvasKey = activeSessionId || activeChatId
  const messages = [...displayBaseMessages, ...(extraMessages[canvasKey] || [])]

  const activeSession = hasSessions && sessions[activeChatId]?.find(s => s.id === activeSessionId)
  const sourceChat = activeSession?.sourceChatId ? contacts.find(c => c.id === activeSession.sourceChatId) : null

  const { agentsInConversation, recommendedAgents } = (() => {
    if (activeChatId === 11) {
      const jira = contacts.find(c => c.id === 4)
      return {
        agentsInConversation: [copilotAgent, jira, designerAgent],
        recommendedAgents: [pollyAgent, breakthuAgent],
      }
    }
    const agentsById = new Map(contacts.filter(c => c.isAgent).map(a => [a.id, a]))
    const agentsByName = new Map(contacts.filter(c => c.isAgent).map(a => [a.name.toLowerCase(), a]))
    const found = new Map()
    if (activeContact.isAgent) found.set(activeContact.id, activeContact)
    for (const m of baseMessages) {
      if (agentsById.has(m.senderId)) found.set(m.senderId, agentsById.get(m.senderId))
      if (Array.isArray(m.text)) {
        for (const part of m.text) {
          if (part && typeof part === 'object' && part.type === 'mention') {
            const agent = agentsByName.get(part.name.toLowerCase())
            if (agent) found.set(agent.id, agent)
          }
        }
      }
    }
    return { agentsInConversation: Array.from(found.values()), recommendedAgents: [] }
  })()

  const handleNewSession = () => {
    // Only one pending "New conversation" per agent — if one already exists,
    // just switch to it instead of creating another. It becomes a real session
    // once the user sends their first message (see finalizePendingSession).
    const existingPending = (sessions[activeChatId] || []).find(s => s.isPending)
    if (existingPending) {
      setActiveSessionId(existingPending.id)
      return
    }
    const now = new Date()
    const sessionId = `s-new-${Date.now()}`
    const newSession = {
      id: sessionId,
      name: 'New conversation',
      time: now.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      preview: '',
      isPending: true,
    }
    addSession(activeChatId, newSession, [])
    setActiveSessionId(sessionId)
  }

  const finalizePendingSession = (firstText, nameHint) => {
    if (!isAgent || !activeSessionId) return
    const current = (sessions[activeChatId] || []).find(s => s.id === activeSessionId)
    if (!current?.isPending) return
    const trimmed = String(firstText || '').trim()
    const name = (nameHint && nameHint.trim()) || trimmed.slice(0, 60) || 'New conversation'
    const preview = trimmed.slice(0, 100)
    const now = new Date()
    updateSession(activeChatId, activeSessionId, {
      name,
      preview,
      time: now.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      isPending: false,
    })
  }

  const nowTimeStr = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  const selectRailAgent = (agent) => {
    setSelectedRailAgent(agent)
    if (agent && !agentChatMessages[agent.id]) {
      const intro = {
        id: `intro-${agent.id}`,
        from: 'agent',
        text: `Hi! I'm ${agent.name}. Ask me anything in the context of ${activeContact.name}.`,
        time: nowTimeStr(),
      }
      setAgentChatMessages((prev) => ({ ...prev, [agent.id]: [intro] }))
    }
  }

  const bumpThreadReply = (anchorId, participantId) => {
    if (!anchorId) return
    setExtraMessages((prev) => {
      const list = prev[activeChatId] || []
      if (!list.some((m) => m.id === anchorId)) return prev
      return {
        ...prev,
        [activeChatId]: list.map((m) => {
          if (m.id !== anchorId) return m
          const existingIds = m.threadReply?.participantIds || []
          const participantIds = existingIds.includes(participantId)
            ? existingIds
            : [...existingIds, participantId]
          return {
            ...m,
            threadReply: {
              participantIds,
              count: (m.threadReply?.count || 0) + 1,
            },
          }
        }),
      }
    })
  }

  const scheduleJiraResponse = (index, anchorIdOverride) => {
    if (index < 0 || index >= jiraScript.length) return
    // Callers that just queued a setJiraThreadAnchorId in the same tick pass
    // the id explicitly; otherwise fall back to the latest committed state.
    const anchorId = anchorIdOverride ?? jiraThreadAnchorId
    setRailTypingAgentId(4)
    setTimeout(() => {
      const step = jiraScript[index]
      const jiraMsg = {
        id: `l2j-${Date.now()}`,
        from: 'agent',
        text: step.text,
        link: step.link,
        time: nowTimeStr(),
      }
      setAgentChatMessages((prev) => ({
        ...prev,
        [4]: [...(prev[4] || []), jiraMsg],
      }))
      setRailTypingAgentId(null)
      setRailComposeHint(step.seed ? { agentId: 4, text: step.seed } : null)
      setRailJiraStep(index + 1)
      bumpThreadReply(anchorId, 4)

      if (index === jiraScript.length - 1) {
        setInputValue('Had 1 blocker, but just merged the fix — all set now!')
        setComposeMention(null)
        setShowMainComposeHint(true)
      }
    }, 3200)
  }

  const sendInRail = (text) => {
    if (!selectedRailAgent) return
    const agentId = selectedRailAgent.id
    setAgentChatMessages((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), { id: `l2-${Date.now()}`, from: 'me', text, time: nowTimeStr() }],
    }))
    setRailComposeHint(null)
    // User replies on the Jira thread count too (and pull the current user's
    // avatar into the reply indicator).
    if (agentId === 4) bumpThreadReply(jiraThreadAnchorId, 'me')
    if (agentId === 4 && railJiraStep > 0 && railJiraStep < jiraScript.length) {
      scheduleJiraResponse(railJiraStep)
    }
  }

  const openJiraThread = () => {
    // The reply indicator acts as a toggle: if the rail is already showing
    // the Jira thread, collapse it; otherwise open it on Jira.
    if (showAgents && selectedRailAgent?.id === 4) {
      setShowAgents(false)
      return
    }
    const jira = contacts.find((c) => c.id === 4)
    if (!jira) return
    setSelectedRailAgent(jira)
    setShowAgents(true)
  }

  const handleSend = () => {
    if (!composeMention && !inputValue.trim()) return

    const sentText = composeMention
      ? `/${composeMention}${inputValue ? ' ' + inputValue.trimStart() : ''}`
      : inputValue
    setInputValue('')
    setComposeMention(null)

    const isJiraInvocation = JIRA_FLOW_ENABLED && activeChatId === 11 && sentText.toLowerCase().includes('jira')

    if (isJiraInvocation) {
      const parts = []
      let remaining = sentText
      const regex = /\/Jira/i
      let match
      while ((match = regex.exec(remaining)) !== null) {
        if (match.index > 0) parts.push(remaining.slice(0, match.index))
        parts.push({ type: 'mention', name: 'Jira' })
        remaining = remaining.slice(match.index + match[0].length)
      }
      if (remaining) parts.push(remaining)
      const messageText = parts.length > 1 || typeof parts[0] !== 'string' ? parts : sentText

      const userTime = nowTimeStr()
      const userMsgId = `thread-u-${Date.now()}`

      // The user's message is the anchor of a new thread in the main canvas.
      // It's flagged private so the bubble shows the "Only you can see this
      // conversation" disclaimer and the subtle gray border — both indicate
      // the thread is visible only to the user and the agent.
      setExtraMessages((prev) => ({
        ...prev,
        [activeChatId]: [
          ...(prev[activeChatId] || []),
          { id: userMsgId, senderId: 'me', text: messageText, time: userTime, isPrivate: true },
        ],
      }))
      setJiraThreadAnchorId(userMsgId)

      // Seed the rail thread so it shows the anchor at the top when it opens.
      setAgentChatMessages((prev) => ({
        ...prev,
        4: [{ id: userMsgId, from: 'me', text: messageText, time: userTime }],
      }))

      // Create the session so the thread is discoverable later from Jira's
      // sessions list.
      const jira = contacts.find((c) => c.id === 4)
      const now = new Date()
      const sessionId = `s4-group-${Date.now()}`
      const previewText = Array.isArray(messageText)
        ? messageText.map((p) => (typeof p === 'string' ? p : `/${p.name}`)).join('')
        : messageText
      const sessionName =
        previewText.replace(/^\/?jira\s*/i, '').trim().slice(0, 60) || 'Blocker discussion'
      addSession(4, {
        id: sessionId,
        name: sessionName,
        time: now.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        preview: previewText,
        sourceChatId: activeChatId,
      })
      setJiraGroupSessionId(sessionId)

      // Open the rail with Jira selected and start the reply (typing indicator
      // lives inside the rail above its compose; scheduleJiraResponse also
      // bumps the anchor's reply count once the reply posts).
      setSelectedRailAgent(jira)
      setShowAgents(true)
      scheduleJiraResponse(0, userMsgId)
      return
    }

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const myMessage = {
      id: `extra-${Date.now()}`,
      senderId: 'me',
      text: sentText,
      time: timeStr,
    }
    setExtraMessages((prev) => ({
      ...prev,
      [canvasKey]: [...(prev[canvasKey] || []), myMessage],
    }))
    finalizePendingSession(sentText)
    setShowMainComposeHint(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const sendPromptSuggestion = (suggestion) => {
    const chatId = activeChatId
    const bucket = canvasKey
    const timeStr = nowTimeStr()
    const myMessage = {
      id: `extra-${Date.now()}`,
      senderId: 'me',
      text: suggestion.text,
      time: timeStr,
    }
    setExtraMessages((prev) => ({
      ...prev,
      [bucket]: [...(prev[bucket] || []), myMessage],
    }))
    finalizePendingSession(suggestion.text, suggestion.title)

    // Typing indicator then the prepared response.
    setMainTypingAgentId(chatId)
    const delay = 2000 + Math.floor(Math.random() * 1000)
    setTimeout(() => {
      setMainTypingAgentId((prev) => (prev === chatId ? null : prev))
      const agentMessage = {
        id: `extra-${Date.now()}-r`,
        senderId: chatId,
        text: suggestion.response,
        time: nowTimeStr(),
      }
      setExtraMessages((prev) => ({
        ...prev,
        [bucket]: [...(prev[bucket] || []), agentMessage],
      }))
    }, delay)
  }

  const agentSuggestions = isAgent ? promptSuggestions[activeChatId] : null
  const showPromptSuggestions = !!agentSuggestions && messages.length === 0 && mainTypingAgentId !== activeChatId

  return (
    <div className="chat-view">
      <div className="chat-view-main">
        {/* Header */}
        <div className="chat-view-header">
          <div className="chat-header-row">
            <Avatar contact={activeContact} size={28} />
            <span className="chat-header-name">{activeContact.name}</span>
            <div className="chat-header-tabs">
              <button className="chat-view-tab active">Chat</button>
              <button className="chat-view-tab">Shared</button>
              <button className="chat-view-tab">Recap</button>
              <button className="chat-view-tab">Storyline</button>
              <button className="chat-view-tab tab-add">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2.5a.5.5 0 0 1 .5.5v4.5H13a.5.5 0 0 1 0 1H8.5V13a.5.5 0 0 1-1 0V8.5H3a.5.5 0 0 1 0-1h4.5V3a.5.5 0 0 1 .5-.5z"/>
                </svg>
              </button>
            </div>
            <div className="chat-header-actions">
              <button className="meet-now-btn" aria-label="Meet now">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="12" height="11" rx="1.5"/>
                  <path d="M14 8.5l4-2.5v8l-4-2.5"/>
                </svg>
                <span>Meet now</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className="meet-chevron">
                  <path d="M2.15 4.15a.5.5 0 0 1 .7 0L6 7.29l3.15-3.14a.5.5 0 0 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7z"/>
                </svg>
              </button>
              <button className="header-action-btn participants-btn" aria-label="Participants">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7.5" cy="6" r="2.5"/>
                  <path d="M2 15c0-2.5 2-4.5 5.5-4.5S13 12.5 13 15"/>
                  <circle cx="14" cy="7" r="2"/>
                  <path d="M14 11.5c2.5 0 4 1.5 4 3.5"/>
                </svg>
                <span className="participants-count">{participantCount}</span>
              </button>
              <div className="header-divider" />
              <button className="header-action-btn" aria-label="Notes">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 3h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4V3z"/>
                  <path d="M7 7h4M7 10h4M7 13h2"/>
                  <path d="M15 11l2-2v7a1 1 0 0 1-1 1h-1"/>
                </svg>
              </button>
              {hasSessions && (
                <button
                  className={`header-action-btn ${showSessions ? 'header-action-btn-active' : ''}`}
                  aria-label="Sessions"
                  onClick={() => setShowSessions(prev => !prev)}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="10" r="8"/>
                    <path d="M10 5.5V10l3 2"/>
                  </svg>
                </button>
              )}
              <button className="header-action-btn" aria-label="Apps">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="6" height="6" rx="1"/>
                  <rect x="11" y="3" width="6" height="6" rx="1"/>
                  <rect x="3" y="11" width="6" height="6" rx="1"/>
                  <rect x="11" y="11" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button className="header-action-btn" aria-label="More options">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {showPromptSuggestions ? (
            <PromptSuggestions
              agent={activeContact}
              suggestions={agentSuggestions}
              onSelectPrompt={sendPromptSuggestion}
            />
          ) : (
            <div className="messages-container">
              {sourceChat && (
                <div className="session-source-banner">
                  Started conversation from{' '}
                  <a
                    className="session-source-banner-link"
                    href="#"
                    onClick={(e) => { e.preventDefault(); onSelectChat(sourceChat.id) }}
                  >{sourceChat.name}</a>
                  <br />
                  Recent context from the conversation has been shared with this session.
                </div>
              )}
              {messages.map((msg) => (
                <MessageRow
                  key={msg.id}
                  message={msg}
                  activeContact={activeContact}
                  onOpenThread={openJiraThread}
                />
              ))}
              {mainTypingAgentId === activeChatId && (
                <div className="message-row message-typing-row">
                  <div className="message-avatar-col">
                    <Avatar contact={activeContact} size={32} />
                  </div>
                  <div className="message-typing-bubble" aria-label={`${activeContact.name} is typing`}>
                    <span className="message-typing-dots">
                      <span /><span /><span />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Compose */}
        <div className="chat-compose">
          <div className="compose-box-wrap">
          <div className="compose-box">
            {composeMention && (
              <span className="mention compose-mention">/{composeMention}</span>
            )}
            <input
              type="text"
              className="compose-input"
              placeholder={composeMention ? '' : 'Type a message'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && inputValue === '' && composeMention) {
                  e.preventDefault()
                  setComposeMention(null)
                  return
                }
                handleKeyDown(e)
              }}
            />
            <div className="compose-actions">
              <button className="compose-btn" aria-label="Format">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 15l3-10 3 10M8 12h4"/>
                  <path d="M15 5l2 2"/>
                </svg>
              </button>
              <button className="compose-btn" aria-label="Emoji">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="10" r="8"/>
                  <path d="M6.5 11.5s1.5 2 3.5 2 3.5-2 3.5-2"/>
                  <circle cx="7.5" cy="7.5" r=".75" fill="currentColor" stroke="none"/>
                  <circle cx="12.5" cy="7.5" r=".75" fill="currentColor" stroke="none"/>
                </svg>
              </button>
              <button className="compose-btn" aria-label="Attach">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 10.5l-5 5a3.54 3.54 0 0 1-5-5l7-7a2.36 2.36 0 0 1 3.33 3.33l-7 7a1.18 1.18 0 0 1-1.67-1.67l5-5"/>
                </svg>
              </button>
              <button className="compose-btn" aria-label="Copilot">
                <img src={copilotLogo} alt="Copilot" className="copilot-logo-img-sm" />
              </button>
              <button className="compose-btn" aria-label="More apps">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 10 3z"/>
                </svg>
              </button>
              <div className="compose-divider" />
              <button className="send-btn" aria-label="Send" onClick={handleSend}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.18412 2.11244C2.33657 1.98818 2.54771 1.96483 2.72363 2.05279L17.7236 9.55279C17.893 9.63749 18 9.81062 18 10C18 10.1894 17.893 10.3625 17.7236 10.4472L2.72363 17.9472C2.54771 18.0352 2.33657 18.0118 2.18412 17.8876C2.03167 17.7633 1.96623 17.5612 2.0169 17.3712L3.98255 10L2.0169 2.62884C1.96623 2.4388 2.03167 2.2367 2.18412 2.11244ZM4.88416 10.5L3.26911 16.5564L16.382 10L3.26911 3.44357L4.88416 9.5H11.5C11.7762 9.5 12 9.72386 12 10C12 10.2761 11.7762 10.5 11.5 10.5H4.88416Z"/>
                </svg>
              </button>
            </div>
            {/* Jira demo hint arrows removed — `.main-compose-hint-arrow` and `.demo-hint-arrow-send` remain in CSS if needed. */}
          </div>
          </div>
        </div>
      </div>
      {showSessions && (
        <SessionsRail
          sessions={sessions[activeChatId] || []}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onClose={() => setShowSessions(false)}
          onNewSession={handleNewSession}
        />
      )}
      {showAgents && (
        <AgentsRail
          agents={agentsInConversation}
          recommended={recommendedAgents}
          chatName={activeContact.name}
          selectedAgent={selectedRailAgent}
          onSelectAgent={selectRailAgent}
          messages={selectedRailAgent ? agentChatMessages[selectedRailAgent.id] || [] : []}
          onSendMessage={sendInRail}
          composeHint={railComposeHint}
          typingAgentId={railTypingAgentId}
          onClose={() => setShowAgents(false)}
        />
      )}
    </div>
  )
}
