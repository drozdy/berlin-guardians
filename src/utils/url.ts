import { DialogParameter, type Route } from '../types/routes';

export const BASE_PATH: string = import.meta.env.BASE_URL;

export function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function trimTrailingSlashes(path: string): string {
  return path.replace(/\/+$/, '');
}

export function toAppPath(pathname: string, base: string): string | undefined {
  const root: string = trimTrailingSlashes(base);
  if (pathname !== root && !pathname.startsWith(`${root}/`)) {
    return undefined;
  }
  const path: string = trimTrailingSlashes(pathname.slice(root.length));

  return path === '' ? '/' : path;
}

// supports deployment under a sub-path, e.g. user.github.io/berlin-guardians/catalog
export function toBrowserUrl(path: string, query: URLSearchParams, base: string): string {
  const search: string = query.toString();

  return `${trimTrailingSlashes(base)}${path}${search === '' ? '' : `?${search}`}`;
}

// The real address of a page, so a link to it also works in a new tab
export function getRouteHref(route: Route): string {
  return toBrowserUrl(route, new URLSearchParams(), BASE_PATH);
}

// A link that opens the product dialog on top of the given page
export function getProductHref(slug: string, route: Route): string {
  const query: URLSearchParams = new URLSearchParams({ [DialogParameter.Product]: slug });

  return toBrowserUrl(route, query, BASE_PATH);
}
