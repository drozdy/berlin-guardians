import { createElement } from '../../../utils/dom';
import './badge.css';

export type BadgeVariant = 'accent' | 'price-free' | 'price-paid';

export function createBadge(text: string, variant: BadgeVariant = 'accent'): HTMLSpanElement {
  return createElement('span', {
    className: variant === 'accent' ? 'badge' : `badge badge--${variant}`,
    text,
  });
}
