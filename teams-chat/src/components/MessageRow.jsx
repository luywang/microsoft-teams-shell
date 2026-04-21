import { agentLogos } from '../shared/agentLogos'
import { contacts, currentUser } from '../data/contacts'
import LinkCard from './LinkCard'

function PrivateDisclaimer() {
  return (
    <div className="message-private-disclaimer">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4zm1 0h6V5a3 3 0 1 0-6 0v2z"/>
      </svg>
      <span>Only you can see this conversation</span>
    </div>
  )
}

function ThreadReplyBadge({ reply, onClick }) {
  const ids = reply.participantIds || (reply.agentId ? [reply.agentId] : [])
  const participants = ids
    .map((id) => (id === 'me' ? currentUser : contacts.find((c) => c.id === id)))
    .filter(Boolean)
  if (!participants.length) return null
  const label = reply.count === 1 ? '1 reply' : `${reply.count} replies`
  return (
    <button type="button" className="message-thread-replies" onClick={onClick}>
      <span className="message-thread-replies-avatars">
        {participants.map((p, i) => (
          <span
            key={i}
            className="message-thread-replies-avatar"
            style={{ background: p.avatar ? 'transparent' : p.color || '#6264A7' }}
          >
            {p.avatar ? (
              <img src={p.avatar} alt="" />
            ) : p.isAgent ? (
              agentLogos[p.logo](10)
            ) : (
              p.initials
            )}
          </span>
        ))}
      </span>
      <span className="message-thread-replies-label">{label}</span>
    </button>
  )
}

export default function MessageRow({ message, activeContact, onOpenThread }) {
  const isMe = message.senderId === 'me'
  const sender = isMe
    ? currentUser
    : activeContact.isGroup
      ? contacts.find(c => c.id === message.senderId)
      : activeContact

  return (
    <div className={`message-row ${isMe ? 'message-mine' : ''}`}>
      {!isMe && (
        <div className="message-avatar-col">
          <div className="message-avatar" style={{ background: sender.avatar ? 'transparent' : sender.color }}>
            {sender.avatar ? (
              <img src={sender.avatar} alt="" className="msg-avatar-img" />
            ) : sender.isAgent ? agentLogos[sender.logo]() : sender.initials}
          </div>
        </div>
      )}
      <div className="message-content-wrap">
        <div className="message-meta">
          <span className="message-sender-name">{isMe ? 'You' : sender.name}</span>
          <span className="message-timestamp">{message.time}</span>
        </div>
        <div className={`message-bubble ${message.isPrivate ? 'message-bubble-private' : ''}`}>
          {message.isPrivate && <PrivateDisclaimer />}
          {message.forwardedFrom && (
            <div className="forwarded-message">
              <div className="forwarded-sender">{message.forwardedFrom.sender}</div>
              <div className="forwarded-text">{message.forwardedFrom.text}</div>
            </div>
          )}
          {Array.isArray(message.text)
            ? message.text.map((part, i) =>
                typeof part === 'string' ? part : <span key={i} className="mention">{part.name}</span>
              )
            : message.text}
          {message.link && <LinkCard link={message.link} />}
          {message.cards && (
            <div className="message-cards">
              {message.cards.map((card, i) => (
                <div key={i} className="adaptive-card" style={{ borderLeftColor: card.accentColor }}>
                  <div className="card-title">{card.title}</div>
                  <div className="card-facts">
                    {card.facts.map((fact, j) => (
                      <span key={j} className="card-fact">
                        <span className="card-fact-label">{fact.label}:</span> {fact.value}
                      </span>
                    ))}
                  </div>
                  {card.actions && (
                    <div className="card-actions">
                      {card.actions.map((action, j) => (
                        <button key={j} className="card-action-btn">{action}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {message.threadReply && (
          <ThreadReplyBadge
            reply={message.threadReply}
            onClick={() => onOpenThread?.(message)}
          />
        )}
      </div>
      {isMe && (
        <div className="message-avatar-col">
          <div className="message-avatar" style={{ background: currentUser.avatar ? 'transparent' : '#6264A7' }}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="" className="msg-avatar-img" />
            ) : currentUser.initials}
          </div>
        </div>
      )}
    </div>
  )
}
