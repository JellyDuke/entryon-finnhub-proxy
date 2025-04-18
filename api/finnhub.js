export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const API_KEY = 'd00fen1r01qk939nqohgd00fen1r01qk939nqoi0';

  if (!symbol) {
    return new Response(JSON.stringify({ error: "symbol이 필요합니다." }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const from = now - 60 * 60 * 24 * 90;
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${API_KEY}`;

  try {
    const result = await fetch(url);
    const json = await result.json();
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "API 실패", detail: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
