import { agentLogos } from '../../shared/agentLogos'
import './Avatar.css'

function StatusDot({ status }) {
  if (!status) return null
  return <span className={`status-dot status-${status}`} />
}

export default function Avatar({ contact, size = 36 }) {
  const logoSize = size * 0.4
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
      {contact.status && <StatusDot status={contact.status} />}
    </div>
  )
}
