import type { ProductDetails } from '../../types/product';
import { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { formatPrice } from '../../utils/format';
import { getRouteHref } from '../../utils/url';
import { createBadge } from '../ui/badge/badge';
import { createButton } from '../ui/button/button';
import { createPicture } from '../ui/picture/picture';
import './product-details.css';

export type ProductDialogState = 'default' | 'in-cart' | 'coming-soon';

export function getDialogState(product: ProductDetails, isInCart: boolean): ProductDialogState {
  if (product.status === 'coming-soon') {
    return 'coming-soon';
  }

  return isInCart ? 'in-cart' : 'default';
}

function createAction(state: ProductDialogState): HTMLElement {
  switch (state) {
    case 'default':
      return createButton({ text: 'Add session to cart', size: 'large' });
    case 'in-cart':
      return createButton({
        text: 'Go to cart →',
        variant: 'outline',
        size: 'large',
        href: getRouteHref(Route.Cart),
      });
    case 'coming-soon':
      return createButton({
        text: 'Coming soon',
        variant: 'outline',
        size: 'large',
        disabled: true,
      });
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}

export function createProductDetails(
  product: ProductDetails,
  state: ProductDialogState,
): HTMLElement {
  const category: HTMLSpanElement = createBadge(product.category);
  category.classList.add('product-details__category');

  const badges: HTMLElement[] = [category];

  if (state === 'in-cart') {
    badges.push(createBadge('Added to cart'));
  }

  return createElement('article', {
    className: 'product-details',
    children: [
      createPicture(product.cardImage, {
        className: 'product-details__picture',
        imageClassName: 'product-details__image',
        loading: 'eager',
      }),

      createElement('div', {
        className: 'product-details__body',
        children: [
          createElement('div', {
            className: 'product-details__badges',
            children: badges,
          }),

          createElement('p', {
            className: 'product-details__title',
            text: product.name,
            attributes: { 'aria-hidden': 'true' },
          }),

          createElement('p', {
            className: 'product-details__meta',
            text: `${product.specs.players} · ${product.specs.duration}`,
          }),

          createElement('p', {
            className: 'product-details__description',
            text: product.fullDescription,
          }),

          createElement('p', {
            className: 'product-details__price',
            text: formatPrice(product.priceCents),
          }),

          createAction(state),
        ],
      }),
    ],
  });
}
