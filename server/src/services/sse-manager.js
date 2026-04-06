// Manages SSE connections grouped by concert ID
const rooms = new Map(); // concertId -> Set<Response>

export function addClient(concertId, reply) {
  if (!rooms.has(concertId)) {
    rooms.set(concertId, new Set());
  }
  rooms.get(concertId).add(reply);

  reply.raw.on('close', () => {
    const room = rooms.get(concertId);
    if (room) {
      room.delete(reply);
      if (room.size === 0) rooms.delete(concertId);
    }
  });
}

export function broadcast(concertId, eventType, data) {
  const room = rooms.get(concertId);
  if (!room) return;

  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const reply of room) {
    reply.raw.write(payload);
  }
}

export function getClientCount(concertId) {
  return rooms.get(concertId)?.size || 0;
}

// Heartbeat to keep connections alive
setInterval(() => {
  for (const [, room] of rooms) {
    for (const reply of room) {
      reply.raw.write('event: heartbeat\ndata: {}\n\n');
    }
  }
}, 30000);
