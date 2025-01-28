import type {
  FastifyInstance,
  FastifyPluginDoneFn,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import pkg from '../../package.json';
import fp from 'fastify-plugin';

/**
 * Adds the ProxyMate header to the response.
 *
 * @param fastify - The Fastify instance.
 * @param opts - The Fastify plugin options.
 * @param done - The Fastify plugin done function.
 */
function addAppHeaders(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: FastifyPluginDoneFn,
): void {
  fastify.addHook('onSend', async (_: FastifyRequest, reply: FastifyReply) => {
    reply.header('X-ProxyMate', pkg.version);
  });

  done();
}

export default fp(addAppHeaders);
