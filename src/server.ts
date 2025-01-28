import Fastify from 'fastify';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import { env } from './config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import autoload from '@fastify/autoload';

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const serverOptions: FastifyServerOptions = {
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
const server: FastifyInstance = Fastify(serverOptions);

server.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
});

server.register(autoload, {
  dir: path.join(__dirname, 'routes'),
});

server.listen({ port: env.PORT, host: '127.0.0.1' }, (error: Error | null) => {
  if (error) {
    server.log.error('Error starting server:', error);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers, unicorn/no-process-exit
    process.exit(1);
  }
});

async function stop(): Promise<void> {
  try {
    server.log.info('Stopping fastify server');
    await server.close();
    server.log.info('Fastify server stopped');
  } catch (error) {
    server.log.error('Error during server shutdown:', error);
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers, unicorn/no-process-exit
    process.exit(0);
  }
}

process.on('SIGINT', () => void stop());
process.on('SIGTERM', () => void stop());
