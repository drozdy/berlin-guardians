import { type Product } from '../../types/product';
import { type PageView } from '../../types/routes';
import { withBase } from '../../utils/url';
import { createAboutSection } from './sections/about';
import { createDeveloperCtaSection } from './sections/developer-cta';
import { createFeaturedProductsSection } from './sections/featured-products';
import { createGenresSection } from './sections/genres';
import { createHeroSection } from './sections/hero';

// TODO: remove - temporary: show all games from the mock data
interface GamesResponse {
  readonly data: readonly Product[];
}

async function loadAllGames(): Promise<readonly Product[]> {
  const response: Response = await fetch(withBase('/data/games-all.json'));
  const body: GamesResponse = (await response.json()) as GamesResponse;

  return body.data;
}

function pickForHome(products: readonly Product[]): Product[] {
  const featured: Product[] = products.filter((product: Product): boolean => product.isFeatured);
  const isSoon = (product: Product): boolean => product.status === 'coming-soon';

  return [...featured.filter((p) => !isSoon(p)), ...featured.filter(isSoon)];
}
// TODO: remove (end) - temporary

export function renderHomePage(): PageView {
  // TODO: remove - temporary
  const featured: HTMLElement = createFeaturedProductsSection([]);
  loadAllGames()
    .then((products: readonly Product[]): void => {
      featured.replaceWith(createFeaturedProductsSection(pickForHome(products)));
    })
    .catch((error: unknown): void => {
      console.error(error);
    });
  // TODO: remove (end) - temporary

  return {
    elements: [
      createHeroSection(),

      // TODO: remove - temporary
      featured,
      // TODO: remove (end) - temporary

      createGenresSection(),
      createAboutSection(),
      createDeveloperCtaSection(),
    ],
  };
}
