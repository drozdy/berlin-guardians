// src/pages/catalog/catalog-page.ts
import type { AppLocation, PageView } from '../../types/routes';
import { createElement } from './../../utils/dom';
import type { productsRecord } from '../../types/products';
import { restGetCollection } from '../../api/firestore-rest';

export interface CatalogPageOptions {
  readonly onProductOpen?: (product: productsRecord) => void;
  readonly onNavigate: (query: URLSearchParams, isReplace: boolean) => void;
}

async function loadCatalogProducts(
  container: HTMLElement,
  _options?: CatalogPageOptions,
): Promise<void> {
  const statusEl = createElement('p', {
    className: 'catalog-status',
    text: 'Loading products...',
  });
  container.append(statusEl);

  try {
    const docs = await restGetCollection('products', 50);

    if (docs.length === 0) {
      statusEl.textContent = 'No products found.';
      return;
    }

    statusEl.textContent = `Loaded ${docs.length} product(s).`;

    // REST-fields parsergoes here Product from src/types/product
    // render produt tiles _options?.onProductOpen?.(product)
  } catch (error) {
    console.error('[CatalogPage] Failed to load products:', error);
    statusEl.textContent = 'Failed to load products.';
  }
}

export function renderCatalogPage(
  title: string,
  _location: AppLocation,
  options?: CatalogPageOptions,
): PageView {
  // let address: URLSearchParams = location.query;
  const section = createElement('section', {
    className: 'section container',
    children: [createElement('h1', { text: title || 'Catalog' })],
  });

  void loadCatalogProducts(section, options);

  return {
    elements: [section],
  };
}
