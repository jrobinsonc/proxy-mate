import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import pkg from '../package.json';

export default function app(fastify: FastifyInstance) {
  fastify.addHook('onSend', async (_: FastifyRequest, reply: FastifyReply) => {
    reply.header('X-ProxyMate', pkg.version);
  });

  fastify.get('/', () => {
    return 'ok';
  });
}
