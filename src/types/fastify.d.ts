import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * Indicates if the request is for the Proxy Auto-Configuration (PAC) file.
     */
    isProxyPacRequest?: boolean;
  }
}
