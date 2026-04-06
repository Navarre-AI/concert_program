import { getConcertWithOrg, concerts } from '../services/mock-data.js';

export default async function concertRoutes(fastify) {
  // Public: Get full concert program
  fastify.get('/api/concerts/:id', async (request, reply) => {
    const concert = getConcertWithOrg(request.params.id);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    // Only return published/live concerts to audience
    if (concert.status === 'draft') {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    // Don't expose PIN to audience
    const { controllerPin, ...safe } = concert;
    return safe;
  });

  // Public: Get concert live status
  fastify.get('/api/concerts/:id/status', async (request, reply) => {
    const concert = concerts.find(c => c.id === request.params.id);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    return {
      isLive: concert.status === 'live',
      status: concert.status,
      currentPieceId: concert.currentPieceId
    };
  });
}
