import type { FastifyInstance } from 'fastify';
import { config, env } from '../config';

/**
 * Prints the registered routes to the console when the server starts.
 *
 * @param fastify - The Fastify instance.
 */
export default function printRegisteredRoutes(fastify: FastifyInstance): void {
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
}
