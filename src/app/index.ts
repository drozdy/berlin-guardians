import { createElement } from './../utils/dom';
import { createFooter } from '../components/footer/footer';
import { createHeader } from '../components/header/header';

function initApp(): void {

  const main: HTMLElement = createElement('main');
  document.body.append(
    createHeader(),
    main,
    createFooter()
  );
}

initApp()