import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.js';
import concertRoutes from './routes/concerts.js';
import sseRoutes from './routes/sse.js';
import controlRoutes from './routes/control.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';

const fastify = Fastify({ logger: true });

// CORS for dev (Vite proxy handles this in dev, but needed for production)
await fastify.register(cors, { origin: config.corsOrigin });

// Routes
await fastify.register(concertRoutes);
await fastify.register(sseRoutes);
await fastify.register(controlRoutes);
await fastify.register(adminRoutes);
await fastify.register(healthRoutes);

// Start
try {
  await fastify.listen({ port: config.port, host: config.host });
  console.log(`Server running at http://localhost:${config.port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
