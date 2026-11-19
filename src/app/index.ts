import './../styles/tokens.css';
import { createElement } from './../utils/dom';
import { createFooter } from '../components/footer/footer';
import { type Header, createHeader } from '../components/header/header';
import { type ModalDialog, createDialogModal } from '../components/modal/modal';
import {
  DialogParameter,
  Route,
  type AppLocation,
  type OpenDialog,
  type PageDefinition,
  type PageView,
  type RouteDefinition,
} from '../types/routes';
import { Router, parseDialog } from './router';
import { renderHomePage } from '../pages/home/home-page';
import { renderCatalogPage } from '../pages/catalog/catalog-page';
import { renderNotFoundPage } from '../pages/404/not-found-page';

const APP_TITLE = 'Berlin guardians';
const APP_CATALOG_TITLE = `Catalog | ${APP_TITLE}`;

function hasDialogQueryParams(query: URLSearchParams): boolean {
  return query.has(DialogParameter.Auth) || query.has(DialogParameter.Product);
}

function createQueryWithoutDialog(query: URLSearchParams): URLSearchParams {
  const nextQuery: URLSearchParams = new URLSearchParams(query);
  nextQuery.delete(DialogParameter.Auth);
  nextQuery.delete(DialogParameter.Product);
  return nextQuery;
}

function getDialogTitle(dialog: OpenDialog): string {
  if (dialog.parameter === DialogParameter.Auth) {
    return dialog.mode === 'register' ? 'Register' : 'Sign in';
  }
  return `Product`;
}

function initApp(): void {
  const routes: readonly RouteDefinition[] = [
    {
      path: Route.Home,
      title: APP_TITLE,
      render: (): PageView => renderHomePage(),
    },
    {
      path: Route.Catalog,
      title: APP_CATALOG_TITLE,
      render: (location: AppLocation): PageView =>
        renderCatalogPage(APP_CATALOG_TITLE, location),
    },
  ];

  const notFound: PageDefinition = {
    title: 'Page not found',
    render: (): PageView => renderNotFoundPage(),
  };

  const main: HTMLElement = createElement('main');
  const router: Router = new Router(routes, notFound, main);

  const closeDialogInUrl = (): void => {
    const currentQuery: URLSearchParams = router.location.query;
    if (!hasDialogQueryParams(currentQuery)) {
      return;
    }

    router.navigate(
      {
        path: router.location.path,
        query: createQueryWithoutDialog(currentQuery),
      },
      { isReplace: true },
    );
  };

  const modal: ModalDialog = createDialogModal('', false, {
    onClose: closeDialogInUrl,
  });

  const showDialog = (dialog: OpenDialog | undefined): void => {
    if (dialog === undefined) {
      modal.hide();
      return;
    }

    modal.setTitle(getDialogTitle(dialog));
    modal.content.replaceChildren();

    if (dialog.parameter === DialogParameter.Auth) {
      // generate auth form content
    } else if (dialog.parameter === DialogParameter.Product) {
      // generate product content
    }

    modal.show();
  };

  const header: Header = createHeader();

  document.body.append(header.element, main, createFooter(), modal.element);

  router.onChange((location: AppLocation): void => {
    header.setCurrentPage(location.route);

    const dialog: OpenDialog | undefined = parseDialog(location.query);
    showDialog(dialog);
  });

  router.start();
}

initApp();