import type {
  FastifyInstance,
  FastifyPluginDoneFn,
  FastifyPluginOptions,
} from 'fastify';
import { config, env } from '../config';
import fp from 'fastify-plugin';

/**
 * Prints the registered routes to the console when the server starts.
 *
 * @param fastify - The Fastify instance.
 * @param opts - The Fastify plugin options.
 * @param done - The Fastify plugin done function.
 */
function printRegisteredRoutes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: FastifyPluginDoneFn,
): void {
  fastify.addHook('onListen', () => {
    fastify.log.info('');
    fastify.log.info('=========================================');
    fastify.log.info(
      `Proxy listening on port ${String(env.PORT)} for domains:`,
    );

    for (const domain of Object.keys(config.routes)) {
      fastify.log.info(`- ${domain}${config.tld}`);
    }

    fastify.log.info('=========================================');
    fastify.log.info('');
  });

  done();
}

export default fp(printRegisteredRoutes);
