/* eslint-disable unicorn/no-process-exit */
import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import Fastify from 'fastify';
import { env, NodeEnv } from './config';
import app from './app';

const opts: FastifyServerOptions = {
  logger: {
    level: env.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        colorize: true,
      },
    },
  },
  trustProxy: true,
};
const fastify: FastifyInstance = Fastify(opts);

fastify.register(app);

async function start(): Promise<void> {
  try {
    await fastify.listen({ port: env.PORT, host: '127.0.0.1' });
  } catch (error) {
    fastify.log.error('Error starting server:', error);
    process.exit(1);
  }
}

async function stop(): Promise<void> {
  try {
    fastify.log.info('Stopping fastify server');
    await fastify.close();
    fastify.log.info('Fastify server stopped');
  } catch (error) {
    fastify.log.error('Error during server shutdown:', error);
  } finally {
    process.exit(0);
  }
}

if (env.NODE_ENV !== NodeEnv.Test) {
  process.on('SIGINT', () => void stop());
  process.on('SIGTERM', () => void stop());
  await start();
}
