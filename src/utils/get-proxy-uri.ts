import type { FastifyInstance } from 'fastify';
import type { AddressInfo } from 'node:net';

/**
 * Gets the proxy URI from the Fastify server's address.
 *
 * @param fastify - The Fastify instance with an active server
 * @returns The proxy URI in format "host:port"
 * @throws Error if server is not listening or address cannot be determined
 */
export function getProxyUri(fastify: FastifyInstance): string {
  const address: AddressInfo | null | string = fastify.server.address();

  if (address === null || typeof address === 'string') {
    throw new Error('Unable to determine server address');
  }

  fastify.log.info(address);

  return `127.0.0.1:${String(address.port)}`;
}
