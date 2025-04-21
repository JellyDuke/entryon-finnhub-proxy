export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const API_KEY = 'bda38680819a4c629bf16f7d6c001a63';

  if (!symbol) {
    return new Response(JSON.stringify({ error: "symbol 파라미터가 필요합니다." }), {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }

  const baseUrl = `https://api.twelvedata.com`;

  const indicators = [
    // 기술적 지표
    { name: 'rsi', url: `${baseUrl}/rsi?symbol=${symbol}&interval=1day&time_period=14&apikey=${API_KEY}` },
    { name: 'stochastic', url: `${baseUrl}/stochastic?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'stochrsi', url: `${baseUrl}/stochrsi?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'macd', url: `${baseUrl}/macd?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'adx', url: `${baseUrl}/adx?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'willr', url: `${baseUrl}/willr?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'cci', url: `${baseUrl}/cci?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'atr', url: `${baseUrl}/atr?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'highs_lows', url: `${baseUrl}/highs_lows?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'ultimate_oscillator', url: `${baseUrl}/ultimate_oscillator?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'roc', url: `${baseUrl}/roc?symbol=${symbol}&interval=1day&apikey=${API_KEY}` },
    { name: 'bull_bear_power', url: `${baseUrl}/bull_bear_power?symbol=${symbol}&interval=1day&time_period=13&apikey=${API_KEY}` },

    // 이동평균선 (단순)
    { name: 'ma5', url: `${baseUrl}/ma?symbol=${symbol}&interval=1day&time_period=5&apikey=${API_KEY}` },
    { name: 'ma10', url: `${baseUrl}/ma?symbol=${symbol}&interval=1day&time_period=10&apikey=${API_KEY}` },
    { name: 'ma20', url: `${baseUrl}/ma?symbol=${symbol}&interval=1day&time_period=20&apikey=${API_KEY}` },
    { name: 'ma50', url: `${baseUrl}/ma?symbol=${symbol}&interval=1day&time_period=50&apikey=${API_KEY}` },
    { name: 'ma100', url: `${baseUrl}/ma?symbol=${symbol}&interval=1day&time_period=100&apikey=${API_KEY}` },
    { name: 'ma200', url: `${baseUrl}/ma?symbol=${symbol}&interval=1day&time_period=200&apikey=${API_KEY}` }
  ];

  const results = {};

  // ✅ quote API (현재가 + 이름)
  try {
    const quoteUrl = `${baseUrl}/quote?symbol=${symbol}&apikey=${API_KEY}`;
    const quoteRes = await fetch(quoteUrl);
    const quoteData = await quoteRes.json();
    results['quote'] = quoteData;
  } catch (err) {
    results['quote'] = { error: true, message: err.message };
  }

  // ✅ 기술 지표 + 이동평균 호출
  for (const ind of indicators) {
    try {
      const res = await fetch(ind.url);
      const json = await res.json();
      results[ind.name] = json;
    } catch (err) {
      results[ind.name] = { error: true, message: err.message };
    }
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

