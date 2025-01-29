import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
} from 'fastify';
import Fastify from 'fastify';

/**
 * Builds a Fastify instance for testing.
 *
 * @param plugins - The plugins to register on the Fastify instance
 * @returns The Fastify instance
 */
export function buildFastifyInstance(
  plugins: (FastifyPluginAsync | FastifyPluginCallback)[] = [],
): FastifyInstance {
  const fastify: FastifyInstance = Fastify();

  for (const plugin of plugins) {
    fastify.register(plugin);
  }

  beforeAll(() => fastify.ready());
  afterAll(() => fastify.close());

  return fastify;
}
