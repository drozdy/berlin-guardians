import { createProductCard } from '../../components/product-card/product-card';
import { createButton } from '../../components/ui/button/button';
import { Category, type Product } from '../../types/product';
import { Route, type PageView } from '../../types/routes';
import { createElement } from './../../utils/dom';

const IMAGE = {
  alt: 'A cute brown-and-white cow standing in a fenced grassy field',
  width: 460,
  height: 215,
  sources: [
    {
      type: 'image/webp',
      srcset:
        '/assets/images/games/moosweep-card.webp 1x, /assets/images/games/moosweep-card@2x.webp 2x',
    },
  ],
  fallback: '/assets/images/games/moosweep-card.jpg',
};

const PREVIEW: readonly Product[] = [
  {
    slug: 'moosweep',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 0,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'moosweep',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 0,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'moosweep',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 0,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'forest-guardians',
    name: 'Forest Guardians',
    category: Category.Strategy,
    priceCents: 299,
    status: 'coming-soon',
    isFeatured: false,
    shortDescription: '',
    cardImage: IMAGE,
  },
];

export function renderHomePage(options?: { title?: string }): PageView {
  return {
    elements: [
      createElement('h1', {
        text: options?.title || 'Home Page',
      }),

      createElement('div', {
        attributes: {
          style: 'display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:24px',
        },
        children: PREVIEW.map((product: Product): HTMLElement =>
          createProductCard(product, { route: Route.Home, headingLevel: 3 }),
        ),
      }),
      createButton({ text: 'Play now', size: 'large' }),
      createButton({ text: 'Play now', size: 'medium' }),
      createButton({ text: 'Play now', size: 'small' }),
    ],
  };
}
