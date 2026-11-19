import { createElement } from './../../utils/dom';
import './modal.css';

export interface ModalDialog {
  readonly element: HTMLElement;
  readonly content: HTMLElement;
  readonly show: () => void;
  readonly hide: () => void;
  readonly setTitle: (title: string) => void;
}

export interface ModalDialogOptions {
  readonly onClose?: () => void;
}

export function createDialogModal(
  initialTitle: string,
  isOpen: boolean,
  options?: ModalDialogOptions,
): ModalDialog {
  const closeButton: HTMLButtonElement = createElement('button', {
    className: 'close-btn',
    text: '×',
    attributes: {
      id: 'close-modal',
      type: 'button',
      'aria-label': 'Close dialog',
    },
  });

  const modalTitle: HTMLHeadingElement = createElement('h2', {
    text: initialTitle,
  });

  const content: HTMLDivElement = createElement('div', {
    className: 'modal-content',
  });

  const modalWindow: HTMLDivElement = createElement('div', {
    className: 'modal-dialog',
    children: [closeButton, modalTitle, content],
  });

  const modalOverlay: HTMLDivElement = createElement('div', {
    className: 'modal-overlay',
    children: [modalWindow],
  });

  const hide = (): void => {
    modalOverlay.classList.remove('active');
    options?.onClose?.();
  };

  const show = (): void => {
    modalOverlay.classList.add('active');
  };

  const setTitle = (title: string): void => {
    modalTitle.textContent = title;
  };

  if (isOpen) {
    show();
  }

  closeButton.addEventListener('click', (): void => {
    hide();
  });

  modalOverlay.addEventListener('click', (event: MouseEvent): void => {
    if (event.target === modalOverlay) {
      hide();
    }
  });

  document.addEventListener('keydown', (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
      hide();
    }
  });

  return {
    element: modalOverlay,
    content,
    show,
    hide,
    setTitle,
  };
}