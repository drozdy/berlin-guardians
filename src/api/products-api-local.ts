import type { Product, ProductDetails, ProductExtra } from '../types/product';
import { withBase } from '../utils/url';

interface DataResponse<T> {
  readonly data: T;
}

async function fetchData<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response: Response = await fetch(withBase(path), { signal });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  const body: DataResponse<T> = (await response.json()) as DataResponse<T>;

  return body.data;
}

export function fetchAllProducts(signal?: AbortSignal): Promise<readonly Product[]> {
  return fetchData<readonly Product[]>('/data/games-all.json', signal);
}

export async function fetchProductDetails(
  slug: string,
  signal?: AbortSignal,
): Promise<ProductDetails> {
  const [products, extra] = await Promise.all([
    fetchAllProducts(signal),
    fetchData<ProductExtra>(`/data/games/${encodeURIComponent(slug)}.json`, signal),
  ]);

  const product: Product | undefined = products.find(
    (item: Product): boolean => item.slug === slug,
  );
  if (product === undefined) {
    throw new Error(`Game not found: ${slug}`);
  }

  // explicit fields: old data left in games/<slug>.json must not override the list
  return {
    ...product,
    fullDescription: extra.fullDescription,
    specs: extra.specs,
  };
}
