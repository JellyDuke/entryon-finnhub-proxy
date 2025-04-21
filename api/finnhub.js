export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const indicators = searchParams.get('indicators')?.split(',') || ['rsi', 'macd'];
  const API_KEY = 'd00fen1r01qk939nqohgd00fen1r01qk939nqoi0';

  const base = 'https://finnhub.io/api/v1/indicator';
  const resolution = 'D';
  const result = {};

  for (const indicator of indicators) {
    const url = `${base}?symbol=${symbol}&resolution=${resolution}&indicator=${indicator}&timeperiod=14&token=${API_KEY}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      result[indicator] = json;
    } catch (e) {
      result[indicator] = { error: true, message: e.message };
    }
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
