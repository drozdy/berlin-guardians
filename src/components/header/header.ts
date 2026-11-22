import { getRouteHref } from '../../utils/url';
import { createButton } from '../ui/button/button';
import { Route } from './../../types/routes';
import { createElement } from './../../utils/dom';
import './header.css';

const APP_NAME = 'Berlin Guardians';

export interface Header {
  readonly element: HTMLElement;
  readonly setCurrentPage: (page: Route | undefined) => void;
}

export interface NavigationLink {
  readonly label: string;
  readonly page?: Route;
}

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { label: 'Home', page: Route.Home },
  { label: 'Catalog', page: Route.Catalog },
];

interface PageLink {
  readonly element: HTMLAnchorElement;
  readonly page: Route;
}

export class PageLinks {
  private readonly links: PageLink[] = [];

  public add(element: HTMLAnchorElement, page: Route): void {
    this.links.push({ element, page });
  }

  public markCurrent(currentPage: Route | undefined): void {
    for (const link of this.links) {
      if (link.page === currentPage) {
        link.element.setAttribute('aria-current', 'page');
      } else {
        link.element.removeAttribute('aria-current');
      }
    }
  }
}

function createNavigationItem(link: NavigationLink, pageLinks: PageLinks): HTMLLIElement {
  const anchor: HTMLAnchorElement = createElement('a', {
    className: 'header__nav-link',
    text: link.label,
    attributes: { href: getRouteHref(link.page ?? Route.Home) },
  });
  if (link.page !== undefined) {
    pageLinks.add(anchor, link.page);
  }

  return createElement('li', { children: [anchor] });
}

function createNavigation(pageLinks: PageLinks): HTMLElement {
  const items: HTMLLIElement[] = NAVIGATION_LINKS.map((link: NavigationLink): HTMLLIElement =>
    createNavigationItem(link, pageLinks),
  );

  return createElement('nav', {
    className: 'header__nav',
    attributes: { 'aria-label': 'Main navigation' },
    children: [createElement('ul', { className: 'header__nav-list', children: items })],
  });
}

function createBrand(): HTMLAnchorElement {
  return createElement('a', {
    className: 'header__brand',
    attributes: { href: getRouteHref(Route.Home) },
    children: [
      createElement('span', { text: '♧', attributes: { 'aria-hidden': 'true' } }),
      createElement('span', { text: APP_NAME }),
    ],
  });
}

function createActions(): HTMLElement {
  const cart: HTMLButtonElement | HTMLAnchorElement = createButton({
    text: 'Cart',
    size: 'icon',
    variant: 'outline',
    href: getRouteHref(Route.Cart),
    // TODO: replace with an SVG icon
    icon: createElement('span', { text: '🛒', attributes: { 'aria-hidden': 'true' } }),
  });

  // TODO: link to the auth dialog (?auth=login) when the auth forms are ready
  const login: HTMLButtonElement | HTMLAnchorElement = createButton({
    text: 'Log in',
    variant: 'outline',
    href: getRouteHref(Route.Home),
  });

  const signUp: HTMLButtonElement | HTMLAnchorElement = createButton({
    text: 'Sign Up',
    href: getRouteHref(Route.Home),
  });

  return createElement('div', { className: 'header__actions', children: [cart, login, signUp] });
}

export function createHeader(): Header {
  const pageLinks: PageLinks = new PageLinks();
  const actions: HTMLElement = createActions();

  const element: HTMLElement = createElement('header', {
    className: 'header',
    children: [
      createElement('div', {
        className: 'header__inner container',
        children: [createBrand(), createNavigation(pageLinks), actions],
      }),
    ],
  });

  return {
    element,
    setCurrentPage: (page: Route | undefined): void => {
      pageLinks.markCurrent(page);
    },
  };
}
