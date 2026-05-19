import { getProxyUri } from '../../src/utils/get-proxy-uri';
import type { FastifyInstance } from 'fastify';

describe('getProxyUri', () => {
  it('should return host and port when address returns AddressInfo', () => {
    const fastifyMock: FastifyInstance = {
      server: {
        address: () => ({ address: '127.0.0.1', port: 3000, family: 'IPv4' }),
      },
    } as unknown as FastifyInstance;

    const uri: string = getProxyUri(fastifyMock);
    expect(uri).toBe('127.0.0.1:3000');
  });

  it('should throw an error when address returns null', () => {
    const fastifyMock: FastifyInstance = {
      server: {
        address: () => null,
      },
    } as unknown as FastifyInstance;

    expect(() => getProxyUri(fastifyMock)).toThrow(
      'Unable to determine server address',
    );
  });

  it('should throw an error when address returns a string', () => {
    const fastifyMock: FastifyInstance = {
      server: {
        address: () => '/path/to/socket',
      },
    } as unknown as FastifyInstance;

    expect(() => getProxyUri(fastifyMock)).toThrow(
      'Unable to determine server address',
    );
  });
});
