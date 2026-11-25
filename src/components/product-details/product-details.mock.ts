import { Category, type ProductDetails } from '../../types/product';

// TODO: remove when the data loading is ready
export const MOCK_PRODUCT: ProductDetails = {
  slug: 'beehive-valley',
  name: 'Beehive Valley',
  category: Category.Farm,
  priceCents: 299,
  status: 'available',
  isFeatured: false,
  shortDescription: 'A cozy farm game about beekeeping.',
  cardImage: {
    alt: 'A cheerful bee flying over a sunny valley with wooden beehives and flower beds',
    width: 460,
    height: 215,
    sources: [],
    fallback: '/assets/images/games/beehive-valley-card.jpg',
  },
  fullDescription:
    'Beehive Valley — a cozy farm game about beekeeping. You inherit a messy valley and a few tired hives. Plant flowers, move the hives around and keep the bees happy through every season.',
  specs: { players: 'Solo', duration: '60–80 min' },
};
