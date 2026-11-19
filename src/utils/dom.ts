type ElementChild = Node | string;

export interface CreateElementOptions {
  className?: string;
  text?: string;
  attributes?: Readonly<Record<string, string>>;
  dataset?: Readonly<Record<string, string>>;
  events?: {
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void;
  };
  children?: readonly ElementChild[];
}

export function createElement<K extends string>(
  tagName: K,
  options: CreateElementOptions = {},
): K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : HTMLElement {
  const element = document.createElement(tagName);

  if (options.className !== undefined) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  const attrs = options.attributes;
  if (attrs) {
    for (const name in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, name)) {
        element.setAttribute(name, attrs[name]);
      }
    }
  }

  const ds = options.dataset;
  if (ds) {
    for (const key in ds) {
      if (Object.prototype.hasOwnProperty.call(ds, key)) {
        element.dataset[key] = ds[key];
      }
    }
  }

  const evs = options.events;
  if (evs) {
    for (const eventName in evs) {
      if (Object.prototype.hasOwnProperty.call(evs, eventName)) {
        const handler = evs[eventName as keyof HTMLElementEventMap];
        if (handler) {
          element.addEventListener(eventName, handler as EventListener);
        }
      }
    }
  }

  const childElements = options.children;
  if (childElements && childElements.length > 0) {
    element.append(...childElements);
  }

  // TODO: remove when createElement is properly typed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return element as any;
}
