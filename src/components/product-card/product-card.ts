import type { Product } from '../../types/product';
import type { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { formatPrice } from '../../utils/format';
import { getProductHref } from '../../utils/url';
import { createBadge } from '../ui/badge/badge';
import { createPicture } from '../ui/picture/picture';
import './product-card.css';

export type HeadingLevel = 2 | 3 | 4;

export interface ProductCardOptions {
  readonly route: Route;

  // section decides the level, and headings do not skip a level
  readonly headingLevel: HeadingLevel;
  readonly imageLoading?: 'lazy' | 'eager';
}

const HEADING_TAGS: Readonly<Record<HeadingLevel, 'h2' | 'h3' | 'h4'>> = {
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

// unique id, product is shown once per page
function getTitleId(product: Product): string {
  return `product-${product.slug}-title`;
}

function getMetaId(product: Product): string {
  return `product-${product.slug}-meta`;
}

// price is in the meta text, badge is only for eyes
function createPriceBadge(product: Product): HTMLElement {
  const isFree: boolean = product.priceCents === 0;
  const badge: HTMLElement = createBadge(
    formatPrice(product.priceCents),
    isFree ? 'price-free' : 'price-paid',
  );
  badge.classList.add('product-card__badge');
  badge.setAttribute('aria-hidden', 'true');

  return badge;
}

function createMedia(
  product: Product,
  isAvailable: boolean,
  options: ProductCardOptions,
): HTMLElement {
  return createElement('div', {
    className: 'product-card__media',
    children: [
      createPicture(product.cardImage, {
        className: 'product-card__picture',
        imageClassName: 'product-card__image',
        loading: options.imageLoading,
      }),
      ...(isAvailable ? [createPriceBadge(product)] : []),
    ],
  });
}

function createTitle(
  product: Product,
  isAvailable: boolean,
  options: ProductCardOptions,
): HTMLElement {
  const content: HTMLElement | string = isAvailable
    ? createElement('a', {
        className: 'product-card__link',
        text: product.name,
        attributes: {
          href: getProductHref(product.slug, options.route),
          'aria-describedby': getMetaId(product),
        },
      })
    : product.name;

  return createElement(HEADING_TAGS[options.headingLevel], {
    className: 'product-card__title',
    attributes: { id: getTitleId(product) },
    children: [content],
  });
}

function createMeta(product: Product): HTMLElement {
  return createElement('p', {
    className: 'product-card__meta',
    attributes: { id: getMetaId(product) },
    children: [
      createElement('span', { className: 'product-card__category', text: product.category }),
      createElement('span', {
        className: 'product-card__separator',
        text: '·',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('span', {
        className: 'product-card__price',
        text: formatPrice(product.priceCents),
      }),
    ],
  });
}

// decorative hint - the card is clickable
function createArrow(): HTMLElement {
  return createElement('span', {
    className: 'product-card__arrow',
    text: '→',
    attributes: { 'aria-hidden': 'true' },
  });
}

function createStatusBadge(): HTMLElement {
  const badge: HTMLElement = createBadge('Coming soon');
  badge.classList.add('product-card__badge');

  return badge;
}

function createFooter(product: Product, isAvailable: boolean): HTMLElement {
  return createElement('div', {
    className: 'product-card__footer',
    children: [createMeta(product), ...(isAvailable ? [createArrow()] : [])],
  });
}

export function createProductCard(product: Product, options: ProductCardOptions): HTMLElement {
  const isAvailable: boolean = product.status === 'available';
  const title: HTMLElement = createTitle(product, isAvailable, options);

  // reading order: title, status, genre, price; CSS puts the badge over the image
  const status: HTMLElement[] = isAvailable ? [] : [createStatusBadge()];

  return createElement('article', {
    className: isAvailable ? 'product-card' : 'product-card product-card--coming-soon',
    attributes: { 'aria-labelledby': getTitleId(product) },
    children: [
      createMedia(product, isAvailable, options),
      createElement('div', {
        className: 'product-card__body',
        children: [title, ...status, createFooter(product, isAvailable)],
      }),
    ],
  });
}
