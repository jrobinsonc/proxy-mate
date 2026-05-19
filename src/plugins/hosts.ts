import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { config } from '../config';
import { setHosts, removeHosts } from '../utils/hosts';

/**
 * Fastify plugin to manage /etc/hosts entries.
 *
 * @param fastify - The Fastify instance.
 */
const hosts: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _options: unknown,
  done: () => void,
) => {
  const { routes, tld }: { routes: Record<string, string>; tld: string } =
    config;

  try {
    fastify.log.info('Setting up hosts entries');
    setHosts(routes, tld);
  } catch (error) {
    fastify.log.error(
      error,
      'Failed to set hosts entries. Do you have root privileges?',
    );
  }

  fastify.addHook('onClose', (_instance: FastifyInstance, next: () => void) => {
    try {
      fastify.log.info('Removing hosts entries');
      removeHosts(routes, tld);
    } catch (error) {
      fastify.log.error(
        error,
        'Failed to remove hosts entries. Do you have root privileges?',
      );
    } finally {
      next();
    }
  });

  done();
};

export default fp(hosts, {
  name: 'hosts',
});
