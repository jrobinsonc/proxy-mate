import type {
  FastifyInstance,
  LightMyRequestResponse,
  InjectOptions,
} from 'fastify';
import app from '../../src/app';
import { StatusCodes } from '../../src/utils/http';
import type { AddressInfo } from 'node:net';
import { config, type Config } from '../../src/config';
import pkg from '../../package.json';

jest.mock('../../src/config');

const addressInfo: AddressInfo = {
  address: '127.0.0.1',
  port: 3000,
  family: 'IPv4',
};

const defRequestArgs: InjectOptions = {
  method: 'GET',
  url: '/proxy.pac',
  headers: {
    host: `${addressInfo.address}:${String(addressInfo.port)}`,
  },
};

/**
 * Builds a Fastify instance for testing.
 *
 * @returns The Fastify instance
 */
function buildFastifyInstance(): FastifyInstance {
  const fastify: FastifyInstance = app();

  fastify.server.address = (): AddressInfo => addressInfo;

  beforeAll(() => fastify.ready());
  afterAll(() => fastify.close());

  return fastify;
}

describe('PAC Route', () => {
  const fastify: FastifyInstance = buildFastifyInstance();

  it('returns ProxyMate header', async () => {
    const res: LightMyRequestResponse = await fastify.inject({
      ...defRequestArgs,
    });

    expect(res.headers['x-proxymate']).toEqual(pkg.version);
  });

  it('returns valid PAC file', async () => {
    const mockedConfig: jest.MockedObjectDeep<Config> = jest.mocked(config);

    mockedConfig.tld = '.tld';
    mockedConfig.routes = {
      'auth.test-app': 'http://localhost:3001',
      'api.test-app': 'http://localhost:3002',
      'docs.test-app': 'http://localhost:3003',
    };

    const res: LightMyRequestResponse = await fastify.inject({
      ...defRequestArgs,
    });

    expect(res.statusCode).toEqual(StatusCodes.Ok);
    expect(res.headers['content-type']).toEqual(
      'application/x-ns-proxy-autoconfig; charset=utf-8',
    );
    expect(res.body).toContain('function FindProxyForURL(url, host) {');
    expect(res.body).toContain('return "DIRECT";');

    // Check each route is properly included in the PAC file
    for (const route in mockedConfig.routes) {
      expect(res.body).toContain(
        `if (dnsDomainIs(host, "${route}${mockedConfig.tld}")) return "PROXY ${addressInfo.address}:${String(addressInfo.port)}"`,
      );
    }
  });

  it('returns 404 status code when host does not match proxy URI', async () => {
    const res: LightMyRequestResponse = await fastify.inject({
      ...defRequestArgs,
      headers: {
        ...defRequestArgs.headers,
        host: '127.0.0.1:9999',
      },
    });

    expect(res.statusCode).toEqual(StatusCodes.NotFound);
    expect(res.body).toEqual('');
  });
});
