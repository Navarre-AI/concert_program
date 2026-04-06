import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { config } from './config.js';
import concertRoutes from './routes/concerts.js';
import sseRoutes from './routes/sse.js';
import controlRoutes from './routes/control.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDist = join(__dirname, '../../client/dist');

const fastify = Fastify({ logger: true });

// CORS for dev (Vite proxy handles this in dev, but needed for production)
await fastify.register(cors, { origin: config.corsOrigin });

// API Routes (registered first so they take priority over static files)
await fastify.register(concertRoutes);
await fastify.register(sseRoutes);
await fastify.register(controlRoutes);
await fastify.register(adminRoutes);
await fastify.register(healthRoutes);

// Serve built client static files (production mode)
if (existsSync(clientDist)) {
  await fastify.register(fastifyStatic, {
    root: clientDist,
    prefix: '/'
  });

  // SPA fallback: serve index.html for all non-API routes
  fastify.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api/')) {
      reply.status(404).send({ message: 'Not found' });
    } else {
      reply.sendFile('index.html');
    }
  });

  console.log(`Serving client from ${clientDist}`);
}

// Start
try {
  await fastify.listen({ port: config.port, host: config.host });
  console.log(`Server running at http://localhost:${config.port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
