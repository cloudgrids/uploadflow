export async function POST(request: Request) {
  try {
    const receivedBytes = (await request.arrayBuffer()).byteLength;
    return Response.json({ success: true, receivedBytes });
  } catch (reason) {
    return Response.json(
      { success: false, error: reason instanceof Error ? reason.message : 'Unable to read upload' },
      { status: 400 }
    );
  }
}

export function GET() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
