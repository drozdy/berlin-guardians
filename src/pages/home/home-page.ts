import { /* Category,*/ Category, type Product } from '../../types/product';
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
        '/assets/images/games/forest-guardians-card.webp 1x, /assets/images/games/forest-guardians-card@2x.webp 2x',
    },
  ],
  fallback: '/assets/images/games/forest-guardians-card.jpg',
};

const PREVIEW: readonly Product[] = [
  {
    slug: 'moosweep-1',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 119,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'moosweep-2',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 575,
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
    slug: 'forest-guardians1',
    name: 'Moosweep',
    category: Category.Strategy,
    priceCents: 299,
    status: 'available',
    isFeatured: false,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'moosweep-3',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 200,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'moosweep-4',
    name: 'Moosweep',
    category: Category.Arcade,
    priceCents: 460,
    status: 'available',
    isFeatured: true,
    shortDescription: '',
    cardImage: IMAGE,
  },
  {
    slug: 'forest-guardians2',
    name: 'Forest Guardians',
    category: Category.Strategy,
    priceCents: 299,
    status: 'coming-soon',
    isFeatured: false,
    shortDescription: 'A small tactical game about saving a forest from spreading fire.',
    cardImage: IMAGE,
  },
];
// TODO: remove (end) - temporary demo

// TODO: remove - temporary: show all games from the mock data
// interface GamesResponse {
//   readonly data: readonly Product[];
// }

// async function loadAllGames(): Promise<readonly Product[]> {
//   const response: Response = await fetch(`${import.meta.env.BASE_URL}data/games-all.json`);
//   const body: GamesResponse = (await response.json()) as GamesResponse;

//   return body.data;
// }
// TODO: remove (end) - temporary

export function renderHomePage(): PageView {
  // TODO: remove - temporary
  // const featured: HTMLElement = createFeaturedProductsSection([]);
  // loadAllGames()
  //   .then((products: readonly Product[]): void => {
  //     featured.replaceWith(createFeaturedProductsSection(products));
  //   })
  //   .catch((error: unknown): void => {
  //     console.error(error);
  //   });
  // TODO: remove (end) - temporary
  return {
    elements: [
      createHeroSection(),
      // featured,
      createFeaturedProductsSection(PREVIEW),
      createGenresSection(),
      createAboutSection(),
      createDeveloperCtaSection(),
    ],
  };
}
