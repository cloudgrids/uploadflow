const UPSCALE_PAGE_URL = 'https://www.iloveimg.com/upscale-image';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
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
      cache: 'no-store',
      redirect: 'follow'
    });

    if (!upstream.ok) {
      return Response.json({ error: `Upscale provider returned ${upstream.status}` }, { status: 502, headers: corsHeaders });
    }

    return new Response(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': upstream.headers.get('content-type') ?? 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (reason) {
    return Response.json(
      { error: reason instanceof Error ? reason.message : 'Unable to contact the upscale provider' },
      { status: 502, headers: corsHeaders }
    );
  }
}
