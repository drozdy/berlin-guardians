import { getRouteHref } from '../../utils/url';
import { createButton } from '../ui/button/button';
import { Route } from './../../types/routes';
import { createElement } from './../../utils/dom';
import { createMobileMenu, type MobileMenu } from './mobile-menu';
import './header.css';
import { createBrand } from '../brand/brand';
import { AuthMode } from '../../types/auth';

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

export interface HeaderOptions {
  // Log In asks for the login form and Sign Up for the registration form
  readonly onAuthClick?: (mode: AuthMode) => void;
  // Log Out ends the session of the signed-in user
  readonly onLogout?: () => void;
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

function createNavigation(pageLinks: PageLinks, className: string): HTMLElement {
  const items: HTMLLIElement[] = NAVIGATION_LINKS.map((link: NavigationLink): HTMLLIElement =>
    createNavigationItem(link, pageLinks),
  );

  return createElement('nav', {
    className,
    attributes: { 'aria-label': 'Main navigation' },
    children: [createElement('ul', { className: 'header__nav-list', children: items })],
  });
}

function createAuthButtons(options: HeaderOptions): HTMLElement[] {
  // TODO: link to the auth dialog (?auth=login) when the auth forms are ready
  return [
    createButton({
      text: 'Log in',
      variant: 'outline',
      onClick: (): void => {
        console.log('TEST');
        options.onAuthClick?.(AuthMode.Login);
      },
    }),
    createButton({
      text: 'Sign Up',
      onClick: (): void => {
        console.log('sign up');
        options.onAuthClick?.(AuthMode.Register);
      },
    }),
  ];
}

function createActions(menuButton: HTMLButtonElement, options: HeaderOptions): HTMLElement {
  const cart: HTMLButtonElement | HTMLAnchorElement = createButton({
    text: 'Cart',
    size: 'icon',
    variant: 'outline',
    href: getRouteHref(Route.Cart),
    // TODO: replace with an SVG icon
    icon: createElement('span', { text: '🛒', attributes: { 'aria-hidden': 'true' } }),
  });

  return createElement('div', {
    className: 'header__actions',
    children: [
      cart,
      createElement('div', { className: 'header__auth', children: createAuthButtons(options) }),
      menuButton,
    ],
  });
}

export function createHeader(options: HeaderOptions): Header {
  const pageLinks: PageLinks = new PageLinks();
  const menu: MobileMenu = createMobileMenu([
    createNavigation(pageLinks, 'mobile-menu__nav'),
    createElement('div', { className: 'mobile-menu__auth', children: createAuthButtons(options) }),
  ]);

  const element: HTMLElement = createElement('header', {
    className: 'header',
    children: [
      createElement('div', {
        className: 'header__inner container',
        children: [
          createBrand(),
          createNavigation(pageLinks, 'header__nav'),
          createActions(menu.button, options),
        ],
      }),
      menu.panel,
    ],
  });

  return {
    element,
    setCurrentPage: (page: Route | undefined): void => {
      pageLinks.markCurrent(page);
      menu.close();
    },
  };
}
