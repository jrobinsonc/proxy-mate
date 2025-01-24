import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify';
import Fastify from 'fastify';
import pkg from '../package.json';
import pacRoute from './routes/pac-route';

export default function app(opts: FastifyServerOptions = {}): FastifyInstance {
  const fastify: FastifyInstance = Fastify(opts);

  fastify.addHook('onSend', async (_: FastifyRequest, reply: FastifyReply) => {
    reply.header('X-ProxyMate', pkg.version);
  });

  pacRoute(fastify);

  return fastify;
}
