//import './header.css';
import { createElement } from './../../utils/dom';

export function createHeader(): HTMLElement {
  return createElement('header', { className: 'header'});
}