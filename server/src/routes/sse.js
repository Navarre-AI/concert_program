import { addClient } from '../services/sse-manager.js';

export default async function sseRoutes(fastify) {
  fastify.get('/api/concerts/:id/stream', async (request, reply) => {
    const concertId = request.params.id;

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable nginx buffering
    });

    // Send initial connection event
    reply.raw.write(`event: connected\ndata: {"concertId":"${concertId}"}\n\n`);

    // Register this client
    addClient(concertId, reply);

    // Keep the connection open — Fastify won't auto-close since we wrote to raw
    request.raw.on('close', () => {
      // Cleanup handled by sse-manager
    });
  });
}
