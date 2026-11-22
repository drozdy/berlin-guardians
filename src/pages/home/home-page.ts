import { Category, type Product } from '../../types/product';
import { type PageView } from '../../types/routes';
import { createAboutSection } from './sections/about';
import { createDeveloperCtaSection } from './sections/developer-cta';
import { createFeaturedProductsSection } from './sections/featured-products';
import { createGenresSection } from './sections/genres';
import { createHeroSection } from './sections/hero';

// TODO: remove - temporary demo
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
    slug: 'moosweep-1',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 0,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'moosweep-2',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 0,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'moosweep-3',
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
// TODO: remove (end) - temporary demo

export function renderHomePage(): PageView {
  return {
    elements: [
      createHeroSection(),
      createFeaturedProductsSection(PREVIEW),
      createGenresSection(),
      createAboutSection(),
      createDeveloperCtaSection(),
    ],
  };
}
