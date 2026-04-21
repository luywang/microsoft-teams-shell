import { useState, useRef, useEffect } from 'react'
import Avatar from './Avatar'
import LinkCard from './LinkCard'
import './AgentsRail.css'

function AgentItem({ agent, onClick }) {
  return (
    <div
      className={`agent-item ${onClick ? 'agent-item-clickable' : ''}`}
      onClick={onClick}
    >
      <Avatar contact={agent} size={32} />
      <div className="agent-item-text">
        <div className="agent-item-name">{agent.name}</div>
        {agent.description && (
          <div className="agent-item-description">{agent.description}</div>
        )}
      </div>
    </div>
  )
}

function renderText(text) {
  if (Array.isArray(text)) {
    return text.map((part, i) =>
      typeof part === 'string'
        ? part
        : <span key={i} className="mention">{part.name}</span>
    )
  }
  return text
}

function AgentChat({ agent, messages, onSendMessage, composeHint, isTyping }) {
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (composeHint && composeHint.agentId === agent.id) {
      setInput(composeHint.text)
    }
  }, [composeHint, agent.id])

  const send = () => {
    const text = input.trim()
    if (!text) return
    onSendMessage(text)
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  }

  // Jira demo hint-arrow condition — kept for reference.
  // const showHintArrow =
  //   composeHint && composeHint.agentId === agent.id && input.trim().length > 0

  return (
    <div className="agent-chat">
      <div className="agent-chat-context">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="#616161">
          <path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4zm1 0h6V5a3 3 0 1 0-6 0v2z"/>
        </svg>
        <span>Only you can see this conversation</span>
      </div>
      <div className="agent-chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`agent-chat-row ${m.from === 'me' ? 'agent-chat-row-mine' : ''}`}
          >
            <div className="agent-chat-meta">
              <span className="agent-chat-sender-name">{m.from === 'me' ? 'You' : agent.name}</span>
              {m.time && <span className="agent-chat-timestamp">{m.time}</span>}
            </div>
            <div className="agent-chat-bubble">
              {renderText(m.text)}
              {m.link && <LinkCard link={m.link} />}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {isTyping && (
        <div className="agent-chat-typing">
          <div className="agent-chat-typing-avatar-wrap">
            <Avatar contact={agent} size={24} />
          </div>
          <span className="agent-chat-typing-dots">
            <span /><span /><span />
          </span>
        </div>
      )}
      <div className="agent-chat-compose">
        {/* Jira demo hint arrow removed — `.agent-chat-hint-arrow` remains in CSS if needed. */}
        <div className="agent-chat-compose-box">
          <input
            type="text"
            className="agent-chat-input"
            placeholder={`Message ${agent.name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="agent-chat-send" aria-label="Send" onClick={send}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.18412 2.11244C2.33657 1.98818 2.54771 1.96483 2.72363 2.05279L17.7236 9.55279C17.893 9.63749 18 9.81062 18 10C18 10.1894 17.893 10.3625 17.7236 10.4472L2.72363 17.9472C2.54771 18.0352 2.33657 18.0118 2.18412 17.8876C2.03167 17.7633 1.96623 17.5612 2.0169 17.3712L3.98255 10L2.0169 2.62884C1.96623 2.4388 2.03167 2.2367 2.18412 2.11244ZM4.88416 10.5L3.26911 16.5564L16.382 10L3.26911 3.44357L4.88416 9.5H11.5C11.7762 9.5 12 9.72386 12 10C12 10.2761 11.7762 10.5 11.5 10.5H4.88416Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function AgentDetailView({ agent, messages, onSendMessage, composeHint, isTyping, onBack, onClose }) {
  const sessions = [
    { id: 'current', name: 'Current conversation', time: 'Just now' },
    { id: 'blockers', name: 'Blockers recap', time: 'Yesterday' },
    { id: 'sprint', name: 'Sprint planning', time: 'April 10' },
  ]
  const [activeSessionId, setActiveSessionId] = useState('current')
  const [showSessionMenu, setShowSessionMenu] = useState(false)
  const sessionsWrapRef = useRef(null)

  useEffect(() => {
    if (!showSessionMenu) return
    const onDown = (e) => {
      if (sessionsWrapRef.current && !sessionsWrapRef.current.contains(e.target)) {
        setShowSessionMenu(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [showSessionMenu])

  return (
    <div className="agents-rail">
      <div className="agents-rail-header">
        <div className="agents-rail-header-left">
          <button
            className="agents-rail-icon-btn"
            aria-label="Back"
            onClick={onBack}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.35 2.65a.5.5 0 0 1 0 .7L5.71 8l4.64 4.65a.5.5 0 0 1-.7.7l-5-5a.5.5 0 0 1 0-.7l5-5a.5.5 0 0 1 .7 0z"/>
            </svg>
          </button>
          <Avatar contact={agent} size={24} />
          <span className="agents-rail-title">{agent.name}</span>
        </div>
        <div className="agents-rail-header-actions">
          <div className="agents-rail-sessions-wrap" ref={sessionsWrapRef}>
            <button
              className={`agents-rail-icon-btn ${showSessionMenu ? 'agents-rail-icon-btn-active' : ''}`}
              aria-label="Sessions"
              onClick={() => setShowSessionMenu((v) => !v)}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="8"/>
                <path d="M10 5.5V10l3 2"/>
              </svg>
            </button>
            {showSessionMenu && (
              <div className="agents-rail-session-menu">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    className={`agents-rail-session-item ${s.id === activeSessionId ? 'agents-rail-session-item-active' : ''}`}
                    onClick={() => {
                      setActiveSessionId(s.id)
                      setShowSessionMenu(false)
                    }}
                  >
                    <div className="agents-rail-session-name">{s.name}</div>
                    <div className="agents-rail-session-time">{s.time}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="agents-rail-icon-btn" aria-label="Close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.15 3.15a.5.5 0 0 1 .7 0L8 7.29l4.15-4.14a.5.5 0 0 1 .7.7L8.71 8l4.14 4.15a.5.5 0 0 1-.7.7L8 8.71l-4.15 4.14a.5.5 0 0 1-.7-.7L7.29 8 3.15 3.85a.5.5 0 0 1 0-.7z"/>
            </svg>
          </button>
        </div>
      </div>
      <AgentChat
        agent={agent}
        messages={messages}
        onSendMessage={onSendMessage}
        composeHint={composeHint}
        isTyping={isTyping}
      />
    </div>
  )
}

export default function AgentsRail({
  agents,
  recommended = [],
  chatName,
  selectedAgent,
  onSelectAgent,
  messages = [],
  onSendMessage,
  composeHint,
  typingAgentId,
  onClose,
}) {
  const hasAgents = agents.length > 0
  const hasRecommended = recommended.length > 0

  if (selectedAgent) {
    return (
      <AgentDetailView
        agent={selectedAgent}
        messages={messages}
        onSendMessage={onSendMessage}
        composeHint={composeHint}
        isTyping={typingAgentId === selectedAgent.id}
        onBack={() => onSelectAgent(null)}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="agents-rail">
      <div className="agents-rail-header">
        <span className="agents-rail-title">Agents</span>
        <button className="agents-rail-icon-btn" aria-label="Close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.15 3.15a.5.5 0 0 1 .7 0L8 7.29l4.15-4.14a.5.5 0 0 1 .7.7L8.71 8l4.14 4.15a.5.5 0 0 1-.7.7L8 8.71l-4.15 4.14a.5.5 0 0 1-.7-.7L7.29 8 3.15 3.85a.5.5 0 0 1 0-.7z"/>
          </svg>
        </button>
      </div>
      <div className="agents-rail-body">
        {!hasAgents && !hasRecommended && (
          <div className="agents-rail-empty">No agents in this conversation</div>
        )}
        {hasAgents && (
          <div className="agents-rail-group">
            <div className="agents-rail-group-title">Agents in this conversation</div>
            {agents.map((agent) => (
              <AgentItem
                key={agent.id}
                agent={agent}
                onClick={() => onSelectAgent(agent)}
              />
            ))}
          </div>
        )}
        {hasRecommended && (
          <div className="agents-rail-group">
            <div className="agents-rail-group-title">Recommended</div>
            {recommended.map((agent) => (
              <AgentItem key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
