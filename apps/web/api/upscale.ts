import type { IncomingMessage, ServerResponse } from 'node:http';

const UPSCALE_PAGE_URL = 'https://www.iloveimg.com/upscale-image';

const setCorsHeaders = (response: ServerResponse) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== 'GET') {
    response.statusCode = 405;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const upstream = await fetch(UPSCALE_PAGE_URL, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en,en-GB;q=0.9,en-US;q=0.8',
        origin: 'https://www.iloveimg.com',
        referer: 'https://www.iloveimg.com/',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      redirect: 'follow'
    });

    if (!upstream.ok) {
      response.statusCode = 502;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: `Upscale provider returned ${upstream.status}` }));
      return;
    }

    response.statusCode = 200;
    response.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    response.statusCode = 502;
    response.setHeader('Content-Type', 'application/json');
    response.end(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to contact the upscale provider' })
    );
  }
}
