import { createSectionHeader } from '../../../components/ui/section-header/section-header';
import { createElement } from '../../../utils/dom';

export function createAboutSection(): HTMLElement {
  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'about-title' },
    children: [
      createSectionHeader({
        id: 'about-title',
        title: 'About Berlin Guardians',
      }),

      //TODO: text and team description
    ],
  });
}
