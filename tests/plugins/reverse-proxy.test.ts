import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import reverseProxy from '../../src/plugins/reverse-proxy';
import { StatusCodes } from '../../src/utils/http';

jest.mock('../../src/config', () => ({
  config: {
    tld: '.test',
    routes: {
      myapp: 'http://127.0.0.1:3001',
    },
  },
}));

describe('Reverse Proxy Plugin', () => {
  let fastify: FastifyInstance;
  let upstream: FastifyInstance;

  beforeAll(async () => {
    upstream = Fastify();
    upstream.get('/', () => ({
      message: 'hello from upstream',
    }));
    await upstream.listen({ port: 3001, host: '127.0.0.1' });

    fastify = Fastify();
    fastify.register(reverseProxy);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
    await upstream.close();
  });

  it('should proxy requests when host matches', async () => {
    // eslint-disable-next-line @typescript-eslint/typedef
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        host: 'myapp.test',
      },
    });

    expect(response.statusCode).toBe(StatusCodes.Ok);
    expect(response.json()).toEqual({ message: 'hello from upstream' });
  });

  it('should return 404 when host does not match any route', async () => {
    // eslint-disable-next-line @typescript-eslint/typedef
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        host: 'unknown.test',
      },
    });

    expect(response.statusCode).toBe(StatusCodes.NotFound);
  });
});
