import { concerts, organizations, adminUsers, getConcertWithOrg } from '../services/mock-data.js';

// Simple auth check (in production, use JWT)
function requireAdmin(request, reply) {
  const auth = request.headers.authorization;
  if (!auth || !auth.startsWith('Bearer admin-')) {
    reply.status(401).send({ message: 'Unauthorized' });
    return null;
  }
  return adminUsers[0]; // Mock: always return first admin
}

export default async function adminRoutes(fastify) {
  // Admin login
  fastify.post('/api/admin/login', async (request, reply) => {
    const { email, password } = request.body || {};
    const user = adminUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }
    return { token: `admin-${user.id}-${Date.now()}`, user: { id: user.id, email: user.email } };
  });

  // List concerts for admin
  fastify.get('/api/admin/concerts', async (request, reply) => {
    const user = requireAdmin(request, reply);
    if (!user) return;
    const orgConcerts = concerts
      .filter(c => c.orgId === user.orgId)
      .map(({ controllerPin, ...c }) => c);
    return { concerts: orgConcerts };
  });

  // Get single concert for admin (includes PIN)
  fastify.get('/api/admin/concerts/:id', async (request, reply) => {
    const user = requireAdmin(request, reply);
    if (!user) return;
    const concert = getConcertWithOrg(request.params.id);
    if (!concert || concert.orgId !== user.orgId) {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    return concert;
  });

  // Create concert
  fastify.post('/api/admin/concerts', async (request, reply) => {
    const user = requireAdmin(request, reply);
    if (!user) return;
    const { title, venue, dateTime, controllerPin } = request.body || {};
    const newConcert = {
      id: `concert-${Date.now()}`,
      orgId: user.orgId,
      title: title || 'Untitled Concert',
      subtitle: '',
      venue: venue || '',
      dateTime: dateTime || '',
      status: 'draft',
      controllerPin: controllerPin || '0000',
      currentPieceId: null,
      pieces: []
    };
    concerts.push(newConcert);
    return newConcert;
  });

  // Update concert
  fastify.put('/api/admin/concerts/:id', async (request, reply) => {
    const user = requireAdmin(request, reply);
    if (!user) return;
    const concert = concerts.find(c => c.id === request.params.id && c.orgId === user.orgId);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    const { title, subtitle, venue, dateTime, controllerPin, status } = request.body || {};
    if (title !== undefined) concert.title = title;
    if (subtitle !== undefined) concert.subtitle = subtitle;
    if (venue !== undefined) concert.venue = venue;
    if (dateTime !== undefined) concert.dateTime = dateTime;
    if (controllerPin !== undefined) concert.controllerPin = controllerPin;
    if (status !== undefined) concert.status = status;
    return concert;
  });

  // Add piece to concert
  fastify.post('/api/admin/concerts/:id/pieces', async (request, reply) => {
    const user = requireAdmin(request, reply);
    if (!user) return;
    const concert = concerts.find(c => c.id === request.params.id && c.orgId === user.orgId);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    const data = request.body || {};
    const piece = {
      id: `piece-${Date.now()}`,
      concertId: concert.id,
      orderNumber: concert.pieces.length + 1,
      workName: data.workName || '',
      composer: data.composer || '',
      arranger: data.arranger || null,
      description: data.description || '',
      lyricsOriginal: data.lyricsOriginal || '',
      lyricsLanguageCode: data.lyricsLanguageCode || 'en',
      soloists: data.soloists || null,
      sponsor: data.sponsor || null,
      isPublish: 1
    };
    concert.pieces.push(piece);
    return piece;
  });

  // Update piece
  fastify.put('/api/admin/concerts/:concertId/pieces/:pieceId', async (request, reply) => {
    const user = requireAdmin(request, reply);
    if (!user) return;
    const concert = concerts.find(c => c.id === request.params.concertId && c.orgId === user.orgId);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    const piece = concert.pieces.find(p => p.id === request.params.pieceId);
    if (!piece) {
      return reply.status(404).send({ message: 'Piece not found' });
    }
    const data = request.body || {};
    if (data.workName !== undefined) piece.workName = data.workName;
    if (data.composer !== undefined) piece.composer = data.composer;
    if (data.arranger !== undefined) piece.arranger = data.arranger;
    if (data.description !== undefined) piece.description = data.description;
    if (data.lyricsOriginal !== undefined) piece.lyricsOriginal = data.lyricsOriginal;
    if (data.lyricsLanguageCode !== undefined) piece.lyricsLanguageCode = data.lyricsLanguageCode;
    if (data.soloists !== undefined) piece.soloists = data.soloists;
    if (data.sponsor !== undefined) piece.sponsor = data.sponsor;
    return piece;
  });

  // Delete piece
  fastify.delete('/api/admin/concerts/:concertId/pieces/:pieceId', async (request, reply) => {
    const user = requireAdmin(request, reply);
    if (!user) return;
    const concert = concerts.find(c => c.id === request.params.concertId && c.orgId === user.orgId);
    if (!concert) {
      return reply.status(404).send({ message: 'Concert not found' });
    }
    concert.pieces = concert.pieces.filter(p => p.id !== request.params.pieceId);
    return { ok: true };
  });
}
