import type {
  FastifyInstance,
  FastifyPluginDoneFn,
  FastifyPluginOptions,
} from 'fastify';
import proxy from '@fastify/http-proxy';
import { config } from '../config';
import fp from 'fastify-plugin';

/**
 * Registers the reverse proxy for each configured route.
 *
 * @param fastify - The Fastify instance.
 * @param opts - The Fastify plugin options.
 * @param done - The Fastify plugin done function.
 */
function reverseProxy(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: FastifyPluginDoneFn,
): void {
  for (const [domain, upstream] of Object.entries(config.routes)) {
    const host: string = `${domain}${config.tld}`;

    fastify.register(proxy, {
      upstream,
      prefix: '/',
      rewritePrefix: '/',
      constraints: { host },
    });

    fastify.log.info(`Registered proxy for ${host} -> ${upstream}`);
  }

  done();
}

export default fp(reverseProxy);
