import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import { config } from '../config';
import { getProxyUri } from '../utils/get-proxy-uri';
import { StatusCodes } from '../utils/http';

const PAC_FILE_PATH: string = '/proxy.pac';

/**
 * Registers the Proxy Auto-Configuration (PAC) file route.
 *
 * @param fastify - The Fastify instance.
 */
export function registerPacRoute(fastify: FastifyInstance): void {
  fastify.addHook(
    'onRequest',
    (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => {
      const proxyUri: string = getProxyUri(fastify);

      if (request.url !== PAC_FILE_PATH || request.host !== proxyUri) {
        reply.code(StatusCodes.NotFound).send();
        done();
        return;
      }

      request.isProxyPacRequest = true;

      reply.header(
        'Content-Type',
        'application/x-ns-proxy-autoconfig; charset=utf-8',
      );

      const proxyRules: string = Object.keys(config.routes)
        .map(
          (domain: string) =>
            `\tif (dnsDomainIs(host, "${domain}${config.tld}")) return "PROXY ${proxyUri}";`,
        )
        .join('\n');

      reply.send(
        `function FindProxyForURL(url, host) {\n${proxyRules}\n\treturn "DIRECT";\n}`,
      );

      done();
    },
  );

  fastify.get(PAC_FILE_PATH, () => {
    // The empty route handler is necessary because Fastify needs to know this is
    // a valid route, but the actual handling is done in the onRequest hook.
  });
}
