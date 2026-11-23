import type { ModalDialog } from '../components/modal/modal';
import { DialogParameter, type OpenDialog } from '../types/routes';
import type { Router } from './router';
import { createAuthForm } from '../components/auth-form/auth-form';
import { AuthMode } from '../types/auth';
import { loginWithEmail, registerWithEmail, formatAuthError } from '../services/auth';

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
      const mode: AuthMode = dialog.mode === AuthMode.Register ? AuthMode.Register : AuthMode.Login;

      const authForm = createAuthForm({
        mode,
        onSwitchMode: (nextMode: AuthMode): void => {
          const nextQuery = new URLSearchParams(router.location.query);
          nextQuery.set(DialogParameter.Auth, nextMode);
          router.navigate({ path: router.location.path, query: nextQuery });
        },
        onSubmit: async (credentials): Promise<void> => {
          authForm.setError('');
          authForm.setSubmitting(true);

          try {
            if (mode === AuthMode.Register) {
              await registerWithEmail(credentials.email, credentials.password);
            } else {
              await loginWithEmail(credentials.email, credentials.password);
            }

            // on success
            closeDialogInUrl();
          } catch (error: unknown) {
            authForm.setError(formatAuthError(error));
          } finally {
            authForm.setSubmitting(false);
          }
        },
      });
      modal.content.append(authForm.element);
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
