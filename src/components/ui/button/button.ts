import { createElement } from '../../../utils/dom';
import './button.css';

export type ButtonVariant = 'primary' | 'outline';
export type ButtonSize = 'large' | 'medium' | 'small' | 'icon';

export interface ButtonOptions {
  // for size 'icon' the text is visually hidden but still read by screen readers
  readonly text: string;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  // with href the result is a link styled as a button
  readonly href?: string;
  readonly type?: 'button' | 'submit';
  readonly icon?: HTMLElement;
}

function getClassName(variant: ButtonVariant, size: ButtonSize): string {
  return `btn btn--${variant} btn--${size}`;
}

function createContent(options: ButtonOptions, size: ButtonSize): (HTMLElement | string)[] {
  const label: HTMLElement | string =
    size === 'icon'
      ? createElement('span', { className: 'visually-hidden', text: options.text })
      : options.text;

  return options.icon ? [options.icon, label] : [label];
}

export function createButton(options: ButtonOptions): HTMLButtonElement | HTMLAnchorElement {
  const variant: ButtonVariant = options.variant ?? 'primary';
  const size: ButtonSize = options.size ?? 'medium';
  const className: string = getClassName(variant, size);
  const children: (HTMLElement | string)[] = createContent(options, size);

  if (options.href !== undefined) {
    return createElement('a', { className, attributes: { href: options.href }, children });
  }

  return createElement('button', {
    className,
    attributes: { type: options.type ?? 'button' },
    children,
  });
}
