import type { AppLocation, PageView } from '../../types/routes';
import { createElement } from './../../utils/dom';
import type { Product } from '../../types/product';
import {
  queryCatalogProducts,
  toProductRecordMapper,
  type CatalogQueryOptions,
} from '../../api/products-adapter';
import type { RunQueryDocument } from '../../api/firestore-rest';

export interface CatalogPageOptions {
  readonly onProductOpen?: (product: Product) => void;
  readonly onNavigate: (query: URLSearchParams, isReplace: boolean) => void;
}

export function renderCatalogPage(
  title: string,
  _location: AppLocation,
  _options?: CatalogPageOptions,
): PageView {
  const statusText: HTMLParagraphElement = createElement('p', {
    className: 'profile-page__status',
    text: 'Checking products published...',
  });

  // let address: URLSearchParams = location.query;
  void (async (): Promise<void> => {
    try {
      //todo map _options to CatalogQueryOptions
      const options: CatalogQueryOptions = {};
      const products = await queryCatalogProducts(options);
      if (!products) {
        statusText.textContent = 'Products was not found in Firestore.';
        return;
      }

      const productTiles = products.map((product) =>
        toProductRecordMapper(product as RunQueryDocument),
      );
      // todo apply productTiles to cards and render grid
      console.log(productTiles);
    } catch (error: unknown) {
      console.error(error);
      //
    }
  })();

  return {
    elements: [
      createElement('section', {
        className: 'section container',
        children: [createElement('h1', { text: title || 'Catalog' }), statusText],
      }),
    ],
  };
}
