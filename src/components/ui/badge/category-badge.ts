import { Category } from '../../../types/product';
import { createIcon, type IconName } from '../icon/icon';
import { createBadge } from './badge';

// every category must have an icon: Record makes TypeScript check it
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

export function createCategoryBadge(category: Category): HTMLSpanElement {
  const badge: HTMLSpanElement = createBadge(
    category,
    'category',
    createIcon(CATEGORY_ICONS[category]),
  );
  badge.dataset.category = category; // picks the colors in badge.css

  return badge;
}
