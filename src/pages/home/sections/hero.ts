import { createElement } from '../../../utils/dom';

export function createHeroSection(): HTMLElement {
  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'hero-title' },
    children: [
      createElement('h1', {
        text: 'Take a little break. Play something fun.',
        attributes: { id: 'hero-title' },
      }),
      // TODO: description, createButton "Browse Library" -> Route.Catalog, background image
    ],
  });
}
