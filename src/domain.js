export const LeadStatus = Object.freeze({
  NEW: 'new',
  QUALIFIED: 'qualified',
  WAITING: 'waiting_for_client',
  REJECTED: 'rejected'
});

export function createLead({ source = 'telegram', user = 'unknown', text, createdAt = new Date() }) {
  if (!text || typeof text !== 'string') {
    throw new Error('Lead text is required');
  }

  return {
    id: `lead_${createdAt.getTime()}_${Math.random().toString(16).slice(2, 8)}`,
    source,
    user,
    text: text.trim(),
    createdAt: createdAt.toISOString(),
    status: LeadStatus.NEW,
    score: 0,
    tags: [],
    nextAction: 'analyze'
  };
}

export function updateLead(lead, patch) {
  return {
    ...lead,
    ...patch,
    updatedAt: new Date().toISOString()
  };
}
