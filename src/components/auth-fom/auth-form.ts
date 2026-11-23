import { createElement } from '../../utils/dom';
import { AuthMode } from '../../types/auth';
import './auth-form.css';

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthFormOptions {
  readonly mode: AuthMode;
  readonly onSubmit: (credentials: AuthCredentials, mode: AuthMode) => Promise<void> | void;
  readonly onSwitchMode: (nextMode: AuthMode) => void;
}

export interface AuthFormView {
  readonly element: HTMLFormElement;
  readonly setError: (message: string) => void;
  readonly setSubmitting: (isSubmitting: boolean) => void;
}

export function createAuthForm(options: AuthFormOptions): AuthFormView {
  const isRegister = options.mode === 'register';

  const description = createElement('p', {
    className: 'auth-form__description',
    text: isRegister
      ? 'Create an account to save your progress and items.'
      : 'Sign in with your email and password.',
  });

  const emailInput = createElement('input', {
    className: 'auth-form__input',
    attributes: {
      id: 'auth-email',
      name: 'email',
      type: 'email',
      autocomplete: 'email',
      required: 'true',
      placeholder: 'name@example.com',
    },
  });

  const emailLabel = createElement('label', {
    className: 'auth-form__label',
    text: 'Email',
    attributes: { for: 'auth-email' },
  });

  const emailField = createElement('div', {
    className: 'auth-form__field',
    children: [emailLabel, emailInput],
  });

  const passwordInput = createElement('input', {
    className: 'auth-form__input',
    attributes: {
      id: 'auth-password',
      name: 'password',
      type: 'password',
      autocomplete: isRegister ? 'new-password' : 'current-password',
      required: 'true',
      minlength: '6',
      placeholder: '••••••••',
    },
  });

  const passwordLabel = createElement('label', {
    className: 'auth-form__label',
    text: 'Password',
    attributes: { for: 'auth-password' },
  });

  const passwordField = createElement('div', {
    className: 'auth-form__field',
    children: [passwordLabel, passwordInput],
  });

  const errorText = createElement('p', {
    className: 'auth-form__error',
    attributes: { role: 'alert', 'aria-live': 'polite' },
  });

  const submitButton = createElement('button', {
    className: 'auth-form__submit',
    text: isRegister ? 'Create account' : 'Sign in',
    attributes: { type: 'submit' },
  });

  const switchModeButton = createElement('button', {
    className: 'auth-form__switch',
    text: isRegister ? 'Already have an account? Sign in' : 'Need an account? Register',
    attributes: { type: 'button' },
  });

  const actionsRow = createElement('div', {
    className: 'auth-form__actions',
    children: [submitButton, switchModeButton],
  });

  const form = createElement('form', {
    className: 'auth-form',
    attributes: { novalidate: 'true' },
    children: [description, emailField, passwordField, errorText, actionsRow],
  });

  const setError = (message: string): void => {
    errorText.textContent = message;
  };

  const setSubmitting = (isSubmitting: boolean): void => {
    submitButton.disabled = isSubmitting;
    emailInput.disabled = isSubmitting;
    passwordInput.disabled = isSubmitting;
  };

  switchModeButton.addEventListener('click', (): void => {
    const nextMode: AuthMode = isRegister ? AuthMode.Login : AuthMode.Register;
    options.onSwitchMode(nextMode);
  });

  form.addEventListener('submit', async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    setError('');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await options.onSubmit({ email, password }, options.mode);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  });

  return {
    element: form,
    setError,
    setSubmitting,
  };
}
