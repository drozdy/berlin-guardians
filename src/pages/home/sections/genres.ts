import { createSectionHeader } from '../../../components/ui/section-header/section-header';
import { createElement } from '../../../utils/dom';

export function createGenresSection(): HTMLElement {
  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'genres-title' },
    children: [
      createSectionHeader({
        id: 'genres-title',
        title: 'Browse by Genre',
      }),

      //TODO: list with links
    ],
  });
}
