export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const indicator = searchParams.get('indicator');
  const time_period = searchParams.get('time_period') || 14;

  const API_KEY = 'bda38680819a4c629bf16f7d6c001a63';
  const url = `https://api.twelvedata.com/${indicator}?symbol=${symbol}&interval=1day&time_period=${time_period}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "프록시 오류", detail: err.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
}
