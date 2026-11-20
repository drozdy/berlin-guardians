import './../styles/tokens.css';
import { createElement } from './../utils/dom';
import { createFooter } from '../components/footer/footer';
import { type Header, createHeader } from '../components/header/header';
import { type ModalDialog, createDialogModal } from '../components/modal/modal';
import {
  Route,
  type AppLocation,
  type OpenDialog,
  type PageDefinition,
  type PageView,
  type RouteDefinition,
} from '../types/routes';
import { Router, parseDialog } from './router';
import { type DialogController, createDialogController } from './dialog-controller';
import { renderHomePage } from '../pages/home/home-page';
import { renderCatalogPage } from '../pages/catalog/catalog-page';
import { renderNotFoundPage } from '../pages/404/not-found-page';

const APP_TITLE = 'Berlin guardians';
const APP_CATALOG_TITLE = `Catalog | ${APP_TITLE}`;

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
      render: (location: AppLocation): PageView => renderCatalogPage(APP_CATALOG_TITLE, location),
    },
  ];

  const notFound: PageDefinition = {
    title: 'Page not found',
    render: (): PageView => renderNotFoundPage(),
  };

  const main: HTMLElement = createElement('main');
  const router: Router = new Router(routes, notFound, main);

  const header: Header = createHeader();

  const modal: ModalDialog = createDialogModal('', false, {
    onClose: (): void => {
      dialogController?.closeDialogInUrl();
    },
  });

  const dialogController: DialogController | undefined = createDialogController(router, modal);

  document.body.append(header.element, main, createFooter(), modal.element);

  router.onChange((location: AppLocation): void => {
    header.setCurrentPage(location.route);

    const dialog: OpenDialog | undefined = parseDialog(location.query);
    dialogController?.syncWithDialog(dialog);
  });

  router.start();
}

initApp();
