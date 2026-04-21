import { favorites, chatList, contacts } from '../data'
import { copilotLogo } from '../shared/assets'
import { Avatar } from './common'
import './ChatList.css'

export default function ChatList({ activeChatId, onSelectChat, readChatIds }) {
  const isUnread = (bold, contactId) => bold && !readChatIds?.has(contactId)
  return (
    <div className="chat-list-panel">
      {/* Row 1: Title + actions */}
      <div className="chat-list-header">
        <h2 className="chat-list-title">Chat</h2>
        <div className="chat-list-actions">
          <button className="icon-btn" aria-label="More options">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.25 10a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm3.75 1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z"/>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l3.65 3.65a.75.75 0 0 1-1.06 1.06l-3.65-3.65A5.5 5.5 0 1 1 8.5 3zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
            </svg>
          </button>
          <div className="compose-btn-group">
            <button className="icon-btn" aria-label="New chat">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.5 2.5H4a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V9"/>
                <path d="M16.5 2.5l-9 9V14.5h3l9-9"/>
              </svg>
            </button>
            <button className="icon-btn compose-chevron" aria-label="New chat options">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2.15 4.15a.5.5 0 0 1 .7 0L6 7.29l3.15-3.14a.5.5 0 0 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="chat-list-divider" />

      {/* Row 2: Filter pills */}
      <div className="chat-list-filters">
        <div className="filter-pills">
          <button className="filter-pill">Unread</button>
          <button className="filter-pill">Channels</button>
          <button className="filter-pill">Chats</button>
        </div>
        <button className="icon-btn filter-chevron" aria-label="More filters">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.15 5.15a.5.5 0 0 1 .7 0L8 9.29l4.15-4.14a.5.5 0 0 1 .7.7l-4.5 4.5a.5.5 0 0 1-.7 0l-4.5-4.5a.5.5 0 0 1 0-.7z"/>
          </svg>
        </button>
      </div>

      <div className="chat-list-divider" />

      {/* Row 3: Copilot + Quick views */}
      <div className="chat-list-pinned">
        <div className="pinned-item">
          <div className="copilot-icon">
            <img src={copilotLogo} alt="Copilot" width="20" height="20" />
          </div>
          <span className="pinned-label">Copilot</span>
        </div>
        <div className="pinned-item">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" className="section-chevron">
            <path d="M4.15 2.15a.5.5 0 0 1 .7 0l3.5 3.5a.5.5 0 0 1 0 .7l-3.5 3.5a.5.5 0 0 1-.7-.7L7.29 6 4.15 2.85a.5.5 0 0 1 0-.7z"/>
          </svg>
          <span className="pinned-label pinned-label-bold">Quick views</span>
          <span className="quick-views-badge">46</span>
        </div>
      </div>

      <div className="chat-list-divider" />

      {/* Favorites section */}
      <div className="chat-list-section-header">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="section-chevron-down">
          <path d="M2.15 4.15a.5.5 0 0 1 .7 0L6 7.29l3.15-3.14a.5.5 0 0 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7z"/>
        </svg>
        <span>Favorites</span>
      </div>

      <div className="chat-list-items">
        {favorites.map((fav) => {
          const contact = contacts.find(c => c.id === fav.contactId)
          const unread = isUnread(fav.bold, contact.id)
          return (
            <div
              key={contact.id}
              className={`chat-list-item ${contact.id === activeChatId ? 'selected' : ''}`}
              onClick={() => onSelectChat(contact.id)}
            >
              <Avatar contact={contact} size={20} />
              <span className={`chat-item-name ${unread ? 'chat-item-bold' : ''}`}>{contact.name}</span>
              {unread && <span className="unread-dot" />}
            </div>
          )
        })}

        {/* Chats section */}
        <div className="chat-list-section-header">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="section-chevron-down">
            <path d="M2.15 4.15a.5.5 0 0 1 .7 0L6 7.29l3.15-3.14a.5.5 0 0 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7z"/>
          </svg>
          <span>Chats</span>
        </div>

        {chatList.map((chat) => {
          const contact = contacts.find(c => c.id === chat.contactId)
          const unread = isUnread(chat.bold, contact.id)
          return (
            <div
              key={contact.id}
              className={`chat-list-item ${contact.id === activeChatId ? 'selected' : ''}`}
              onClick={() => onSelectChat(contact.id)}
            >
              <Avatar contact={contact} size={20} />
              <span className={`chat-item-name ${unread ? 'chat-item-bold' : ''}`}>{contact.name}</span>
              {unread && <span className="unread-dot" />}
              {/* Jira demo arrow removed — `.demo-hint-arrow` remains in CSS if needed. */}
            </div>
          )
        })}
      </div>

      <div className="chat-list-footer">
        <span>Teams and channels</span>
      </div>
    </div>
  )
}
