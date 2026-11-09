import { processLead } from './server.js';

const samples = [
  {
    user: '@client_web',
    text: 'Нужно сделать лендинг на React за неделю, бюджет 25000 руб. Есть пример дизайна.'
  },
  {
    user: '@market_seller',
    text: 'Хочу улучшить карточку товара на Ozon и Wildberries, нужна инфографика и тексты.'
  },
  {
    user: '@random',
    text: 'Привет, сколько стоит что-нибудь сделать?'
  }
];

for (const sample of samples) {
  const result = processLead({ source: 'demo', ...sample });
  console.log('\n---');
  console.log(result.internalNote);
  console.log(`Reply: ${result.reply}`);
}
