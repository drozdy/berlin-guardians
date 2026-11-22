import type { PageView } from '../../types/routes';
import { createElement } from '../../utils/dom';

export function renderCartPage(): PageView {
  return { elements: [createElement('h1', { text: 'Cart' })] };
}
