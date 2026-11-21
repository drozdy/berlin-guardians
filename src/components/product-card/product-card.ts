import type { Product } from '../../types/product';
import type { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { formatPrice } from '../../utils/format';
import { getProductHref } from '../../utils/url';
import { createBadge } from '../ui/badge/badge';
import { createPicture } from '../ui/picture/picture';
import './product-card.css';

function createMedia(product: Product, isAvailable: boolean): HTMLElement {
  const children: HTMLElement[] = [createPicture(product.cardImage, 'product-card__picture')];

  if (!isAvailable) {
    const badge: HTMLElement = createBadge('Coming soon');
    badge.classList.add('product-card__badge');
    children.push(badge);
  }

  return createElement('div', {
    className: 'product-card__media',
    children,
  });
}

function createTitle(product: Product, isAvailable: boolean, route: Route): HTMLElement {
  const content: HTMLElement | string = isAvailable
    ? createElement('a', {
        className: 'product-card__link',
        text: product.name,
        attributes: { href: getProductHref(product.slug, route) },
      })
    : product.name;

  return createElement('h3', {
    className: 'product-card__title',
    children: [content],
  });
}

function createMeta(product: Product): HTMLElement {
  return createElement('p', {
    className: 'product-card__meta',
    children: [
      createElement('span', { className: 'product-card__category', text: product.category }),
      createElement('span', {
        className: 'product-card__price',
        text: formatPrice(product.priceCents),
      }),
    ],
  });
}

export function createProductCard(product: Product, route: Route): HTMLElement {
  const isAvailable: boolean = product.status === 'available';

  return createElement('article', {
    className: isAvailable ? 'product-card' : 'product-card--coming-soon',
    children: [
      createMedia(product, isAvailable),
      createElement('div', {
        className: 'product-card__body',
        children: [createTitle(product, isAvailable, route), createMeta(product)],
      }),
    ],
  });
}
