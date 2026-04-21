import './SessionsRail.css'

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="#616161" className="session-link-icon">
    <path d="M8 6C8.27614 6 8.5 6.22386 8.5 6.5C8.5 6.74546 8.32312 6.94961 8.08988 6.99194L8 7H6C4.34315 7 3 8.34315 3 10C3 11.5906 4.23784 12.892 5.80275 12.9936L6 13H8C8.27614 13 8.5 13.2239 8.5 13.5C8.5 13.7455 8.32312 13.9496 8.08988 13.9919L8 14H6C3.79086 14 2 12.2091 2 10C2 7.8645 3.67346 6.11986 5.78053 6.00592L6 6H8ZM14 6C16.2091 6 18 7.79086 18 10C18 12.1355 16.3265 13.8801 14.2195 13.9941L14 14H12C11.7239 14 11.5 13.7761 11.5 13.5C11.5 13.2545 11.6769 13.0504 11.9101 13.0081L12 13H14C15.6569 13 17 11.6569 17 10C17 8.40942 15.7622 7.10795 14.1973 7.00638L14 7H12C11.7239 7 11.5 6.77614 11.5 6.5C11.5 6.25454 11.6769 6.05039 11.9101 6.00806L12 6H14ZM6 9.5H14C14.2761 9.5 14.5 9.72386 14.5 10C14.5 10.2455 14.3231 10.4496 14.0899 10.4919L14 10.5H6C5.72386 10.5 5.5 10.2761 5.5 10C5.5 9.75454 5.67688 9.55039 5.91012 9.50806L6 9.5H14H6Z"/>
  </svg>
)

export default function SessionsRail({ sessions, activeSessionId, onSelectSession, onClose, onNewSession }) {
  return (
    <div className="sessions-rail">
      <div className="sessions-rail-header">
        <span className="sessions-rail-title">Sessions</span>
        <div className="sessions-rail-header-actions">
          <button className="sessions-rail-new" aria-label="New session" onClick={onNewSession}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2.5a.5.5 0 0 1 .5.5v4.5H13a.5.5 0 0 1 0 1H8.5V13a.5.5 0 0 1-1 0V8.5H3a.5.5 0 0 1 0-1h4.5V3a.5.5 0 0 1 .5-.5z"/>
            </svg>
          </button>
          <button className="sessions-rail-close" aria-label="Close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.15 3.15a.5.5 0 0 1 .7 0L8 7.29l4.15-4.14a.5.5 0 0 1 .7.7L8.71 8l4.14 4.15a.5.5 0 0 1-.7.7L8 8.71l-4.15 4.14a.5.5 0 0 1-.7-.7L7.29 8 3.15 3.85a.5.5 0 0 1 0-.7z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="sessions-rail-list">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`session-item ${session.id === activeSessionId ? 'session-item-active' : ''}`}
            onClick={() => onSelectSession(session.id)}
          >
            <div className="session-name">
              {session.name}
              {session.sourceChatId && <LinkIcon />}
            </div>
            <div className="session-time">{session.time}</div>
            <div className="session-preview">{session.preview}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
