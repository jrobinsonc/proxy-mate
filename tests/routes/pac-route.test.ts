import type {
  FastifyInstance,
  InjectOptions,
  LightMyRequestResponse,
} from 'fastify';
import type { Config } from '../../src/config';
import { config } from '../../src/config';
import pacRoute from '../../src/routes/pac-route';
import { getProxyUri } from '../../src/utils/get-proxy-uri';
import { StatusCodes } from '../../src/utils/http';
import { buildFastifyInstance } from '../__helpers__/fastify';

jest.mock('../../src/config');
jest.mock('../../src/utils/get-proxy-uri');

const host: string = '127.0.0.1:3000';
/**
 * Default request arguments for the PAC route
 */
const defRequestArgs: InjectOptions = {
  method: 'GET',
  url: '/proxy.pac',
  headers: {
    host,
  },
};

describe('PAC Route', () => {
  const fastify: FastifyInstance = buildFastifyInstance([pacRoute]);

  it('returns valid PAC file', async () => {
    const mockedConfig: jest.MockedObjectDeep<Config> = jest.mocked(config);
    const mockedGetProxyUri: jest.MockedFunction<typeof getProxyUri> =
      jest.mocked(getProxyUri);

    mockedGetProxyUri.mockReturnValueOnce(host);

    mockedConfig.tld = '.tld';
    mockedConfig.routes = {
      'auth.test-app': 'http://localhost:3001',
      'api.test-app': 'http://localhost:3002',
      'docs.test-app': 'http://localhost:3003',
    };

    const res: LightMyRequestResponse = await fastify.inject(defRequestArgs);

    expect(res.statusCode).toEqual(StatusCodes.Ok);
    expect(res.headers['content-type']).toEqual(
      'application/x-ns-proxy-autoconfig; charset=utf-8',
    );
    expect(res.body).toContain('function FindProxyForURL(url, host) {');
    expect(res.body).toContain('return "DIRECT";');

    // Check each route is properly included in the PAC file
    for (const route in mockedConfig.routes) {
      expect(res.body).toContain(
        `if (dnsDomainIs(host, "${route}${mockedConfig.tld}")) return "PROXY ${host}"`,
      );
    }
  });

  it('returns 404 status code when host does not match the proxy URI', async () => {
    const res: LightMyRequestResponse = await fastify.inject({
      ...defRequestArgs,
      headers: {
        ...defRequestArgs.headers,
        host: '127.0.0.1:9999', // Invalid host
      },
    });

    expect(res.statusCode).toEqual(StatusCodes.NotFound);
    expect(res.body).toEqual('');
  });
});
