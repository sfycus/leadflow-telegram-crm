import test from 'node:test';
import assert from 'node:assert/strict';

import { routeLead, scoreLead } from '../src/scoring.js';
import { processLead } from '../src/server.js';

test('scores detailed paid website lead as qualified', () => {
  const result = scoreLead('Нужен сайт на React за неделю, бюджет 30000 руб, есть ТЗ');

  assert.ok(result.score >= 74);
  assert.ok(result.tags.includes('website'));
  assert.ok(result.tags.includes('budget'));
  assert.equal(routeLead(result.score).status, 'qualified');
});

test('routes vague lead to clarification', () => {
  const result = processLead({ text: 'Здравствуйте, нужен бот, можете помочь?' });

  assert.equal(result.lead.status, 'waiting_for_client');
  assert.match(result.reply, /Уточните/);
});

test('rejects empty lead text', () => {
  assert.throws(() => processLead({ text: '' }), /Lead text is required/);
});
