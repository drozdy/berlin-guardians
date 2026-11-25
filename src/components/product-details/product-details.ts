import { Category, type ProductDetails } from '../../types/product';
import { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { formatCoins } from '../../utils/format';
import { getRouteHref } from '../../utils/url';
import { createBadge } from '../ui/badge/badge';
import { createButton } from '../ui/button/button';
import { createIcon, type IconName } from '../ui/icon/icon';
import { createPicture } from '../ui/picture/picture';
import './product-details.css';

export type ProductDialogState = 'default' | 'in-cart' | 'coming-soon';

const CATEGORY_ICONS: Readonly<Record<Category, IconName>> = {
  [Category.Puzzle]: 'puzzle',
  [Category.Arcade]: 'gamepad',
  [Category.Strategy]: 'flag',
  [Category.Farm]: 'leaf',
  [Category.Adventure]: 'compass',
  [Category.Simulation]: 'sliders',
  [Category.Music]: 'music',
  [Category.Casual]: 'coffee',
};

export function getDialogState(product: ProductDetails, isInCart: boolean): ProductDialogState {
  if (product.status === 'coming-soon') {
    return 'coming-soon';
  }

  return isInCart ? 'in-cart' : 'default';
}

function createAction(state: ProductDialogState): HTMLElement {
  switch (state) {
    case 'default':
      return createButton({
        text: 'Add session to cart',
        size: 'large',
        icon: createIcon('cart'),
      });
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

function createMetaBadge(icon: IconName, text: string): HTMLSpanElement {
  return createBadge(text, 'meta', createIcon(icon));
}

function createCategoryBadge(product: ProductDetails): HTMLSpanElement {
  const category: HTMLSpanElement = createBadge(
    product.category,
    'category',
    createIcon(CATEGORY_ICONS[product.category]),
  );
  category.classList.add('product-details__category');
  category.dataset.category = product.category; // picks the colors in badge.css

  return category;
}

// only in the 'in-cart' state
function createStatusRow(state: ProductDialogState): HTMLElement[] {
  if (state !== 'in-cart') {
    return [];
  }

  return [
    createElement('div', {
      className: 'product-details__badges',
      children: [createBadge('Added to cart', 'status', createIcon('check'))],
    }),
  ];
}

function createPrice(priceCents: number): HTMLElement {
  if (priceCents === 0) {
    return createElement('p', { className: 'product-details__price', text: 'Free' });
  }

  return createElement('p', {
    className: 'product-details__price',
    children: [
      createIcon('coin'),
      formatCoins(priceCents),
      // the icon is decorative, so the unit is read from the hidden text
      createElement('span', { className: 'visually-hidden', text: ' coins' }),
    ],
  });
}

export function createProductDetails(
  product: ProductDetails,
  state: ProductDialogState,
): HTMLElement {
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
          ...createStatusRow(state),

          // the dialog already has a hidden <h2> with the name for screen readers
          createElement('p', {
            className: 'product-details__title',
            text: product.name,
            attributes: { 'aria-hidden': 'true' },
          }),

          createElement('p', {
            className: 'product-details__meta',
            children: [
              createCategoryBadge(product),
              createMetaBadge('user', product.specs.players),
              createMetaBadge('clock', product.specs.duration),
            ],
          }),

          createElement('p', {
            className: 'product-details__description',
            text: product.fullDescription,
          }),

          createPrice(product.priceCents),

          createAction(state),
        ],
      }),
    ],
  });
}
