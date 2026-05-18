import hostile from 'hostile';

/**
 * Sets hosts for all routes.
 *
 * @param routes - The routes to set hosts for.
 * @param tld - The top-level domain to append to each route key.
 */
export function setHosts(routes: Record<string, string>, tld: string): void {
  for (const domain of Object.keys(routes)) {
    hostile.set('127.0.0.1', `${domain}${tld}`);
  }
}

/**
 * Removes hosts for all routes.
 *
 * @param routes - The routes to remove hosts for.
 * @param tld - The top-level domain to append to each route key.
 */
export function removeHosts(routes: Record<string, string>, tld: string): void {
  for (const domain of Object.keys(routes)) {
    hostile.remove('127.0.0.1', `${domain}${tld}`);
  }
}
