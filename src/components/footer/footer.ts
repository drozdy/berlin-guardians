import { Route } from '../../types/routes';
import { createElement } from '../../utils/dom';
import { getRouteHref } from '../../utils/url';
import { APP_NAME, createBrand } from '../brand/brand';
import { NAVIGATION_LINKS, type NavigationLink } from '../header/header';
import './footer.css';

const TAGLINE = 'Play. Discover. Enjoy.';

function createNavigation(): HTMLElement {
  const items: HTMLLIElement[] = NAVIGATION_LINKS.map((link: NavigationLink): HTMLLIElement =>
    createElement('li', {
      children: [
        createElement('a', {
          className: 'footer__nav-link',
          text: link.label,
          attributes: { href: getRouteHref(link.page ?? Route.Home) },
        }),
      ],
    }),
  );

  return createElement('nav', {
    attributes: { 'aria-label': 'Footer navigation' },
    children: [createElement('ul', { className: 'footer__nav-list', children: items })],
  });
}

function createBottomLine(): HTMLElement {
  return createElement('div', {
    className: 'footer__bottom container',
    children: [
      createElement('small', {
        text: `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`,
      }),
      createElement('small', {
        children: [
          'Made with ',
          createElement('span', {
            className: 'footer__heart',
            text: '♥',
            attributes: { 'aria-hidden': 'true' },
          }),
          createElement('span', { className: 'visually-hidden', text: 'love' }),
          ' for gamers',
        ],
      }),
    ],
  });
}

export function createFooter(): HTMLElement {
  return createElement('footer', {
    className: 'footer',
    children: [
      createElement('div', {
        className: 'footer__main container',
        children: [
          createElement('div', {
            className: 'footer__identity',
            children: [
              createBrand(),
              createElement('span', { className: 'footer__tagline', text: TAGLINE }),
            ],
          }),
          createNavigation(),
        ],
      }),
      createBottomLine(),
    ],
  });
}
