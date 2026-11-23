import type { Product } from '../../types/product';
import type { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { createProductCard } from '../product-card/product-card';
import './product-grid.css';

export function createProductGrid(products: readonly Product[], route: Route): HTMLElement {
  return createElement('ul', {
    className: 'product-grid',
    children: products.map((product: Product): HTMLElement =>
      createElement('li', {
        children: [createProductCard(product, { route, headingLevel: 3 })],
      }),
    ),
  });
}
