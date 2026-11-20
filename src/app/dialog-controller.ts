import type { ModalDialog } from '../components/modal/modal';
import { DialogParameter, type OpenDialog } from '../types/routes';
import type { Router } from './router';

export interface DialogController {
  readonly syncWithDialog: (dialog: OpenDialog | undefined) => void;
  readonly closeDialogInUrl: () => void;
}

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
  return `Product: ${dialog.slug}`;
}

export function createDialogController(router: Router, modal: ModalDialog): DialogController {
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

  const syncWithDialog = (dialog: OpenDialog | undefined): void => {
    if (dialog === undefined) {
      modal.hide();
      return;
    }

    modal.setTitle(getDialogTitle(dialog));
    modal.content.replaceChildren();

    if (dialog.parameter === DialogParameter.Auth) {
      // render registration/login form here (dialog.mode)
    } else if (dialog.parameter === DialogParameter.Product) {
      // render Product card here (dialog.slug)
    }

    modal.show();
  };

  return {
    syncWithDialog,
    closeDialogInUrl,
  };
}
