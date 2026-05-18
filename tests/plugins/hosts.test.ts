import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import hostsPlugin from '../../src/plugins/hosts';
import * as hostsUtils from '../../src/utils/hosts';

jest.mock('../../src/config', () => ({
  config: {
    tld: '.test',
    routes: {
      app1: 'http://localhost:3000',
    },
  },
}));

jest.mock('../../src/utils/hosts');

describe('Hosts Plugin', () => {
  let fastify: FastifyInstance;

  beforeEach(() => {
    fastify = Fastify();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await fastify.close();
  });

  it('should call setHosts on registration', async () => {
    fastify.register(hostsPlugin);
    await fastify.ready();

    expect(hostsUtils.setHosts).toHaveBeenCalledWith(
      { app1: 'http://localhost:3000' },
      '.test',
    );
  });

  it('should call removeHosts on close', async () => {
    fastify.register(hostsPlugin);
    await fastify.ready();
    await fastify.close();

    expect(hostsUtils.removeHosts).toHaveBeenCalledWith(
      { app1: 'http://localhost:3000' },
      '.test',
    );
  });

  it('should log an error if setHosts fails', async () => {
    const error: Error = new Error('Permission denied');
    (hostsUtils.setHosts as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const spy: jest.SpyInstance = jest.spyOn(fastify.log, 'error');

    fastify.register(hostsPlugin);
    await fastify.ready();

    expect(spy).toHaveBeenCalledWith(
      error,
      'Failed to set hosts entries. Do you have root privileges?',
    );
  });

  it('should log an error if removeHosts fails', async () => {
    const error: Error = new Error('Permission denied');
    (hostsUtils.removeHosts as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const spy: jest.SpyInstance = jest.spyOn(fastify.log, 'error');

    fastify.register(hostsPlugin);
    await fastify.ready();
    await fastify.close();

    expect(spy).toHaveBeenCalledWith(
      error,
      'Failed to remove hosts entries. Do you have root privileges?',
    );
  });
});
