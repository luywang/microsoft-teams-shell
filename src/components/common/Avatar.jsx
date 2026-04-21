import { agentLogos } from '../../shared/agentLogos'
import './Avatar.css'

// Renders a contact/agent/group avatar. Status dot scales with `size` so it
// stays visually balanced across usages (title bar 28, message row 32, etc).
// Groups and agents typically have no `contact.status` — no dot is drawn.
export default function Avatar({ contact, size = 36 }) {
  const logoSize = size * 0.4
  const dotSize = Math.max(8, Math.round(size * 0.33))
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: contact.avatar ? 'transparent' : contact.color,
        fontSize: size * 0.36,
      }}
    >
      {contact.avatar ? (
        <img src={contact.avatar} alt="" className="avatar-img" style={{ width: size, height: size }} />
      ) : contact.isAgent ? agentLogos[contact.logo](logoSize) : contact.initials}
      {contact.status && (
        <span
          className={`status-dot status-${contact.status}`}
          style={{ width: dotSize, height: dotSize }}
        />
      )}
    </div>
  )
}
