import { createServer } from 'node:http';
import { createLead, updateLead } from './domain.js';
import { routeLead, scoreLead } from './scoring.js';
import { buildInternalNote, buildReply } from './templates.js';

const leads = [];

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

function send(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*'
  });
  response.end(JSON.stringify(payload, null, 2));
}

export function processLead(input) {
  const rawLead = createLead(input);
  const scored = scoreLead(rawLead.text);
  const route = routeLead(scored.score);
  const lead = updateLead(rawLead, {
    ...scored,
    ...route
  });

  return {
    lead,
    reply: buildReply(lead),
    internalNote: buildInternalNote(lead)
  };
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/health') {
      return send(response, 200, { ok: true, service: 'leadflow-telegram-crm' });
    }

    if (request.method === 'GET' && request.url === '/leads') {
      return send(response, 200, { leads });
    }

    if (request.method === 'POST' && request.url === '/webhook/telegram') {
      const body = await readJson(request);
      const result = processLead({
        source: 'telegram',
        user: body.user,
        text: body.text
      });
      leads.push(result.lead);
      return send(response, 201, result);
    }

    return send(response, 404, { error: 'Not found' });
  } catch (error) {
    return send(response, 400, { error: error.message });
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 8080);
  server.listen(port, () => {
    console.log(`LeadFlow CRM is running on http://localhost:${port}`);
  });
}

export { server };
