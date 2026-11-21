import { createElement } from '../../../utils/dom';
import './badge.css';

export function createBadge(text: string): HTMLSpanElement {
  return createElement('span', { className: 'badge', text });
}
