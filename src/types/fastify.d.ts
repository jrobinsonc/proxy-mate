import 'fastify';

declare module 'fastify' {
  type FastifyPluginDoneFn = (err?: Error) => void;
}
