import { getRouteHref } from '../../app/router';
import { Route } from './../../types/routes';
import { createElement } from './../../utils/dom';
import './header.css';

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
      link.element.setAttribute('aria-current', link.page === currentPage ? 'page' : 'false');
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

export function createHeader(): Header {
  const pageLinks: PageLinks = new PageLinks();

  const element: HTMLElement = createElement('header', {
    className: 'header',
    children: [
      createElement('div', {
        className: 'header__inner',
        children: [
          createNavigation(pageLinks),
        ],
      }),
    ],
  });

  return {
    element,
    setCurrentPage: (page: Route | undefined): void => {
      pageLinks.markCurrent(page);
    }
  };
}