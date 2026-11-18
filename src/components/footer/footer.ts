//import './footer.css';
import { createElement } from '../../utils/dom';

export function createFooter(): HTMLElement {
  return createElement('footer', { className: 'footer'});
}