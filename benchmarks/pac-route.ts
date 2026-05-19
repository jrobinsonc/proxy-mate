import { performance } from 'node:perf_hooks';
import Fastify from 'fastify';
import pacRoute from '../src/routes/pac-route.js';
import { config } from '../src/config.js';

// Mock config for benchmark
config.tld = '.local';
config.routes = {};
for (let i = 0; i < 1000; i++) {
  config.routes[`app${i}`] = `http://localhost:${3000 + i}`;
}

async function run() {
  const fastify = Fastify();

  // mock address for getProxyUri
  fastify.server.address = () => ({ address: '127.0.0.1', port: 3000 });

  await fastify.register(pacRoute);

  await fastify.ready();

  const iterations = 10000;

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    await fastify.inject({
      method: 'GET',
      url: '/proxy.pac',
      headers: {
        host: '127.0.0.1:3000'
      }
    });
  }
  const end = performance.now();

  console.log(`Time for ${iterations} requests: ${end - start} ms`);
}

run();
