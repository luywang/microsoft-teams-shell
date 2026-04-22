const base = import.meta.env.BASE_URL

export const currentUser = {
  name: 'Gino Buzzelli',
  initials: 'GB',
  email: 'ginobuzz@microsoft.com',
  avatar: `${base}avatars/user.jpg`,
  status: 'available',
}

export const contacts = [
  { id: 1, name: 'Sarah Chen', initials: 'SC', color: '#6264A7', status: 'available', avatar: `${base}avatars/sarah-chen.jpg` },
  { id: 2, name: 'Claude', initials: null, color: '#D97757', status: null, isAgent: true, logo: 'claude', avatar: `${base}avatars/claude.png`, description: 'AI assistant by Anthropic' },
  { id: 3, name: 'Emma Larsen', initials: 'EL', color: '#E74856', status: 'away', avatar: `${base}avatars/emma-larsen.jpg` },
  { id: 4, name: 'Jira', initials: null, color: '#0052CC', status: null, isAgent: true, logo: 'jira', avatar: `${base}avatars/jira.png`, description: 'Issue tracking and project management' },
  { id: 5, name: 'Emily Watson', initials: 'EW', color: '#00B294', status: 'offline', avatar: `${base}avatars/emily-watson.jpg` },
  { id: 6, name: 'Design Sprint Team', initials: 'DS', color: '#8764B8', status: null, isGroup: true },
  { id: 7, name: 'James Kim', initials: 'JK', color: '#CA5010', status: 'available', avatar: `${base}avatars/james-kim.jpg` },
  { id: 8, name: 'Frontend Guild', initials: 'FG', color: '#498205', status: null, isGroup: true },
  { id: 9, name: 'Olivia Martinez', initials: 'OM', color: '#DA3B01', status: 'busy', avatar: `${base}avatars/olivia-martinez.jpg` },
  { id: 10, name: 'David Nguyen', initials: 'DN', color: '#005B70', status: 'available', avatar: `${base}avatars/david-nguyen.jpg` },
  { id: 11, name: 'Conversational AI PM Team', initials: 'CA', color: '#6264A7', status: null, isGroup: true, memberCount: 12 },
  { id: 12, name: 'Rachel Thompson', initials: 'RT', color: '#7160E8', status: 'available', avatar: `${base}avatars/rachel-thompson.jpg` },
  { id: 13, name: 'Sync on slash commands', initials: 'SS', color: '#B4009E', status: null, isGroup: true },
  { id: 14, name: 'Copilot Extensibility', initials: 'CE', color: '#0078D4', status: null, isGroup: true },
  { id: 15, name: 'Kevin Park', initials: 'KP', color: '#038387', status: 'away', avatar: `${base}avatars/kevin-park.jpg` },
  { id: 16, name: 'Agents Platform v2 team', initials: 'AP', color: '#CA5010', status: null, isGroup: true },
  { id: 17, name: 'Natalie Brooks', initials: 'NB', color: '#E74856', status: 'available', avatar: `${base}avatars/natalie-brooks.jpg` },
  { id: 18, name: 'DW support in BizChat', initials: 'DW', color: '#498205', status: null, isGroup: true },
  { id: 19, name: 'Targeted Messages', initials: 'TM', color: '#DA3B01', status: null, isGroup: true },
  { id: 20, name: 'ACF', initials: 'AC', color: '#005B70', status: null, isGroup: true },
  { id: 21, name: 'Northwind Core', initials: 'NC', color: '#0078D4', status: null, isGroup: true, memberCount: 9 },
  { id: 22, name: 'Design crit', initials: 'DC', color: '#8764B8', status: null, isGroup: true, memberCount: 6 },
  { id: 23, name: 'Northwind launch', initials: 'NL', color: '#CA5010', status: null, isGroup: true, memberCount: 7 },
  { id: 24, name: 'Dogfood feedback', initials: 'DF', color: '#498205', status: null, isGroup: true, memberCount: 11 },
]

export const favorites = [
  { contactId: 1 },
  { contactId: 12 },
  { contactId: 15 },
  { contactId: 2 },
  { contactId: 11, bold: true },
]

export const projectNorthwind = [
  { contactId: 21, bold: true },
  { contactId: 22 },
  { contactId: 23 },
  { contactId: 24 },
]

export const chatList = [
  // Jira demo flow disabled — restore `draft: '/Jira Are there any blockers assigned to me?'` to re-enable.
  { contactId: 3 },
  { contactId: 4 },
  { contactId: 6 },
  { contactId: 13 },
  { contactId: 14 },
  { contactId: 7, bold: true },
  { contactId: 8, bold: true },
  { contactId: 16 },
  { contactId: 5 },
  { contactId: 17 },
  { contactId: 9, bold: true },
  { contactId: 18 },
  { contactId: 10 },
  { contactId: 19 },
  { contactId: 20 },
]
