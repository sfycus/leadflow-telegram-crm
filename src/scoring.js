const KEYWORDS = {
  website: ['сайт', 'лендинг', 'интернет-магазин', 'страница', 'frontend', 'react'],
  bot: ['бот', 'telegram', 'телеграм', 'автоматизация', 'рассылка'],
  marketplace: ['карточка', 'маркетплейс', 'wildberries', 'ozon', 'инфографика'],
  urgent: ['срочно', 'сегодня', 'завтра', 'неделя', 'неделю', 'быстро'],
  budget: ['бюджет', 'оплата', 'руб', '₽', 'тыс', 'стоимость']
};

const MONEY_RE = /(?:\d{2,3}\s?000|\d+\s?тыс|\d+\s?к|₽|руб)/i;

export function extractTags(text) {
  const normalized = text.toLowerCase();
  return Object.entries(KEYWORDS)
    .filter(([, words]) => words.some((word) => normalized.includes(word)))
    .map(([tag]) => tag);
}

export function scoreLead(text) {
  const tags = extractTags(text);
  let score = 22;

  if (tags.includes('website')) score += 24;
  if (tags.includes('bot')) score += 22;
  if (tags.includes('marketplace')) score += 18;
  if (tags.includes('urgent')) score += 12;
  if (tags.includes('budget')) score += 12;
  if (MONEY_RE.test(text)) score += 16;
  if (text.length > 80) score += 8;
  if (text.includes('?')) score += 4;

  return {
    score: Math.min(score, 100),
    tags
  };
}

export function routeLead(score) {
  if (score >= 74) {
    return {
      status: 'qualified',
      nextAction: 'send_offer'
    };
  }

  if (score >= 40) {
    return {
      status: 'waiting_for_client',
      nextAction: 'ask_clarifying_questions'
    };
  }

  return {
    status: 'rejected',
    nextAction: 'send_soft_decline'
  };
}
