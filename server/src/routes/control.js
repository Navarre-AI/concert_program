import { concerts } from '../services/mock-data.js';
import { broadcast } from '../services/sse-manager.js';

export default async function controlRoutes(fastify) {
  // Controller login with PIN
  fastify.post('/api/control/:id/login', async (request, reply) => {
    const concert = concerts.find(c => c.id === request.params.id);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }

    const { pin } = request.body || {};
    if (pin !== concert.controllerPin) {
      return reply.status(401).send({ message: 'Invalid PIN' });
    }

    // Simple token (in production, use JWT)
    const token = `ctrl-${concert.id}-${Date.now()}`;
    return {
      token,
      status: concert.status,
      currentPieceId: concert.currentPieceId
    };
  });

  // Set current piece (controller action)
  fastify.post('/api/control/:id/set-piece', async (request, reply) => {
    const concert = concerts.find(c => c.id === request.params.id);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }

    // Basic auth check
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ctrl-')) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const { pieceId } = request.body || {};
    concert.currentPieceId = pieceId || null;

    // Broadcast to all audience SSE clients
    broadcast(concert.id, 'piece_change', {
      pieceId: concert.currentPieceId,
      status: concert.status
    });

    return { ok: true, currentPieceId: concert.currentPieceId };
  });

  // Set concert status (controller action)
  fastify.post('/api/control/:id/set-status', async (request, reply) => {
    const concert = concerts.find(c => c.id === request.params.id);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }

    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ctrl-')) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const { status } = request.body || {};
    const validStatuses = ['published', 'live', 'intermission', 'ended'];
    if (!validStatuses.includes(status)) {
      return reply.status(400).send({ message: 'Invalid status' });
    }

    concert.status = status;

    // Clear current piece when ending
    if (status === 'ended') {
      concert.currentPieceId = null;
    }

    broadcast(concert.id, 'status_change', {
      isLive: status === 'live',
      status: concert.status,
      currentPieceId: concert.currentPieceId
    });

    return { ok: true, status: concert.status };
  });
}
