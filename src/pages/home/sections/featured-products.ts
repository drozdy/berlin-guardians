import { createProductGrid } from '../../../components/product-grid/product-grid';
import { createSectionHeader } from '../../../components/ui/section-header/section-header';
import type { Product } from '../../../types/product';
import { Route } from '../../../types/routes';
import { createElement } from '../../../utils/dom';
import { getRouteHref } from '../../../utils/url';

export function createFeaturedProductsSection(products: readonly Product[]): HTMLElement {
  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'products-title' },
    children: [
      createSectionHeader({
        id: 'products-title',
        title: 'New Games',
        link: { text: 'View Catalog', href: getRouteHref(Route.Catalog) },
      }),
      createProductGrid(products, Route.Home),
    ],
  });
}
