import type { FastifyInstance, LightMyRequestResponse } from 'fastify';
import pkg from '../../package.json';
import { buildFastifyInstance } from '../__helpers__/fastify';
import addAppHeaders from '../../src/plugins/add-app-headers';

describe('Add App Headers Plugin', () => {
  const fastify: FastifyInstance = buildFastifyInstance([addAppHeaders]);

  it('returns ProxyMate header', async () => {
    const res: LightMyRequestResponse = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(res.headers['x-proxymate']).toEqual(pkg.version);
  });
});
