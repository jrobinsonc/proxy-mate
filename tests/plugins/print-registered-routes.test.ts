import type { FastifyInstance } from 'fastify';
import type { Config, Env } from '../../src/config';
import { config, env } from '../../src/config';
import printRegisteredRoutes from '../../src/plugins/print-registered-routes';
import { buildFastifyInstance } from '../__helpers__/fastify';

jest.mock('../../src/config', () => ({
  config: {
    tld: undefined,
  },
  env: {
    PORT: undefined,
  },
}));

describe('Print Registered Routes Plugin', () => {
  const fastify: FastifyInstance = buildFastifyInstance([
    printRegisteredRoutes,
  ]);

  it('logs routes on server start', async () => {
    const mockedLogInfo: jest.SpyInstance<
      void,
      [msg: string, ...args: unknown[]],
      unknown
    > = jest.spyOn(fastify.log, 'info');
    const mockedConfig: jest.MockedObjectDeep<Config> = jest.mocked(config);
    const mockedEnv: jest.MockedObjectDeep<Env> = jest.mocked(env);

    mockedConfig.tld = '.test';
    mockedConfig.routes = {
      'auth.app': 'http://localhost:3001',
      'api.app': 'http://localhost:3002',
    };
    mockedEnv.PORT = 3000;

    await fastify.listen({
      port: mockedEnv.PORT,
    });

    const routesHostnames: string[] = Object.keys(mockedConfig.routes);

    // Verify the logs
    expect(mockedLogInfo).toHaveBeenCalledWith(
      `Proxy listening on port ${String(mockedEnv.PORT)} for domains:`,
    );
    expect(mockedLogInfo).toHaveBeenCalledWith(
      `- ${String(routesHostnames[0])}${String(mockedConfig.tld)}`,
    );
    expect(mockedLogInfo).toHaveBeenCalledWith(
      `- ${String(routesHostnames[1])}${String(mockedConfig.tld)}`,
    );
  });
});
