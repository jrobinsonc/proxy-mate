import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyPluginOptions,
  FastifyPluginDoneFn,
} from 'fastify';
import { config } from '../config';
import { getProxyUri } from '../utils/get-proxy-uri';
import { StatusCodes } from '../utils/http';

/**
 * Registers the Proxy Auto-Configuration (PAC) file route.
 *
 * @param fastify - The Fastify instance.
 * @param opts - The Fastify plugin options.
 * @param done - The Fastify plugin done function.
 */
export default function pacRoute(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: FastifyPluginDoneFn,
): void {
  let cachedProxyUri: string | null = null;
  let cachedPacFile: string | null = null;

  fastify.get('/proxy.pac', (request: FastifyRequest, reply: FastifyReply) => {
    cachedProxyUri ??= getProxyUri(fastify);

    // This route should only be available for the proxy URI.
    if (request.host !== cachedProxyUri) {
      reply.code(StatusCodes.NotFound).send();
      return;
    }

    if (cachedPacFile === null) {
      const uri: string = cachedProxyUri;
      const proxyRules: string = Object.keys(config.routes)
        .map(
          (domain: string) =>
            `\tif (dnsDomainIs(host, "${domain}${config.tld}")) return "PROXY ${uri}";`,
        )
        .join('\n');

      cachedPacFile = `function FindProxyForURL(url, host) {\n${proxyRules}\n\treturn "DIRECT";\n}`;
    }

    reply.header(
      'Content-Type',
      'application/x-ns-proxy-autoconfig; charset=utf-8',
    );

    reply.send(cachedPacFile);
  });

  done();
}
