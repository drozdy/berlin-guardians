import { createElement } from '../../../utils/dom';

export interface PictureSource {
  readonly type: string;
  readonly srcset: string;
}

export interface PictureData {
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly sources: readonly PictureSource[];
  readonly fallback: string;
}

export function createPicture(image: PictureData, className: string): HTMLPictureElement {
  const sources: HTMLSourceElement[] = image.sources.map((source): HTMLSourceElement =>
    createElement('source', {
      attributes: { type: source.type, srcset: source.srcset },
    }),
  );

  const img: HTMLImageElement = createElement('img', {
    className: `${className}__image`,
    attributes: {
      src: image.fallback,
      alt: image.alt,
      width: String(image.width),
      height: String(image.height),
      loading: 'lazy',
      decoding: 'async',
    },
  });

  return createElement('picture', {
    className,
    children: [...sources, img],
  });
}
