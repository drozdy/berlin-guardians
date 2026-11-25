import { fetchAllProducts } from '../../api/products-api-local';
import { type Product } from '../../types/product';
import { type PageView } from '../../types/routes';
import { createAboutSection } from './sections/about';
import { createDeveloperCtaSection } from './sections/developer-cta';
import { createFeaturedProductsSection } from './sections/featured-products';
import { createGenresSection } from './sections/genres';
import { createHeroSection } from './sections/hero';

// TODO: remove - temporary: show all games from the mock data
function pickForHome(products: readonly Product[]): Product[] {
  const featured: Product[] = products.filter((product: Product): boolean => product.isFeatured);
  const isSoon = (product: Product): boolean => product.status === 'coming-soon';

  return [...featured.filter((p) => !isSoon(p)), ...featured.filter(isSoon)];
}
// TODO: remove (end) - temporary

export function renderHomePage(): PageView {
  // TODO: remove - temporary
  let isDestroyed = false;
  let featured: HTMLElement = createFeaturedProductsSection([]);
  fetchAllProducts()
    .then((products: readonly Product[]): void => {
      if (isDestroyed) {
        return;
      }
      const next: HTMLElement = createFeaturedProductsSection(pickForHome(products));
      featured.replaceWith(next);
      featured = next;
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
    destroy: (): void => {
      isDestroyed = true;
    },
  };
}
