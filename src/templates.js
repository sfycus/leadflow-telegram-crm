export function buildReply(lead) {
  if (lead.nextAction === 'send_offer') {
    return [
      'Здравствуйте! Задача выглядит понятной, могу помочь.',
      `По описанию вижу направления: ${lead.tags.join(', ') || 'IT-задача'}.`,
      'Чтобы быстро оценить сроки и стоимость, пришлите примеры, дедлайн и желаемый результат.'
    ].join(' ');
  }

  if (lead.nextAction === 'ask_clarifying_questions') {
    return [
      'Здравствуйте! Могу подсказать по задаче.',
      'Уточните, пожалуйста: что нужно сделать, какой дедлайн, есть ли примеры и бюджет?'
    ].join(' ');
  }

  return [
    'Здравствуйте! Спасибо за обращение.',
    'Сейчас по описанию не хватает деталей, поэтому не хочу обещать лишнего.',
    'Если сможете подробнее описать задачу, я вернусь с оценкой.'
  ].join(' ');
}

export function buildInternalNote(lead) {
  return [
    `Lead score: ${lead.score}/100`,
    `Status: ${lead.status}`,
    `Tags: ${lead.tags.join(', ') || 'none'}`,
    `Next action: ${lead.nextAction}`
  ].join('\n');
}
