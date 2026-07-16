import type { IncomingMessage, ServerResponse } from 'node:http';

export default function handler(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'POST') {
    response.statusCode = 405;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let receivedBytes = 0;
  request.on('data', (chunk: Buffer) => {
    receivedBytes += chunk.length;
  });
  request.on('end', () => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ success: true, receivedBytes }));
  });
  request.on('error', (error) => {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ success: false, error: error.message }));
  });
}
